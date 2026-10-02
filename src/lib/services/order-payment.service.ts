import {
  OrdersRepository,
  type PaymentOrderSnapshot,
} from "@/lib/repositories/orders.repository";
import { PaymentEffectsService } from "./payment-effects.service";

/**
 * Shared by Mercado Pago and transfer confirmation. The database transaction
 * owns payment, inventory and enqueueing; external effects are recoverable work.
 */
export class OrderPaymentService {
  constructor(
    private ordersRepo: OrdersRepository,
    private effects: PaymentEffectsService,
  ) {}

  async confirmOrderPayment(
    orderId: string,
    paymentDetails: Record<string, unknown> = {},
    snapshot?: PaymentOrderSnapshot,
  ): Promise<boolean> {
    const order = snapshot ?? await this.ordersRepo.findById(orderId);
    if (!order) throw new Error("Pedido no encontrado");

    const confirmed = await this.ordersRepo.confirmPayment(order, paymentDetails);
    await this.resumeEffects(orderId);
    return confirmed;
  }

  async resumeEffects(orderId: string): Promise<void> {
    try {
      await this.effects.drain(orderId, 2);
    } catch (error) {
      // The transaction persisted the work; cron or another webhook can resume it.
      console.error("Payment effects remain queued for retry", error);
    }
  }
}
