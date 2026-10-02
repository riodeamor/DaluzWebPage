import { MercadoPagoConfig, Payment } from "mercadopago";
import { getMercadoPagoAccessToken } from "@/lib/mercadopago/config";
import { OrdersRepository, PaymentConflictError } from "@/lib/repositories/orders.repository";
import { SystemRepository } from "@/lib/repositories/system.repository";
import { OrderPaymentService } from "./order-payment.service";

// ============================================
// Types
// ============================================

export interface WebhookPayload {
  type: string;
  data: {
    id: string | number;
  };
  action?: string;
  api_version?: string;
  date_created?: string;
  id?: string | number;
  live_mode?: boolean;
  user_id?: string | number;
}

interface FeeDetail {
  type: string;
  amount: number;
  fee_payer: string;
}

type MercadoPagoStatus =
  | "approved"
  | "pending"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "in_process"
  | "in_mediation";

interface OrderUpdateData {
  status: string;
  payment_status?: string;
  mercadopago_payment_id: string | number;
  payment_method: string | undefined;
  installments: number;
  updated_at: string;
  transaction_amount?: number;
  net_received_amount?: number;
  fees?: number;
}

// ============================================
// Constants
// ============================================

const STATUS_MAPPING: Record<MercadoPagoStatus, string> = {
  approved: "paid",
  pending: "pending",
  rejected: "failed",
  cancelled: "cancelled",
  refunded: "refunded",
  in_process: "processing",
  in_mediation: "disputed",
};

// ============================================
// Service
// ============================================

export class WebhookService {
  constructor(
    private ordersRepo: OrdersRepository,
    private systemRepo: SystemRepository,
    private paymentService: OrderPaymentService,
  ) {}

  /**
   * Log webhook receipt in the database.
   */
  async logWebhook(
    body: WebhookPayload,
    status: "pending" | "success" | "failed",
    options?: { responseCode?: number; errorMessage?: string },
  ): Promise<string | undefined> {
    try {
      return await this.systemRepo.insertWebhookLog({
        webhook_type: "mercadopago",
        event_type: body?.type || "unknown",
        payload: status === "failed" && options?.errorMessage
          ? { error: options.errorMessage }
          : body,
        status,
        response_code: options?.responseCode,
        error_message: options?.errorMessage,
        processed_at: status !== "pending" ? new Date().toISOString() : null,
      });
    } catch (logError) {
      console.error("Error logging webhook:", logError);
    }
  }

  /**
   * Update this request's log; concurrent requests own different rows.
   */
  async updateWebhookLog(
    logId: string | undefined,
    status: "success" | "failed",
    options?: { responseCode?: number; errorMessage?: string },
  ): Promise<void> {
    if (!logId) return;
    try {
      await this.systemRepo.updateWebhookLog(logId, {
        status,
        response_code: options?.responseCode || (status === "success" ? 200 : 500),
        error_message: options?.errorMessage,
        processed_at: new Date().toISOString(),
      });
    } catch (logError) {
      console.error("Error updating webhook log:", logError);
    }
  }

