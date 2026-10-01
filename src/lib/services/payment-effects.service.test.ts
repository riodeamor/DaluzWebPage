import { beforeEach, describe, it, expect, vi } from "vitest";
import { PaymentEffectsService } from "./payment-effects.service";
import { EmailDeliveryError, type PreparedEmail } from "@/lib/email/durable-delivery";
import type { PaymentEffect } from "@/lib/repositories/payment-effects.repository";

const mocks = vi.hoisted(() => ({ prepare: vi.fn(), deliver: vi.fn(), usage: vi.fn() }));
vi.mock("@/lib/email/notifications", () => ({ EmailNotificationService: { prepareOrderConfirmation: mocks.prepare } }));
vi.mock("@/lib/email/template-loader", () => ({ incrementTemplateUsage: mocks.usage }));
vi.mock("@/lib/email/durable-delivery", async (original) => ({
  ...await original<typeof import("@/lib/email/durable-delivery")>(), deliverPreparedEmail: mocks.deliver,
}));

const prepared: PreparedEmail = {
  templateId: "template-1",
  message: { from: "shop@example.com", to: "customer@example.com", reply_to: "help@example.com", subject: "Confirmed", html: "<p>Original</p>", text: "Original" },
};
function setup() {
  const effect: PaymentEffect = { id: "effect-1", order_id: "order-1", claim_token: "lease-1", kind: "order_confirmation", payload: null };
  const effects = {
    claim: vi.fn().mockResolvedValueOnce(effect).mockResolvedValue(null),
    prepare: vi.fn(async (_effect, payload) => payload), beginSend: vi.fn().mockResolvedValue(true),
    finish: vi.fn().mockResolvedValue(true),
  };
  const orders = { findByIdWithItems: vi.fn().mockResolvedValue({ id: "order-1", user_id: "user-1", payment_status: "paid", status: "paid" }) };
  return { effect, effects, orders, service: new PaymentEffectsService(effects as never, orders as never) };
}
beforeEach(() => {
  vi.resetAllMocks();
  mocks.prepare.mockResolvedValue(prepared);
  mocks.deliver.mockResolvedValue("provider-1");
  mocks.usage.mockResolvedValue(undefined);
});

describe("durable worker", () => {
  it("persists rendered content before sending and acknowledges the provider ID", async () => {
    const { service, effects, effect } = setup();
    expect(await service.drain()).toEqual({ succeeded: 1, failed: 0 });
    expect(effects.prepare).toHaveBeenCalledWith(effect, prepared);
    expect(effects.prepare.mock.invocationCallOrder[0]).toBeLessThan(effects.beginSend.mock.invocationCallOrder[0]);
    expect(effects.beginSend.mock.invocationCallOrder[0]).toBeLessThan(mocks.deliver.mock.invocationCallOrder[0]);
    expect(mocks.deliver).toHaveBeenCalledExactlyOnceWith(prepared, "order-confirmation/effect-1");
    expect(effects.finish).toHaveBeenCalledWith(effect, { success: true, providerId: "provider-1" });
  });

  it("reuses the original content and key after a send succeeded but its acknowledgement failed", async () => {
    const { service, effects, effect } = setup();
    effects.finish.mockRejectedValueOnce(new Error("Connection lost after send"));
    expect(await service.drain()).toEqual({ succeeded: 0, failed: 1 });
    effects.claim.mockResolvedValueOnce({ ...effect, payload: prepared, claim_token: "lease-2" });
    mocks.prepare.mockResolvedValue({ ...prepared, message: { ...prepared.message, html: "Changed template" } });
    expect(await service.drain()).toEqual({ succeeded: 1, failed: 0 });
    expect(mocks.prepare).toHaveBeenCalledTimes(1);
    expect(mocks.deliver.mock.calls).toEqual([
      [prepared, "order-confirmation/effect-1"], [prepared, "order-confirmation/effect-1"],
    ]);
  });

  it("does not send when persisting the rendered payload fails", async () => {
    const { service, effects } = setup();
    effects.prepare.mockRejectedValue(new Error("Database unavailable"));
    expect((await service.drain()).failed).toBe(1);
    expect(effects.beginSend).not.toHaveBeenCalled();
    expect(mocks.deliver).not.toHaveBeenCalled();
  });

  it("does not send after losing the lease or retry window", async () => {
    const { service, effects, effect } = setup();
    effects.beginSend.mockResolvedValue(false);
    await service.drain();
    expect(mocks.deliver).not.toHaveBeenCalled();
    expect(effects.finish).toHaveBeenCalledWith(effect, expect.objectContaining({ success: false, manual: true }));
  });

  it.each([false, true])("records delivery failures with manualReview=%s", async (manual) => {
    const { service, effects, effect } = setup();
    mocks.deliver.mockRejectedValue(new EmailDeliveryError("Delivery failed", manual));
    expect((await service.drain()).failed).toBe(1);
    expect(effects.finish).toHaveBeenCalledWith(effect, { success: false, error: "Delivery failed", manual });
    expect(mocks.usage).not.toHaveBeenCalled();
  });

  it("does not retry a successfully acknowledged send because a metric failed", async () => {
    const { service, effects } = setup();
    mocks.usage.mockRejectedValue(new Error("Metric unavailable"));
    expect(await service.drain()).toEqual({ succeeded: 1, failed: 0 });
    expect(effects.finish).toHaveBeenCalledTimes(1);
  });

  it("does not fulfill a refunded order", async () => {
    const { service, orders, effects, effect } = setup();
    orders.findByIdWithItems.mockResolvedValue({ id: "order-1", user_id: "user-1", status: "refunded", payment_status: "refunded" });
    await service.drain();
    expect(mocks.deliver).not.toHaveBeenCalled();
    expect(effects.finish).toHaveBeenCalledWith(effect, expect.objectContaining({ manual: true }));
  });

  it("rejects unsupported tasks without executing them or sending an email", async () => {
    const { service, effects, effect, orders } = setup();
    effect.kind = "treasures" as never;
    expect((await service.drain()).failed).toBe(1);
    expect(effects.finish).toHaveBeenCalledWith(effect, expect.objectContaining({ success: false, manual: true }));
    expect(orders.findByIdWithItems).not.toHaveBeenCalled();
    expect(mocks.prepare).not.toHaveBeenCalled();
    expect(mocks.deliver).not.toHaveBeenCalled();
  });

  it("exposes a failed acknowledgement so the lease can expire and recover", async () => {
    const { service, effects } = setup();
    effects.finish.mockRejectedValue(new Error("Database offline"));
    await expect(service.drain()).rejects.toThrow("Database offline");
    expect(mocks.deliver).toHaveBeenCalledTimes(1);
  });
});
