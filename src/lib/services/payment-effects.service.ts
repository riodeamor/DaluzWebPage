import { EmailNotificationService } from "@/lib/email/notifications";
import { deliverPreparedEmail, EmailDeliveryError } from "@/lib/email/durable-delivery";
import { incrementTemplateUsage } from "@/lib/email/template-loader";
import { OrdersRepository } from "@/lib/repositories/orders.repository";
import { PaymentEffectsRepository } from "@/lib/repositories/payment-effects.repository";

export class PaymentEffectsService {
  constructor(private effects: PaymentEffectsRepository, private orders: OrdersRepository) {}

  async drain(orderId?: string, limit = 8) {
    const deadline = Date.now() + 15000;
    let succeeded = 0;
    let failed = 0;
    for (let i = 0; i < limit && Date.now() < deadline; i++) {
      const effect = await this.effects.claim(orderId);
      if (!effect) break;
      try {
        if (effect.kind !== "order_confirmation") {
          throw new EmailDeliveryError("Unsupported payment effect", true);
        }
        const order = await this.orders.findByIdWithItems(effect.order_id);
        if (!order || !["paid", "partially_refunded"].includes(order.payment_status) ||
            ["cancelled", "refunded"].includes(order.status)) {
          throw new EmailDeliveryError("Order no longer eligible for payment effects", true);
        }
        const prepared = effect.payload ?? await this.effects.prepare(
          effect, await EmailNotificationService.prepareOrderConfirmation(order as never),
        );
        if (!await this.effects.beginSend(effect)) {
          throw new EmailDeliveryError("Email lease lost or safe retry window expired", true);
        }
        const providerId = await deliverPreparedEmail(prepared, `order-confirmation/${effect.id}`);
        if (await this.effects.finish(effect, { success: true, providerId })) {
          succeeded++;
          // Usage metrics must never turn an acknowledged send into a retry.
          try { await incrementTemplateUsage(prepared.templateId); } catch { /* Best effort metric. */ }
        }
      } catch (error) {
        failed++;
        await this.effects.finish(effect, {
          success: false, error: error instanceof Error ? error.message : "Payment effect failed",
          manual: error instanceof EmailDeliveryError && error.manualReview,
        });
      }
    }
    return { succeeded, failed };
  }
}