  /**
   * Process a payment notification from MercadoPago.
   * Fetches payment info and confirms payment, inventory and recoverable email work.
   */
  async processPayment(paymentId: string | number): Promise<void> {
    const accessToken = await getMercadoPagoAccessToken();
    const mpClient = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 5000 },
    });
    const payment = new Payment(mpClient);

    const paymentInfo = await payment.get({ id: paymentId as number });

    if (!paymentInfo?.external_reference || String(paymentInfo.id) !== String(paymentId)) {
      throw new Error("Payment response missing a matching id or order reference");
    }

    const orderId = paymentInfo.external_reference;
    const mpStatus = paymentInfo.status as MercadoPagoStatus;
    if (!Object.prototype.hasOwnProperty.call(STATUS_MAPPING, mpStatus)) {
      throw new Error(`Unsupported MercadoPago payment status: ${paymentInfo.status}`);
    }
    const orderStatus = STATUS_MAPPING[mpStatus];
    const existingOrder = await this.ordersRepo.findById(orderId);
    if (!existingOrder) throw new Error("Payment references an unknown order");
    if (existingOrder.payment_method === "bank_transfer") {
      throw new Error("MercadoPago payment cannot confirm a bank transfer order");
    }

    const amount = paymentInfo.transaction_amount;
    if (
      typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0 ||
      amount !== Number(existingOrder.total_amount) ||
      paymentInfo.currency_id !== existingOrder.currency
    ) {
      throw new Error("Payment amount or currency does not match the order");
    }

    const samePayment = String(existingOrder.mercadopago_payment_id) === String(paymentId);
    const settled =
      ["paid", "refunded", "partially_refunded"].includes(existingOrder.payment_status) ||
      ["paid", "completed", "shipped", "delivered", "refunded"].includes(existingOrder.status);
    if (settled && !samePayment) {
      throw new Error("Order already settled by another payment; manual reconciliation required");
    }
    // A late approval must never resurrect a refund or repeat fulfillment.
    if (existingOrder.payment_status === "refunded" || existingOrder.status === "refunded") return;
    if (settled && ["pending", "in_process", "rejected", "cancelled"].includes(mpStatus)) return;
    if (existingOrder.status === "cancelled" && mpStatus !== "cancelled") {
      throw new Error("Cancelled order requires manual payment reconciliation");
    }
    if (
      samePayment &&
      (existingOrder.payment_status === "failed" || existingOrder.status === "failed") &&
      ["pending", "in_process"].includes(mpStatus)
    ) return;

    const updateData: OrderUpdateData = {
      status: orderStatus,
      mercadopago_payment_id: paymentId,
      payment_method: paymentInfo.payment_method_id,
      installments: paymentInfo.installments || 1,
      updated_at: new Date().toISOString(),
    };

    if (mpStatus === "approved") {
      updateData.transaction_amount = amount;
      updateData.net_received_amount =
        paymentInfo.transaction_details?.net_received_amount ?? amount;

      const feeDetails = paymentInfo.fee_details as FeeDetail[] | undefined;
      updateData.fees = feeDetails
        ? feeDetails.reduce((sum: number, fee: FeeDetail) => sum + fee.amount, 0)
        : 0;

      if (settled) {
        // Only a resolved dispute changes an already paid order on approval.
        if (existingOrder.status !== "disputed") {
          await this.paymentService.resumeEffects(orderId);
          return;
        }
        updateData.payment_status = existingOrder.payment_status;
      } else {
        await this.paymentService.confirmOrderPayment(
          orderId,
          { ...updateData },
          existingOrder,
        );
        return;
      }
    } else if (mpStatus === "refunded") {
      updateData.payment_status = "refunded";
    } else if (mpStatus === "rejected" || mpStatus === "cancelled") {
      updateData.payment_status = "failed";
    } else if (mpStatus !== "in_mediation") {
      updateData.payment_status = "pending";
    }

    const updated = await this.ordersRepo.updatePaymentIfUnchanged(existingOrder, { ...updateData });
    if (!updated) throw new PaymentConflictError();
    if (mpStatus === "approved") await this.paymentService.resumeEffects(orderId);

    console.log(
      `Order ${orderId} updated to status: ${orderStatus} (MP status: ${paymentInfo.status})`,
    );
  }

  /**
   * Get the webhook secret from database or env.
   */
  async getWebhookSecret(): Promise<string | undefined> {
    try {
      const configs = await this.systemRepo.getConfigs([
        "mercadopago_test_mode",
        "mercadopago_webhook_secret",
        "mercadopago_test_webhook_secret",
      ]);

      if (configs && configs.length > 0) {
        const configMap: Record<string, string | boolean> = {};
        configs.forEach((config: { config_key: string; config_value: string }) => {
          try {
            configMap[config.config_key] = JSON.parse(config.config_value);
          } catch {
            configMap[config.config_key] = config.config_value;
          }
        });

        const testMode =
          configMap["mercadopago_test_mode"] === true ||
          configMap["mercadopago_test_mode"] === "true";
        const webhookSecret = testMode
          ? configMap["mercadopago_test_webhook_secret"]
          : configMap["mercadopago_webhook_secret"];

        if (
          webhookSecret &&
          typeof webhookSecret === "string" &&
          webhookSecret !== "WEBHOOK_SECRET_HERE" &&
          webhookSecret !== "TEST_WEBHOOK_SECRET_HERE"
        ) {
          return webhookSecret;
        }
      }
    } catch {
      console.warn("Failed to load webhook secret from database, using env fallback");
    }

    return process.env.MERCADOPAGO_WEBHOOK_SECRET;
  }
}
