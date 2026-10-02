import { vi, it, expect, beforeEach } from "vitest";
const state = vi.hoisted(() => ({ auth: true, owner: true, paid: true }));
const id = "00000000-0000-0000-0000-000000000001";
vi.mock("@/lib/auth/helpers", () => ({
  requireAuth: async () =>
    state.auth
      ? {
          ok: true,
          user: { id: "buyer" },
          supabase: {
            from: (table: string) => {
              const chain: any = {
                select: () => chain,
                eq: (_key: string, value: string) => {
                  if (_key === "user_id") expect(value).toBe("buyer");
                  return chain;
                },
                order: async () => ({ data: [], error: null }),
                single: async () => ({
                  data: state.owner
                    ? {
                        id,
                        order_number: "DL-1",
                        payment_status: state.paid ? "paid" : "pending",
                        order_items: [
                          {
                            product_name: "Génesis",
                            quantity: 2,
                            unit_price: 100,
                            total_price: 200,
                          },
                        ],
                        subtotal: 200,
                        total_amount: 200,
                      }
                    : null,
                  error: state.owner ? null : {},
                }),
              };
              return chain;
            },
          },
        }
      : { ok: false, response: new Response(null, { status: 401 }) },
}));
import { GET } from "./route";
beforeEach(() => Object.assign(state, { auth: true, owner: true, paid: true }));
it("sin sesión no entrega PDF", async () => {
  state.auth = false;
  expect(
    (await GET(new Request("http://local"), { params: { id } })).status,
  ).toBe(401);
});
it("pedido ajeno o no aprobado no entrega contenido", async () => {
  state.owner = false;
  expect(
    (await GET(new Request("http://local"), { params: { id } })).status,
  ).toBe(404);
  state.owner = true;
  state.paid = false;
  expect(
    (await GET(new Request("http://local"), { params: { id } })).status,
  ).toBe(409);
});
it("descarga autenticada privada con desglose", async () => {
  const r = await GET(new Request("http://local"), { params: { id } });
  expect(r.headers.get("Content-Type")).toBe("application/pdf");
  expect(r.headers.get("Cache-Control")).toBe("private, no-store");
  const text = Buffer.from(await r.arrayBuffer()).toString("latin1");
  expect(text).toContain("sin validez fiscal");
  expect(text).toContain("Génesis");
  expect(text).toContain("Transferencia");
});
