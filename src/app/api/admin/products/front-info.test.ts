import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { POST } from "./route";
import { PUT } from "./[id]/route";

const mocks = vi.hoisted(() => ({ auth: vi.fn(), client: vi.fn() }));
vi.mock("@/lib/auth/helpers", () => ({ requireAdmin: mocks.auth, getServiceClient: mocks.client }));
beforeEach(() => { vi.resetAllMocks(); mocks.auth.mockResolvedValue({ ok: true }); });
const handlers = [
  (req: NextRequest) => POST(req),
  (req: NextRequest) => PUT(req, { params: { id: "test-product" } }),
];
function request(info: unknown) {
  return new NextRequest("http://localhost/api/admin/products", {
    method: "POST", body: JSON.stringify({ info_frontal: info }),
  });
}
describe.each(handlers)("admin front info validation", (handle) => {
  it("rejects long text before any database mutation", async () => {
    const from = vi.fn();
    mocks.client.mockReturnValue({ from });
    const response = await handle(request("a".repeat(66)));
    expect(response.status).toBe(400);
    expect((await response.json()).message).toContain("65");
    expect(from).not.toHaveBeenCalled();
  });
  it("keeps admin authorization mandatory", async () => {
    mocks.auth.mockResolvedValue({ ok: false, response: NextResponse.json({}, { status: 403 }) });
    expect((await handle(request("Valid"))).status).toBe(403);
    expect(mocks.client).not.toHaveBeenCalled();
  });
  it("persists valid text without dropping the field", async () => {
    const product = { id: "test-product", info_frontal: "Jojoba & Neroli" };
    const selected = Promise.resolve({ data: [product], error: null }) as Promise<unknown> & { single: () => Promise<unknown> };
    selected.single = async () => ({ data: product, error: null });
    const query = {
      insert: vi.fn().mockReturnThis(), update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(), select: vi.fn().mockReturnValue(selected),
    };
    mocks.client.mockReturnValue({ from: () => query });
    const response = await handle(request(product.info_frontal));
    expect(response.status).toBe(200);
    expect((await response.json()).product.info_frontal).toBe(product.info_frontal);
    const write = query.insert.mock.calls[0]?.[0]?.[0] ?? query.update.mock.calls[0]?.[0];
    expect(write.info_frontal).toBe(product.info_frontal);
  });
});
