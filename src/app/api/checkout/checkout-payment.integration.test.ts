import { PGlite } from "@electric-sql/pglite";
import type { SupabaseClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { NextRequest } from "next/server";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({
  db: null as SupabaseClient | null,
  admin: true,
  createPreference: vi.fn(), getPayment: vi.fn(), instructions: vi.fn(),
  prepareEmail: vi.fn(), deliverEmail: vi.fn(),
}));
vi.mock("next/headers", () => ({ cookies: () => ({ get: () => undefined }) }));
vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({ auth: { getUser: async () => ({ data: { user: { id: "00000000-0000-0000-0000-000000000001" } } }) } }),
}));
vi.mock("@/lib/auth/helpers", async () => {
  const { NextResponse } = await import("next/server");
  return {
    getServiceClient: () => mock.db,
    requireAdmin: async () => mock.admin ? { ok: true } : { ok: false, response: NextResponse.json({}, { status: 403 }) },
  };
});
vi.mock("@/utils/supabase/server", () => ({ createServiceRoleClient: () => mock.db }));
vi.mock("@/lib/mercadopago/config", () => ({
  getMercadoPagoAccessToken: async () => "synthetic-token",
  getMercadoPagoConfig: async () => ({ paymentMethods: [], autoReturn: false, binaryMode: false }),
}));
vi.mock("mercadopago", () => ({
  MercadoPagoConfig: class {}, Preference: class { create = mock.createPreference; }, Payment: class { get = mock.getPayment; },
}));
vi.mock("@/lib/email/notifications", () => ({ EmailNotificationService: {
  sendBankTransferInstructions: mock.instructions, prepareOrderConfirmation: mock.prepareEmail,
} }));
vi.mock("@/lib/email/durable-delivery", async (original) => ({
  ...(await original<typeof import("@/lib/email/durable-delivery")>()), deliverPreparedEmail: mock.deliverEmail,
}));
vi.mock("@/lib/email/template-loader", () => ({ incrementTemplateUsage: async () => {} }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), error: vi.fn() } }));

import { POST as checkout } from "./route";
import { POST as confirmTransfer } from "../admin/orders/[id]/confirm-transfer/route";
import { OrdersRepository } from "@/lib/repositories/orders.repository";
import { PaymentEffectsRepository } from "@/lib/repositories/payment-effects.repository";
import { SystemRepository } from "@/lib/repositories/system.repository";
import { PaymentEffectsService } from "@/lib/services/payment-effects.service";
import { OrderPaymentService } from "@/lib/services/order-payment.service";
import { WebhookService } from "@/lib/services/webhook.service";

const pg = new PGlite(); // Memory only: no connection strings, sockets or .env.local.
const candidate = readFileSync(new URL("../../../../scripts/sql/checkout-payment-minimum-local.sql", import.meta.url), "utf8");
const productId = "00000000-0000-0000-0000-000000000002";
const attemptId = "00000000-0000-0000-0000-000000000003";
const previousId = "00000000-0000-0000-0000-000000000004";
const json = (v: unknown) => v !== null && typeof v === "object" ? JSON.stringify(v) : v;
const identifier = (name: string) => {
  if (!/^[a-z_][a-z_0-9]*$/.test(name)) throw new Error(`Unsupported test identifier ${name}`);
  return `"${name}"`;
};
let insertBarrier: (() => Promise<void>) | undefined;

