import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, beforeEach, it, expect } from "vitest";
const db = new PGlite();
const user = "00000000-0000-0000-0000-000000000001",
  order = "00000000-0000-0000-0000-000000000002",
  other = "00000000-0000-0000-0000-000000000003",
  product = "00000000-0000-0000-0000-000000000004",
  p2 = "00000000-0000-0000-0000-000000000005",
  key = "00000000-0000-0000-0000-000000000006";
const migration = (n: string) =>
  readFileSync("supabase/migrations/" + n, "utf8");
beforeAll(async () => {
  await db.exec(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid PRIMARY KEY);CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT NULL::uuid$$;CREATE FUNCTION is_admin(uuid) RETURNS boolean LANGUAGE sql AS $$SELECT true$$;CREATE TYPE treasure_access_type AS ENUM ('general','linea','kit');CREATE FUNCTION grant_treasure_access(uuid,text,treasure_access_type,text,uuid) RETURNS void LANGUAGE sql AS $$SELECT$$;CREATE FUNCTION grant_treasures_from_order(uuid,uuid,text[]) RETURNS void LANGUAGE sql AS $$SELECT$$;CREATE TABLE user_treasures(id uuid,user_id uuid,access_id text,source_type text,granted_at timestamptz);
CREATE TABLE products(id uuid PRIMARY KEY,name text,access_id text,sku text,inventory_quantity integer,stock_quantity integer);
CREATE TABLE product_variants(id uuid PRIMARY KEY,product_id uuid,title text);
CREATE TABLE orders(id uuid PRIMARY KEY,user_id uuid,status text,payment_status text,subtotal numeric,shipping_amount numeric,discount_amount numeric,coupon_discount_amount numeric,transfer_discount_amount numeric,total_amount numeric,tax_amount numeric,updated_at timestamptz);
CREATE TABLE order_items(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),order_id uuid,product_id uuid,variant_id uuid,quantity integer,unit_price numeric,total_price numeric,product_name text,variant_title text,sku text);
CREATE TABLE stock_movements(product_id uuid,movement_type text,quantity integer,reason text);
`);
  await db.exec(
    "ALTER TABLE orders ADD COLUMN payment_method text,ADD COLUMN mercadopago_payment_id text,ADD COLUMN currency text,ADD COLUMN installments integer,ADD COLUMN transaction_amount numeric,ADD COLUMN net_received_amount numeric,ADD COLUMN fees numeric;ALTER TABLE products ADD COLUMN updated_at timestamptz;",
  );
  await db.exec(migration("20260928000000_payment_effects_outbox.sql"));
  await db.exec(migration("20261003000001_treasure_entitlements.sql"));
  await db.exec(migration("20261003000002_order_revisions.sql"));
}, 60000);
afterAll(() => db.close());
beforeEach(async () => {
  await db.exec(
    "TRUNCATE payment_effects,order_revisions,treasure_grants,order_items,orders,stock_movements,products,auth.users CASCADE",
  );
  await db.query("INSERT INTO auth.users VALUES($1)", [user]);
  await db.query(
    "INSERT INTO products(id,name,inventory_quantity,stock_quantity,treasure_access_ids) VALUES($1,'Uno',10,10,ARRAY['linea-ecos']),($2,'Dos',10,10,ARRAY['kit-antena','linea-umbral'])",
    [product, p2],
  );
  await db.query(
    "INSERT INTO orders(id,user_id,status,payment_status,subtotal,shipping_amount,coupon_discount_amount,transfer_discount_amount,discount_amount,total_amount) VALUES($1,$2,'pending','pending',100,20,10,9,19,101)",
    [order, user],
  );
  await db.query(
    "INSERT INTO order_items(order_id,product_id,quantity,unit_price,total_price,product_name) VALUES($1,$2,1,100,100,'Uno')",
    [order, product],
  );
});
async function approve(id = order) {
  await db.query(
    "UPDATE orders SET payment_status='paid',status='paid' WHERE id=$1",
    [id],
  );
}
async function rectify(items: any[], version = 0, request = key) {
  return db.query(
    "SELECT rectify_order($1,$2,$3,$4,'Cambio solicitado',$5::jsonb,'{}') result",
    [order, user, request, version, JSON.stringify(items)],
  );
}
it("concede solo tras aprobación e idempotentemente", async () => {
  expect((await db.query("SELECT * FROM treasure_grants")).rows).toHaveLength(
    0,
  );
  await approve();
  await approve();
  expect(
    (
      await db.query(
        "SELECT access_id FROM treasure_grants WHERE revoked_at IS NULL ORDER BY access_id",
      )
    ).rows,
  ).toEqual([{ access_id: "linea-ecos" }, { access_id: "tesoro-gral" }]);
});
it("rectifica inventario, conserva pago/descuentos/envío e impide doble ejecución", async () => {
  await approve();
  const items = [{ product_id: product, quantity: 2, unit_price: 100 }];
  await rectify(items);
  await rectify(items);
  expect(
    (
      await db.query("SELECT inventory_quantity FROM products WHERE id=$1", [
        product,
      ])
    ).rows[0],
  ).toEqual({ inventory_quantity: 9 });
  expect(
    (
      await db.query(
        "SELECT original_paid_amount,adjustment_balance,total_amount,revision_version FROM orders",
      )
    ).rows[0],
  ).toEqual({
    original_paid_amount: "101.00",
    adjustment_balance: "100.00",
    total_amount: "201",
    revision_version: 1,
  });
  await expect(
    rectify([{ product_id: product, quantity: 3, unit_price: 100 }]),
  ).rejects.toThrow("reutilizado");
});
it("rechaza versión atrasada y revierte todos los cambios ante stock insuficiente", async () => {
  await approve();
  await expect(
    rectify([{ product_id: product, quantity: 99, unit_price: 100 }]),
  ).rejects.toThrow("Stock");
  expect((await db.query("SELECT quantity FROM order_items")).rows[0]).toEqual({
    quantity: 1,
  });
  await rectify([{ product_id: product, quantity: 2, unit_price: 100 }]);
  await expect(
    rectify([{ product_id: product, quantity: 2, unit_price: 100 }], 0, other),
  ).rejects.toThrow("cambió");
});
it("reconcilia kit y líneas explícitas al cambiar ítems", async () => {
  await approve();
  await rectify([{ product_id: p2, quantity: 1, unit_price: 100 }]);
  expect(
    (
      await db.query(
        "SELECT access_id FROM treasure_grants WHERE revoked_at IS NULL ORDER BY access_id",
      )
    ).rows,
  ).toEqual([
    { access_id: "kit-antena" },
    { access_id: "linea-umbral" },
    { access_id: "tesoro-gral" },
  ]);
});
it("reembolso revoca una compra preservando otra concesión válida", async () => {
  await approve();
  await db.query(
    "INSERT INTO orders(id,user_id,status,payment_status) VALUES($1,$2,'pending','pending')",
    [other, user],
  );
  await db.query(
    "INSERT INTO order_items(order_id,product_id,quantity) VALUES($1,$2,1)",
    [other, product],
  );
  await approve(other);
  await db.query("UPDATE orders SET payment_status='refunded' WHERE id=$1", [
    order,
  ]);
  expect(
    (
      await db.query(
        "SELECT DISTINCT access_id FROM treasure_grants WHERE revoked_at IS NULL ORDER BY access_id",
      )
    ).rows,
  ).toEqual([{ access_id: "linea-ecos" }, { access_id: "tesoro-gral" }]);
});
it("clientes carecen de RPC de concesión, rectificación y escritura de pagos", async () => {
  const r = await db.query(
    "SELECT has_function_privilege('authenticated','rectify_order(uuid,uuid,uuid,integer,text,jsonb,jsonb)','execute') rpc,has_table_privilege('authenticated','orders','insert') fabricate",
  );
  expect(r.rows[0]).toEqual({ rpc: false, fabricate: false });
});

it("dos rectificaciones concurrentes compiten por una sola versión", async () => {
  await approve();
  const items = [{ product_id: product, quantity: 2, unit_price: 100 }];
  const results = await Promise.allSettled([
    rectify(items, 0, key),
    rectify(items, 0, other),
  ]);
  expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
  expect(
    (await db.query("SELECT count(*)::int n FROM order_revisions")).rows[0],
  ).toEqual({ n: 1 });
});

it("confirmación real Tirada 3 concede accesos en la misma transacción", async () => {
  await db.query(
    "UPDATE orders SET payment_method='bank_transfer',payment_status='awaiting_transfer',currency='ARS',updated_at=now() WHERE id=$1",
    [order],
  );
  const snapshot = (
    await db.query<{ expected: unknown }>(
      "SELECT to_jsonb(o) expected FROM orders o WHERE id=$1",
      [order],
    )
  ).rows[0].expected;
  await db.query("SELECT confirm_order_payment_once($1,$2,'{}')", [
    order,
    JSON.stringify(snapshot),
  ]);
  expect(
    (
      await db.query("SELECT inventory_quantity FROM products WHERE id=$1", [
        product,
      ])
    ).rows[0],
  ).toEqual({ inventory_quantity: 9 });
  expect(
    (
      await db.query(
        "SELECT count(*)::int n FROM treasure_grants WHERE revoked_at IS NULL",
      )
    ).rows[0],
  ).toEqual({ n: 2 });
  await rectify([{ product_id: product, quantity: 2, unit_price: 100 }]);
  expect(
    (
      await db.query("SELECT inventory_quantity FROM products WHERE id=$1", [
        product,
      ])
    ).rows[0],
  ).toEqual({ inventory_quantity: 8 });
  expect(
    (await db.query("SELECT count(*)::int n FROM payment_effects")).rows[0],
  ).toEqual({ n: 1 });
});
