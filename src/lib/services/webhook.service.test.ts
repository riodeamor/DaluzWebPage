import { beforeEach, describe, expect, it, vi } from "vitest";
import { WebhookService } from "./webhook.service";
import type { PaymentOrderSnapshot } from "@/lib/repositories/orders.repository";

const mocks = vi.hoisted(() => ({ getPayment: vi.fn() }));
vi.mock("mercadopago", () => ({
  MercadoPagoConfig: class {},
  Payment: class { get = mocks.getPayment; },
}));
vi.mock("@/lib/mercadopago/config", () => ({ getMercadoPagoAccessToken: async () => "test-token" }));

type Order = PaymentOrderSnapshot & { user_id: string; email: string; payment_method: string | null };
const approved = {
  id: 123, external_reference: "o1", status: "approved", transaction_amount: 1000,
  currency_id: "ARS", payment_method_id: "visa", installments: 1,
  transaction_details: { net_received_amount: 950 }, fee_details: [{ amount: 50 }],
};

function setup(overrides: Partial<Order> = {}) {
  const order: Order = {
    id: "o1", user_id: "u1", email: "test@example.com", status: "pending",
    payment_status: "pending", mercadopago_payment_id: null, payment_method: null,
    total_amount: 1000, currency: "ARS", updated_at: "2026-09-28T00:00:00.000Z",
    ...overrides,
  };
  const orders = {
    findById: vi.fn(async () => ({ ...order })),
    findByIdWithItems: vi.fn(async () => ({ ...order })),
    getItemsByOrderId: vi.fn(async () => [{ product_id: "p1", quantity: 2 }]),
    updatePaymentIfUnchanged: vi.fn(async (snapshot: PaymentOrderSnapshot, patch: Record<string, unknown>) => {
      const keys: (keyof PaymentOrderSnapshot)[] = ["status", "payment_status", "mercadopago_payment_id", "updated_at", "total_amount", "currency"];
      if (keys.some((key) => order[key] !== snapshot[key])) return false;
      Object.assign(order, patch);
      return true;
    }),
  };
  // Model the atomic RPC boundary; real SQL is tested separately in PGlite.
  const payment = {
    confirmOrderPayment: vi.fn(async (_id: string, patch: Record<string, unknown>) => {
      if (order.payment_status === "paid") return false;
      Object.assign(order, patch, { payment_status: "paid" });
      return true;
    }),
    resumeEffects: vi.fn().mockResolvedValue(undefined),
  };
  const system = {
    grantTreasures: vi.fn().mockResolvedValue([]),
    insertWebhookLog: vi.fn(), updateWebhookLog: vi.fn(),
  };
  return { order, orders, payment, system, service: new WebhookService(orders as never, system as never, payment as never) };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getPayment.mockResolvedValue({ ...approved });
});