// Adapts only the Supabase operations used by this flow. All writes, constraints,
// totals persisted in rows and RPCs run in PostgreSQL, not in mock repositories.
function localClient() {
  return {
    from(table: string) {
      const params: unknown[] = [];
      const param = (v: unknown) => { params.push(json(v)); return `$${params.length}`; };
      const filters: string[] = [];
      let columns = "*", operation = "select";
      let payload: Record<string, unknown>[] = [];
      const run = async (one = false) => {
        try {
          const t = identifier(table);
          const where = () => filters.length ? ` WHERE ${filters.join(" AND ")}` : "";
          let query: string;
          if (operation === "insert") {
            if (table === "orders") await insertBarrier?.();
            const keys = Object.keys(payload[0]);
            query = `INSERT INTO ${t} (${keys.map(identifier).join(",")}) VALUES ${payload.map(row => `(${keys.map(k => param(row[k] ?? null)).join(",")})`).join(",")} RETURNING *`;
          } else if (operation === "update") {
            query = `UPDATE ${t} SET ${Object.entries(payload[0]).map(([k, v]) => `${identifier(k)}=${param(v)}`).join(",")}${where()} RETURNING *`;
          } else if (operation === "delete") {
            query = `DELETE FROM ${t}${where()} RETURNING *`;
          } else {
            // Handle the two nested relations needed by the real repositories.
            const projection = columns.includes("order_items (")
              ? `*, (SELECT coalesce(json_agg(i),'[]') FROM order_items i WHERE i.order_id=orders.id) AS order_items`
              : columns.includes("product_variants (")
                ? `id,name,status,currency,price,sku,featured_image,discount_transfer_percent,'[]'::json AS product_variants`
                : columns === "*" ? "*" : columns.split(",").map(c => identifier(c.trim())).join(",");
            query = `SELECT ${projection} FROM ${t}${where()}`;
          }
          const { rows } = await pg.query<{ value: Record<string, unknown> }>(`WITH result AS (${query}) SELECT row_to_json(result) AS value FROM result`, params);
          if (one && rows.length > 1) throw new Error("Test expected at most one row");
          return { data: one ? rows[0]?.value ?? null : rows.map(r => r.value), error: null };
        } catch (error) { return { data: null, error }; }
      };
      const q = {
        select: (fields: string) => { columns = fields ?? "*"; return q; },
        eq: (k: string, v: unknown) => { filters.push(`${identifier(k)}=${param(v)}`); return q; },
        in: (k: string, values: unknown[]) => { filters.push(`${identifier(k)} IN (${values.map(param).join(",")})`); return q; },
        insert: (v: typeof payload | Record<string, unknown>) => { operation = "insert"; payload = Array.isArray(v) ? v : [v]; return q; },
        update: (v: Record<string, unknown>) => { operation = "update"; payload = [v]; return q; },
        delete: () => { operation = "delete"; return q; },
        single: () => run(true), maybeSingle: () => run(true),
        then: (resolve: (result: Awaited<ReturnType<typeof run>>) => unknown) => run().then(resolve),
      };
      return q;
    },
    async rpc(name: string, args: Record<string, unknown>) {
      try {
        const bound = Object.keys(args).map((k, i) => `${identifier(k)} => $${i + 1}`).join(",");
        const f = `${identifier(name)}(${bound})`;
        const sql = name === "claim_payment_effect" ? `SELECT row_to_json(x) AS value FROM ${f} x` : `SELECT ${f} AS value`;
        const { rows } = await pg.query<{ value: unknown }>(sql, Object.values(args).map(json));
        return { data: name === "claim_payment_effect" ? rows.map(r => r.value) : rows[0]?.value, error: null };
      } catch (error) { return { data: null, error }; }
    },
  } as unknown as SupabaseClient;
}

async function scalar(sql: string, params: unknown[] = []) {
  return (await pg.query<{ value: unknown }>(sql, params)).rows[0]?.value;
}
const count = (table: string) => scalar(`SELECT count(*)::int AS value FROM ${identifier(table)}`);
const stock = () => scalar("SELECT inventory_quantity AS value FROM products");
const post = (method: "mercadopago" | "bank_transfer", postalCode = "5000", expectedTotal = 2500) => checkout(new NextRequest("http://localhost/api/checkout", {
  method: "POST", body: JSON.stringify({
    items: [{ productId, quantity: 2, name: "Producto ficticio", price: 1000 }],
    customerInfo: { email: "fixture@example.invalid", addressNumber: "1", postalCode },
    paymentMethod: method, checkoutRequestId: attemptId, expectedTotal,
  }), headers: { "Content-Type": "application/json" },
}));
const confirm = (id: string) => confirmTransfer(new NextRequest("http://localhost/confirm", { method: "POST" }), { params: { id } });

