import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { deliverPreparedEmail, type PreparedEmail } from "./durable-delivery";

const request = vi.fn();
const email: PreparedEmail = { templateId: "t1", message: {
  from: "shop@example.com", to: "test@example.com", reply_to: "help@example.com",
  subject: "Order", html: "<p>Order</p>", text: "Order",
} };
beforeEach(() => {
  request.mockReset();
  vi.stubGlobal("fetch", request);
  vi.stubEnv("RESEND_API_KEY", "test-only-key");
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("idempotent email transport", () => {
  it("sends the frozen payload with a stable provider key", async () => {
    request.mockResolvedValue(Response.json({ id: "email-1" }));
    expect(await deliverPreparedEmail(email, "order-confirmation/task-1")).toBe("email-1");
    expect(request).toHaveBeenCalledWith("https://api.resend.com/emails", expect.objectContaining({
      method: "POST", body: JSON.stringify(email.message),
      headers: expect.objectContaining({ "Idempotency-Key": "order-confirmation/task-1" }),
    }));
  });
  it("does not make a request without a configured key", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    await expect(deliverPreparedEmail(email, "key")).rejects.toThrow("not configured");
    expect(request).not.toHaveBeenCalled();
  });
  it.each([
    [409, "invalid_idempotent_request", true], [409, "concurrent_idempotent_requests", false],
    [429, "rate_limit_exceeded", false], [503, "application_error", false], [422, "validation_error", true],
  ])("classifies %s/%s for safe retry", async (status, name, manualReview) => {
    request.mockResolvedValue(Response.json({ name }, { status: status as number }));
    await expect(deliverPreparedEmail(email, "key")).rejects.toMatchObject({ manualReview });
  });
  it("propagates network failures rather than acknowledging a send", async () => {
    request.mockRejectedValue(new Error("Connection interrupted"));
    await expect(deliverPreparedEmail(email, "key")).rejects.toThrow("interrupted");
  });
});
