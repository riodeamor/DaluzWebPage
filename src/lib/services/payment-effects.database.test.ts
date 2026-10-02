import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";

// Real PostgreSQL statements in memory, never the configured Supabase instance.
// PGlite serializes connections: this tests atomicity, not distributed contention.
const db = new PGlite();
const orderId = "00000000-0000-0000-0000-000000000001";
const productId = "00000000-0000-0000-0000-000000000002";
type Effect = { id: string; claim_token: string; kind: string; state: string; payload: unknown; attempts: number };
async function scalar(sql: string, args: unknown[] = []) {
  const result = await db.query<Record<string, unknown>>(sql, args);
  return Object.values(result.rows[0] ?? {})[0];
}
async function snapshot() {
  return scalar("select to_jsonb(o) from orders o where id=$1", [orderId]);
}
async function confirm(expected: unknown, payment: object = {}) {
  return scalar("select confirm_order_payment_once($1,$2,$3)", [orderId, expected, payment]);
}
async function claim() {
  return (await db.query<Effect>("select * from claim_payment_effect($1)", [orderId])).rows[0];
}

beforeAll(async () => {
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE TABLE orders (
      id uuid primary key, user_id uuid, status text, payment_status text,
      payment_method text, mercadopago_payment_id text, total_amount numeric,
      currency text, updated_at timestamptz, installments integer,
      transaction_amount numeric, net_received_amount numeric, fees numeric
    );
    CREATE TABLE products (
      id uuid primary key, inventory_quantity integer, stock_quantity integer, updated_at timestamptz
    );
    CREATE TABLE order_items (order_id uuid references orders, product_id uuid references products, quantity integer not null);
    CREATE TABLE stock_movements (
      id uuid primary key default gen_random_uuid(), product_id uuid references products,
      movement_type text not null check (movement_type in ('increase','decrease','adjustment')),
      quantity integer not null, reason varchar(100), created_at timestamptz default now()
    );
  `);
  await db.exec(readFileSync(resolve("supabase/migrations/20260928000000_payment_effects_outbox.sql"), "utf8"));
}, 60000);
afterAll(() => db.close());
beforeEach(async () => {
  await db.exec("TRUNCATE orders, products, order_items, stock_movements, payment_effects;");
  await db.query(`insert into orders(id,user_id,status,payment_status,payment_method,total_amount,currency,updated_at)
    values ($1,$1,'pending','awaiting_transfer','bank_transfer',1000,'ARS',now())`, [orderId]);
  await db.query("insert into products values ($1,10,10,now())", [productId]);
  await db.query("insert into order_items values ($1,$2,2)", [orderId, productId]);
});

describe("atomic payment transaction", () => {
  it("records payment, inventory and only the email task for a registered customer", async () => {
    const expected = await snapshot();
    expect(await confirm(expected)).toBe(true);
    expect(await confirm(expected)).toBe(false);
    expect(await scalar("select payment_status from orders")).toBe("paid");
    expect(await scalar("select inventory_quantity from products")).toBe(8);
    expect(await scalar("select stock_quantity from products")).toBe(8);
    expect(await scalar("select count(*)::int from stock_movements")).toBe(1);
    expect(await scalar("select count(*)::int from payment_effects")).toBe(1);
    expect(await scalar("select kind from payment_effects")).toBe("order_confirmation");
  });

  it("does not allow treasure tasks in the payment queue", async () => {
    await expect(db.query("insert into payment_effects(order_id,kind) values ($1,'treasures')", [orderId]))
      .rejects.toMatchObject({ code: "23514" });
  });

  it("rolls back all writes when the inventory audit insert fails", async () => {
    await db.exec("alter table stock_movements add constraint simulate_failure check (quantity < 0)");
    try {
      await expect(confirm(await snapshot())).rejects.toThrow();
      expect(await scalar("select inventory_quantity from products")).toBe(10);
      expect(await scalar("select payment_status from orders")).toBe("awaiting_transfer");
      expect(await scalar("select count(*)::int from payment_effects")).toBe(0);
    } finally { await db.exec("alter table stock_movements drop constraint simulate_failure"); }
  });

  it("rolls back payment and stock when enqueue fails", async () => {
    await db.exec("alter table payment_effects add constraint simulate_failure check (kind = 'impossible')");
    try {
      await expect(confirm(await snapshot())).rejects.toThrow();
      expect(await scalar("select inventory_quantity from products")).toBe(10);
      expect(await scalar("select payment_status from orders")).toBe("awaiting_transfer");
      expect(await scalar("select count(*)::int from stock_movements")).toBe(0);
    } finally { await db.exec("alter table payment_effects drop constraint simulate_failure"); }
  });

  it("rejects a stale snapshot before changing anything", async () => {
    const expected = await snapshot();
    await db.exec("update orders set total_amount=2000");
    await expect(confirm(expected)).rejects.toMatchObject({ code: "40001" });
    expect(await scalar("select inventory_quantity from products")).toBe(10);
  });

  it("validates the Mercado Pago amount and preserves the sale total", async () => {
    await db.exec("update orders set payment_method='mercadopago',payment_status='pending'");
    const expected = await snapshot();
    await expect(confirm(expected, { mercadopago_payment_id: "123", transaction_amount: 1 })).rejects.toThrow();
    expect(await confirm(expected, { mercadopago_payment_id: "123", transaction_amount: 1000, fees: 50 })).toBe(true);
    expect(await scalar("select total_amount::int from orders")).toBe(1000);
    await expect(confirm(expected, { mercadopago_payment_id: "456", transaction_amount: 1000 })).rejects.toThrow("another payment");
  });

  it("does not backfill effects for previously paid orders", async () => {
    await db.exec("update orders set payment_status='paid',status='shipped'");
    expect(await confirm(await snapshot())).toBe(false);
    expect(await scalar("select count(*)::int from payment_effects")).toBe(0);
    expect(await scalar("select inventory_quantity from products")).toBe(10);
  });

  it("groups repeated product lines and preserves processing status", async () => {
    await db.query("insert into order_items values ($1,$2,3)", [orderId, productId]);
    await db.exec("update orders set status='processing'");
    await confirm(await snapshot());
    expect(await scalar("select inventory_quantity from products")).toBe(5);
    expect(await scalar("select count(*)::int from stock_movements")).toBe(1);
    expect(await scalar("select status from orders")).toBe("processing");
  });

  it("rejects cancelled orders and invalid quantities", async () => {
    await db.exec("update order_items set quantity=0");
    await expect(confirm(await snapshot())).rejects.toThrow("invalid items");
    await db.exec("update orders set status='cancelled'");
    await expect(confirm(await snapshot())).rejects.toThrow("cancelled");
    expect(await scalar("select inventory_quantity from products")).toBe(10);
  });
});

describe("persistent payment effects", () => {
  beforeEach(async () => {
    await db.exec("update orders set user_id=null");
    await confirm(await snapshot());
  });

  it("allows only one active claim and recovers an expired lease", async () => {
    const first = await claim();
    expect(await claim()).toBeUndefined();
    await db.exec("update payment_effects set lease_until=now()-interval '1 second'");
    const retry = await claim();
    expect(retry.id).toBe(first.id);
    expect(retry.claim_token).not.toBe(first.claim_token);
    expect(await scalar("select finish_payment_effect($1,$2,true)", [first.id, first.claim_token])).toBe(false);
    expect(await scalar("select finish_payment_effect($1,$2,true,null,false,'provider-1')", [retry.id, retry.claim_token])).toBe(true);
    expect(await claim()).toBeUndefined();
    expect(await scalar("select provider_id from payment_effects")).toBe("provider-1");
  });

  it("freezes the prepared message across crashes and retries", async () => {
    const effect = await claim();
    const original = { message: { to: "test@example.com", html: "original" } };
    expect(await scalar("select begin_payment_email_send($1,$2)", [effect.id, effect.claim_token])).toBe(false);
    await scalar("select prepare_payment_email($1,$2,$3)", [effect.id, effect.claim_token, original]);
    expect(await scalar("select begin_payment_email_send($1,$2)", [effect.id, effect.claim_token])).toBe(true);
    const timestamp = await scalar("select first_send_at::text from payment_effects");
    await db.exec("update payment_effects set lease_until=now()-interval '1 second'");
    const retry = await claim();
    expect(retry.payload).toEqual(original);
    expect(await scalar("select prepare_payment_email($1,$2,$3)", [retry.id, retry.claim_token, { changed: true }])).toEqual(original);
    expect(await scalar("select begin_payment_email_send($1,$2)", [retry.id, retry.claim_token])).toBe(true);
    expect(await scalar("select first_send_at::text from payment_effects")).toBe(timestamp);
  });

  it("delays failed work instead of spinning and permits a later retry", async () => {
    const effect = await claim();
    await scalar("select finish_payment_effect($1,$2,false,'network failure')", [effect.id, effect.claim_token]);
    expect(await claim()).toBeUndefined();
    await db.exec("update payment_effects set available_at=now()-interval '1 second'");
    expect((await claim()).attempts).toBe(2);
  });

  it.each(["first_send_at=now()-interval '23 hours 1 second'", "attempts=12"])("stops automatic delivery for %s", async (assignment) => {
    await db.exec(`update payment_effects set ${assignment}`);
    expect(await claim()).toBeUndefined();
    expect(await scalar("select state from payment_effects")).toBe("manual_review");
  });

  it("can deliver old work that has never attempted a send", async () => {
    await db.exec("update payment_effects set created_at=now()-interval '3 days'");
    expect(await claim()).toBeDefined();
  });

  it("denies public access to tasks and mutation RPCs", async () => {
    for (const role of ["anon", "authenticated"]) {
      expect(await scalar("select has_table_privilege($1,'payment_effects','SELECT')", [role])).toBe(false);
      for (const signature of [
        "confirm_order_payment_once(uuid,jsonb,jsonb)", "claim_payment_effect(uuid)",
        "prepare_payment_email(uuid,uuid,jsonb)", "begin_payment_email_send(uuid,uuid)",
        "finish_payment_effect(uuid,uuid,boolean,text,boolean,text)",
      ]) {
        expect(await scalar("select has_function_privilege($1,$2,'EXECUTE')", [role, signature])).toBe(false);
        expect(await scalar("select has_function_privilege('service_role',$1,'EXECUTE')", [signature])).toBe(true);
      }
    }
  });
});
