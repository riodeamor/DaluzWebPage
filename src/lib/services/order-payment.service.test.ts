import { describe, it, expect, vi } from "vitest";
import { OrderPaymentService } from "./order-payment.service";
import { PaymentConflictError } from "@/lib/repositories/orders.repository";

function setup() {
  const order = { id: "o1", status: "pending", payment_status: "awaiting_transfer" };
  const orders = { findById: vi.fn().mockResolvedValue(order), confirmPayment: vi.fn().mockResolvedValue(true) };
  const effects = { drain: vi.fn().mockResolvedValue({ succeeded: 2, failed: 0 }) };
  return { order, orders, effects, service: new OrderPaymentService(orders as never, effects as never) };
}

describe("transactional payment confirmation", () => {
  it("confirms before draining the durable work", async () => {
    const { service, order, orders, effects } = setup();
    expect(await service.confirmOrderPayment("o1", { fees: 50 })).toBe(true);
    expect(orders.confirmPayment).toHaveBeenCalledExactlyOnceWith(order, { fees: 50 });
    expect(effects.drain).toHaveBeenCalledExactlyOnceWith("o1", 2);
    expect(orders.confirmPayment.mock.invocationCallOrder[0]).toBeLessThan(effects.drain.mock.invocationCallOrder[0]);
  });

  it("resumes queued work even if a previous request already confirmed the order", async () => {
    const { service, orders, effects } = setup();
    orders.confirmPayment.mockResolvedValue(false);
    expect(await service.confirmOrderPayment("o1")).toBe(false);
    expect(effects.drain).toHaveBeenCalledWith("o1", 2);
  });

  it("uses the verified snapshot without a second read", async () => {
    const { service, order, orders } = setup();
    await service.confirmOrderPayment("o1", {}, order as never);
    expect(orders.findById).not.toHaveBeenCalled();
    expect(orders.confirmPayment).toHaveBeenCalledWith(order, {});
  });

  it("rejects missing orders", async () => {
    const { service, orders, effects } = setup();
    orders.findById.mockResolvedValue(null as never);
    await expect(service.confirmOrderPayment("o1")).rejects.toThrow("Pedido no encontrado");
    expect(orders.confirmPayment).not.toHaveBeenCalled();
    expect(effects.drain).not.toHaveBeenCalled();
  });

  it("does not process effects if the transaction fails", async () => {
    const { service, orders, effects } = setup();
    orders.confirmPayment.mockRejectedValue(new PaymentConflictError());
    await expect(service.confirmOrderPayment("o1")).rejects.toBeInstanceOf(PaymentConflictError);
    expect(effects.drain).not.toHaveBeenCalled();
  });

  it("leaves durable work for recovery if the immediate worker is unavailable", async () => {
    const { service, effects } = setup();
    effects.drain.mockRejectedValue(new Error("Database unavailable"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(await service.confirmOrderPayment("o1")).toBe(true);
      expect(log).toHaveBeenCalled();
    } finally { log.mockRestore(); }
  });
});