describe("payment webhook transitions", () => {
  it("confirms once and resumes queued effects on duplicate approval", async () => {
    const { service, order, orders, payment } = setup();
    await service.processPayment(123);
    await service.processPayment(123);
    expect(order.payment_status).toBe("paid");
    expect(order.total_amount).toBe(1000);
    expect(orders.updatePaymentIfUnchanged).not.toHaveBeenCalled();
    expect(payment.confirmOrderPayment).toHaveBeenCalledTimes(1);
    expect(payment.confirmOrderPayment.mock.calls[0][1]).not.toHaveProperty("total_amount");
    expect(payment.confirmOrderPayment.mock.calls[0][1]).toMatchObject({ net_received_amount: 950, fees: 50 });
    expect(payment.resumeEffects).toHaveBeenCalledExactlyOnceWith("o1");
  });

  it("delegates concurrent approvals to the atomic confirmation boundary", async () => {
    const { service, payment } = setup();
    await Promise.all([service.processPayment(123), service.processPayment(123)]);
    expect(payment.confirmOrderPayment).toHaveBeenCalledTimes(2);
    expect(await payment.confirmOrderPayment.mock.results[0].value).toBe(true);
    expect(await payment.confirmOrderPayment.mock.results[1].value).toBe(false);
    await service.processPayment(123);
    expect(payment.resumeEffects).toHaveBeenCalledWith("o1");
  });

  it.each(["shipped", "delivered", "completed", "processing"])("preserves %s on duplicate approval", async (status) => {
    const { service, order, orders, payment } = setup({ status, payment_status: "paid", mercadopago_payment_id: "123" });
    await service.processPayment(123);
    expect(order.status).toBe(status);
    expect(orders.updatePaymentIfUnchanged).not.toHaveBeenCalled();
    expect(payment.confirmOrderPayment).not.toHaveBeenCalled();
  });

  it("still runs fulfillment when an in_process payment becomes approved", async () => {
    const { service, order, payment } = setup({ status: "processing", mercadopago_payment_id: "123" });
    await service.processPayment(123);
    expect(order.payment_status).toBe("paid");
    expect(payment.confirmOrderPayment).toHaveBeenCalledTimes(1);
  });

  it.each(["pending", "in_process", "rejected", "cancelled"])("ignores late %s after payment", async (status) => {
    mocks.getPayment.mockResolvedValue({ ...approved, status });
    const { service, order, orders } = setup({ status: "shipped", payment_status: "paid", mercadopago_payment_id: "123" });
    await service.processPayment(123);
    expect(order.status).toBe("shipped");
    expect(order.payment_status).toBe("paid");
    expect(orders.updatePaymentIfUnchanged).not.toHaveBeenCalled();
  });

  it("records a refund without fulfillment and ignores a later approval", async () => {
    mocks.getPayment.mockResolvedValue({ ...approved, status: "refunded" });
    const { service, order, payment } = setup({ status: "paid", payment_status: "paid", mercadopago_payment_id: "123" });
    await service.processPayment(123);
    mocks.getPayment.mockResolvedValue({ ...approved });
    await service.processPayment(123);
    expect(order.payment_status).toBe("refunded");
    expect(order.status).toBe("refunded");
    expect(payment.confirmOrderPayment).not.toHaveBeenCalled();
  });

  it.each([
    { transaction_amount: 1 }, { transaction_amount: 1001 }, { currency_id: "USD" },
    { id: 456 }, { external_reference: undefined }, { status: "unknown-status" },
  ])("rejects inconsistent payment data %j without modifying the order", async (patch) => {
    mocks.getPayment.mockResolvedValue({ ...approved, ...patch });
    const { service, orders, payment } = setup();
    await expect(service.processPayment(123)).rejects.toThrow();
    expect(orders.updatePaymentIfUnchanged).not.toHaveBeenCalled();
    expect(payment.confirmOrderPayment).not.toHaveBeenCalled();
  });

  it("rejects a different payment on an already paid order", async () => {
    const { service, orders } = setup({ payment_status: "paid", status: "paid", mercadopago_payment_id: "456" });
    await expect(service.processPayment(123)).rejects.toThrow("another payment");
    expect(orders.updatePaymentIfUnchanged).not.toHaveBeenCalled();
  });

  it("cannot confirm a bank transfer through a Mercado Pago event", async () => {
    const { service, orders } = setup({ payment_method: "bank_transfer", payment_status: "awaiting_transfer" });
    await expect(service.processPayment(123)).rejects.toThrow("bank transfer");
    expect(orders.updatePaymentIfUnchanged).not.toHaveBeenCalled();
  });

  it("cannot resurrect a cancelled order", async () => {
    const { service, orders } = setup({ status: "cancelled" });
    await expect(service.processPayment(123)).rejects.toThrow("Cancelled order");
    expect(orders.updatePaymentIfUnchanged).not.toHaveBeenCalled();
  });

  it("rejects a stale write if approval wins while a pending update is in flight", async () => {
    mocks.getPayment.mockResolvedValue({ ...approved, status: "pending" });
    const { service, orders, order } = setup();
    orders.updatePaymentIfUnchanged.mockImplementationOnce(async () => {
      Object.assign(order, { payment_status: "paid", status: "paid", mercadopago_payment_id: 123 });
      return false;
    });
    await expect(service.processPayment(123)).rejects.toThrow("pedido cambio");
    expect(order.payment_status).toBe("paid");
  });

  it("updates each webhook log by its own ID even when requests finish out of order", async () => {
    const { service, system } = setup();
    system.insertWebhookLog.mockResolvedValueOnce("log-a").mockResolvedValueOnce("log-b");
    const a = await service.logWebhook({ type: "payment", data: { id: 1 } }, "pending");
    const b = await service.logWebhook({ type: "payment", data: { id: 2 } }, "pending");
    await service.updateWebhookLog(b, "success");
    await service.updateWebhookLog(a, "failed");
    expect(system.updateWebhookLog.mock.calls.map(([id, patch]) => [id, patch.status])).toEqual([
      ["log-b", "success"], ["log-a", "failed"],
    ]);
  });
});
