import { describe, expect, it, vi } from "vitest";
import { OrdersRepository, PaymentConflictError, type PaymentOrderSnapshot } from "./orders.repository";

const snapshot: PaymentOrderSnapshot = {
  id: "o1", status: "pending", payment_status: "pending",
  mercadopago_payment_id: null, total_amount: 1000, currency: "ARS",
  updated_at: "2026-09-28T00:00:00.000Z",
};

function setup(data: { id: string } | null, error: Error | null = null) {
  const query = {
    update: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(), select: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data, error }),
  };
  const db = { from: vi.fn().mockReturnValue(query) };
  return { repo: new OrdersRepository(db as never), db, query };
}

describe("atomic payment update", () => {
  it("delegates confirmation to the atomic RPC with the verified snapshot", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: true, error: null });
    const repo = new OrdersRepository({ rpc } as never);
    expect(await repo.confirmPayment(snapshot, { fees: 50 })).toBe(true);
    expect(rpc).toHaveBeenCalledExactlyOnceWith("confirm_order_payment_once", {
      p_order_id: snapshot.id, p_expected: snapshot, p_payment: { fees: 50 },
    });
  });

  it("returns duplicate confirmation as false and maps serialization conflicts", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: false, error: null });
    const repo = new OrdersRepository({ rpc } as never);
    expect(await repo.confirmPayment(snapshot, {})).toBe(false);
    rpc.mockResolvedValue({ data: null, error: { code: "40001" } });
    await expect(repo.confirmPayment(snapshot, {})).rejects.toBeInstanceOf(PaymentConflictError);
    rpc.mockResolvedValue({ data: null, error: new Error("RPC unavailable") });
    await expect(repo.confirmPayment(snapshot, {})).rejects.toThrow("RPC unavailable");
  });

  it("conditions one UPDATE on the entire payment snapshot", async () => {
    const { repo, query } = setup({ id: "o1" });
    const patch = { payment_status: "paid" };
    expect(await repo.updatePaymentIfUnchanged(snapshot, patch)).toBe(true);
    expect(query.update).toHaveBeenCalledExactlyOnceWith(patch);
    expect(query.eq.mock.calls).toEqual([
      ["id", "o1"], ["status", "pending"], ["updated_at", snapshot.updated_at],
      ["total_amount", 1000], ["currency", "ARS"], ["payment_status", "pending"],
    ]);
    expect(query.is).toHaveBeenCalledWith("mercadopago_payment_id", null);
    expect(query.select).toHaveBeenCalledWith("id");
  });

  it("returns false if another request already changed the row", async () => {
    const { repo } = setup(null);
    expect(await repo.updatePaymentIfUnchanged(snapshot, { payment_status: "paid" })).toBe(false);
  });

  it("matches legacy null payment status with IS NULL", async () => {
    const { repo, query } = setup({ id: "o1" });
    await repo.updatePaymentIfUnchanged({ ...snapshot, payment_status: null, mercadopago_payment_id: "123" }, {});
    expect(query.is).toHaveBeenCalledWith("payment_status", null);
    expect(query.eq).toHaveBeenCalledWith("mercadopago_payment_id", "123");
  });

  it("propagates database failures instead of granting the claim", async () => {
    const { repo } = setup(null, new Error("database failure"));
    await expect(repo.updatePaymentIfUnchanged(snapshot, {})).rejects.toThrow("database failure");
  });
});