beforeAll(async () => {
  await pg.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth; CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT NULL::uuid $$;
    CREATE FUNCTION public.is_admin(uuid) RETURNS boolean LANGUAGE sql AS $$ SELECT false $$;
    CREATE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at=clock_timestamp(); RETURN NEW; END $$;
    CREATE TABLE shipping_carriers(id uuid PRIMARY KEY, name text, is_active boolean);
    CREATE TABLE shipping_zones(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, is_active boolean NOT NULL);
    CREATE TABLE products(id uuid PRIMARY KEY, name text, status text, currency text, price numeric, sku text, featured_image text,
      discount_transfer_percent numeric, inventory_quantity int, stock_quantity int, updated_at timestamptz,
      installments_3_enabled boolean, installments_6_enabled boolean);
    CREATE TABLE orders(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_number text UNIQUE, user_id uuid, email text, status text,
      subtotal numeric, discount_amount numeric, shipping_amount numeric, total_amount numeric, currency text, payment_method text,
      payment_status text, transfer_expires_at timestamptz, shipping_first_name text, shipping_last_name text, shipping_phone text,
      shipping_address_1 text, shipping_city text, shipping_state text, shipping_postal_code text, shipping_country text, customer_notes text,
      mercadopago_preference_id text, mercadopago_payment_id text, installments int, transaction_amount numeric, net_received_amount numeric,
      fees numeric, updated_at timestamptz DEFAULT now());
    CREATE TABLE order_items(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES orders(id), product_id uuid REFERENCES products(id),
      variant_id uuid, quantity int, unit_price numeric, total_price numeric, product_name text, product_image text, variant_title text, sku text);
    CREATE TABLE stock_movements(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid REFERENCES products(id),
      movement_type text CHECK (movement_type IN ('increase','decrease','adjustment')), quantity int, reason text);
    CREATE TABLE system_config(config_key text PRIMARY KEY, config_value text);
    CREATE TRIGGER orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  `);
  await pg.query("INSERT INTO orders(id, order_number, status, payment_status, total_amount) VALUES ($1,'OLD-FIXTURE','delivered','paid',1234)", [previousId]);
  await expect(pg.exec(candidate)).rejects.toThrow("ensayo local autorizado");
  await pg.exec("ROLLBACK; SET daluz.checkout_fixture = 'synthetic-local-v1'");
  await pg.exec(candidate);
  expect(await scalar("SELECT total_amount::int AS value FROM orders WHERE id=$1", [previousId])).toBe(1234);
  expect(await count("payment_effects")).toBe(0);
  expect(await count("shipping_zones")).toBe(0);
  expect(await count("coupons")).toBe(0);
  mock.db = localClient();
}, 30000);

beforeEach(async () => {
  await pg.exec("TRUNCATE orders, products, order_items, stock_movements, payment_effects, coupon_redemptions, coupons, shipping_zones, shipping_carriers, system_config");
  await pg.query("INSERT INTO products(id,name,status,currency,price,discount_transfer_percent,inventory_quantity,stock_quantity) VALUES ($1,'Producto ficticio','active','ARS',1000,0,10,10)", [productId]);
  await pg.exec(`INSERT INTO shipping_zones(name,is_active,region_key,regional_rate) VALUES ('Cobertura ficticia',true,'cordoba',500);
    INSERT INTO system_config VALUES ('bank_transfer_alias','fixture.alias'),('bank_transfer_bank','Banco ficticio'),
      ('bank_transfer_holder','Titular ficticio'),('bank_transfer_cbu','1234567890123456789012');`);
  vi.clearAllMocks();
  mock.admin = true;
  mock.createPreference.mockResolvedValue({ id: "pref-fixture", init_point: "https://example.invalid/checkout" });
  mock.prepareEmail.mockResolvedValue({ templateId: "fixture", message: { to: "fixture@example.invalid" } });
  mock.deliverEmail.mockResolvedValue("mail-fixture");
  mock.instructions.mockResolvedValue(undefined);
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost");
  vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("Network disabled in checkout rehearsal"); }));
});

afterEach(() => { insertBarrier = undefined; vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
afterAll(async () => { await pg.close(); });

describe("checkout mínimo: aplicación real, PostgreSQL local y proveedores simulados", () => {
  it("resuelve dos intentos simultáneos y confirma Mercado Pago una sola vez", async () => {
    let arrivals = 0, release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    insertBarrier = async () => { if (++arrivals === 2) release(); await gate; };
    const responses = await Promise.all([post("mercadopago"), post("mercadopago")]);
    expect(arrivals).toBe(2);
    expect(responses.some(r => r.status === 200)).toBe(true);
    expect(responses.every(r => r.status === 200 || r.status === 409)).toBe(true);
    expect(await (await post("mercadopago")).json()).toMatchObject({ id: "pref-fixture" });
    expect(await (await post("mercadopago", "5001")).json()).toMatchObject({ error: "Este intento corresponde a otro carrito." });
    expect(await count("orders")).toBe(1);
    expect(await count("order_items")).toBe(1);
    expect(mock.createPreference).toHaveBeenCalledTimes(1);
    expect(mock.createPreference.mock.calls[0][0].body.items[0].unit_price).toBe(2500);
    const id = await scalar("SELECT id AS value FROM orders");
    const orders = new OrdersRepository(mock.db!);
    const worker = new PaymentEffectsService(new PaymentEffectsRepository(mock.db!), orders);
    const provider = new WebhookService(orders, new SystemRepository(mock.db!), new OrderPaymentService(orders, worker));
    mock.getPayment.mockResolvedValue({ id: 123, external_reference: id, status: "approved", transaction_amount: 2400, currency_id: "ARS" });
    await expect(provider.processPayment(123)).rejects.toThrow("amount or currency");
    expect(await stock()).toBe(10);
    mock.getPayment.mockResolvedValue({ id: 123, external_reference: id, status: "approved", transaction_amount: 2500, currency_id: "ARS", payment_method_id: "fixture" });
    await provider.processPayment(123);
    await provider.processPayment(123);
    expect(await scalar("SELECT payment_status AS value FROM orders")).toBe("paid");
    expect(await stock()).toBe(8);
    expect(await count("stock_movements")).toBe(1);
    expect(await count("payment_effects")).toBe(1);
    expect(mock.deliverEmail).toHaveBeenCalledTimes(1);
  });

  it("recupera una transferencia y confirma sólo mediante la acción administrativa", async () => {
    const first = await post("bank_transfer");
    expect(first.status).toBe(200);
    const data = await first.json();
    expect(await (await post("bank_transfer")).json()).toEqual(data);
    expect(mock.instructions).toHaveBeenCalledTimes(1);
    expect(await scalar("SELECT payment_status AS value FROM orders")).toBe("awaiting_transfer");
    expect(await stock()).toBe(10);
    const id = data.redirectUrl.split("/").at(-1);
    mock.admin = false;
    expect((await confirm(id)).status).toBe(403);
    expect(await count("payment_effects")).toBe(0);
    mock.admin = true;
    expect((await confirm(id)).status).toBe(200);
    expect((await confirm(id)).status).toBe(200);
    expect(await count("orders")).toBe(1);
    expect(await stock()).toBe(8);
    expect(await count("stock_movements")).toBe(1);
    expect(await scalar("SELECT state AS value FROM payment_effects")).toBe("succeeded");
    expect(mock.deliverEmail).toHaveBeenCalledTimes(1);
  });

  it("revierte el pago y el inventario si no se puede guardar la confirmación en la cola", async () => {
    const result = await post("bank_transfer");
    expect(result.status).toBe(200);
    const { redirectUrl } = await result.json();
    const id = redirectUrl.split("/").at(-1);
    await pg.exec("ALTER TABLE payment_effects ADD CONSTRAINT fixture_queue_unavailable CHECK (false)");
    try {
      await expect(confirm(id)).rejects.toMatchObject({ code: "23514" });
      expect(await scalar("SELECT payment_status AS value FROM orders")).toBe("awaiting_transfer");
      expect(await stock()).toBe(10);
      expect(await count("stock_movements")).toBe(0);
      expect(await count("payment_effects")).toBe(0);
      expect(mock.deliverEmail).not.toHaveBeenCalled();
    } finally {
      await pg.exec("ALTER TABLE payment_effects DROP CONSTRAINT fixture_queue_unavailable");
    }
    expect((await confirm(id)).status).toBe(200);
    expect(await stock()).toBe(8);
    expect(await count("stock_movements")).toBe(1);
    expect(mock.deliverEmail).toHaveBeenCalledTimes(1);
  });

  it.each(["mercadopago", "bank_transfer"] as const)("una tarifa guardada sin habilitar no inicia %s", async method => {
    await pg.exec("UPDATE shipping_zones SET is_active=false,regional_rate=1234.50");
    const response = await post(method);
    expect(response.status).toBe(409);
    expect(await count("orders")).toBe(0);
    expect(await stock()).toBe(10);
    expect(mock.createPreference).not.toHaveBeenCalled();
    expect(mock.instructions).not.toHaveBeenCalled();
    expect(mock.deliverEmail).not.toHaveBeenCalled();
  });
  it.each(["mercadopago", "bank_transfer"] as const)("no escribe ni inicia %s si falta tarifa, incluso sobre el umbral gratis", async method => {
    await pg.exec("UPDATE shipping_zones SET regional_rate=NULL; INSERT INTO system_config VALUES ('free_shipping_threshold','100')");
    const response = await post(method);
    expect(response.status).toBe(409);
    expect((await response.json()).error).toContain("coordinar el envío");
    expect(await count("orders")).toBe(0);
    expect(await count("order_items")).toBe(0);
    expect(await count("payment_effects")).toBe(0);
    expect(await stock()).toBe(10);
    expect(mock.createPreference).not.toHaveBeenCalled();
    expect(mock.instructions).not.toHaveBeenCalled();
    expect(mock.deliverEmail).not.toHaveBeenCalled();
  });
});
