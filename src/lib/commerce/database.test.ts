import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll, beforeEach, afterAll, describe, it, expect } from "vitest";
const db = new PGlite();
const c = "00000000-0000-0000-0000-000000000010", o1 = "00000000-0000-0000-0000-000000000011", o2 = "00000000-0000-0000-0000-000000000012";
async function scalar(sql: string, params: unknown[] = []) {
  const result = await db.query<Record<string, unknown>>(sql, params);
  return Object.values(result.rows[0] ?? {})[0];
}
async function reserve(orderId: string, timestamp?: unknown) {
  const updated = timestamp ?? await scalar("select updated_at from coupons where id=$1", [c]);
  return db.query("select reserve_order_coupon($1,$2,$3)", [orderId, c, updated]);
}
beforeAll(async () => {
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT NULL::uuid $$;
    CREATE FUNCTION public.is_admin(uuid) RETURNS boolean LANGUAGE sql AS $$ SELECT false $$;
    CREATE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = clock_timestamp(); RETURN NEW; END $$;
    CREATE TABLE shipping_carriers(id uuid PRIMARY KEY);
    CREATE TABLE shipping_zones(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name text,description text,sort_order integer,is_active boolean DEFAULT true);
    CREATE TABLE orders(id uuid PRIMARY KEY,user_id uuid,status text,payment_status text,subtotal numeric(12,2));
  `);
  await db.exec(readFileSync(resolve("supabase/migrations/20261002000000_dynamic_commerce.sql"), "utf8"));
}, 60000);
afterAll(() => db.close());
beforeEach(async () => {
  await db.exec("TRUNCATE coupons, orders, coupon_redemptions CASCADE;");
  await db.query("INSERT INTO coupons(id,code,type,value,usage_limit) VALUES ($1,'PRUEBA','fixed',10,1)", [c]);
  for (const id of [o1, o2]) await db.query("INSERT INTO orders(id,user_id,status,subtotal,coupon_id,coupon_discount_amount) VALUES ($1,$1,'pending',100,$2,10)", [id, c]);
});
describe("migración y reservas reales en PostgreSQL en memoria", () => {
  it("crea cinco zonas sin inventar tarifas", async () => {
    expect(await scalar("SELECT count(*) FROM shipping_zones WHERE region_key IS NOT NULL AND regional_rate IS NULL")).toBe(5);
    expect(await scalar("SELECT combinable_con_transferencia FROM coupons WHERE id=$1", [c])).toBe(true);
  });
  it("reserva el último uso una vez y el reintento del mismo pedido es idempotente", async () => {
    await reserve(o1); await reserve(o1);
    expect(await scalar("SELECT count(*) FROM coupon_redemptions")).toBe(1);
    expect(await scalar("SELECT coupon_available($1)", [c])).toBe(false);
    await expect(reserve(o2)).rejects.toThrow("agotó");
  });
  it("serializa solicitudes de reserva sin exceder el cupo", async () => {
    // PGlite serializa conexiones; verifica transacción y exclusión local,
    // no pretende demostrar contención distribuida de Supabase.
    const results = await Promise.allSettled([reserve(o1), reserve(o2)]);
    expect(results.filter(r => r.status === "fulfilled")).toHaveLength(1);
    expect(await scalar("SELECT count(*) FROM coupon_redemptions")).toBe(1);
  });
  it.each(["cancelled", "failed"])("libera reserva de un pedido %s", async status => {
    await reserve(o1); await db.query("UPDATE orders SET status=$1 WHERE id=$2", [status, o1]);
    expect(await scalar("SELECT coupon_available($1)", [c])).toBe(true);
    await reserve(o2);
  });
  it("un pedido pagado sigue consumiendo el cupo", async () => {
    await reserve(o1); await db.query("UPDATE orders SET status='completed' WHERE id=$1", [o1]);
    await expect(reserve(o2)).rejects.toThrow("agotó");
  });
  it("rechaza un cupón modificado entre cotización y reserva", async () => {
    const stamp = await scalar("SELECT updated_at FROM coupons WHERE id=$1", [c]);
    await db.query("UPDATE coupons SET value=20 WHERE id=$1", [c]);
    await expect(reserve(o1, stamp)).rejects.toThrow("cambió");
    expect(await scalar("SELECT count(*) FROM coupon_redemptions")).toBe(0);
  });
  it.each(["is_active=false", "archived=true", "expires_at=now()-interval '1 minute'", "minimum_purchase=101"])("rechaza campaña %s al comprar", async assignment => {
    await db.exec(`UPDATE coupons SET ${assignment}`);
    await expect(reserve(o1)).rejects.toThrow("cambió");
  });
  it("rechaza descuento adulterado sin reservar", async () => {
    await db.query("UPDATE orders SET coupon_discount_amount=99 WHERE id=$1", [o1]);
    await expect(reserve(o1)).rejects.toThrow("Descuento");
    expect(await scalar("SELECT count(*) FROM coupon_redemptions")).toBe(0);
  });
  it("elimina la reserva si se revierte el pedido", async () => {
    await reserve(o1); await db.query("DELETE FROM orders WHERE id=$1", [o1]);
    expect(await scalar("SELECT coupon_available($1)", [c])).toBe(true);
  });
  it("no confirma un pedido interrumpido antes de reservar el cupón", async () => {
    await expect(db.query("UPDATE orders SET payment_status='paid' WHERE id=$1", [o1])).rejects.toThrow("reserva");
    await reserve(o1);
    await db.query("UPDATE orders SET payment_status='paid',status='paid' WHERE id=$1", [o1]);
    expect(await scalar("SELECT payment_status FROM orders WHERE id=$1", [o1])).toBe("paid");
  });
  it("impide repetir un intento de compra del mismo usuario", async () => {
    await db.query("UPDATE orders SET checkout_request_id=$1 WHERE id=$2", [o1, o1]);
    await expect(db.query("UPDATE orders SET user_id=$1,checkout_request_id=$1 WHERE id=$2", [o1, o2])).rejects.toThrow("duplicate");
  });
  it("RPC restringido a service_role, cupones privados y avisos filtrados por RLS", async () => {
    expect(await scalar("SELECT has_function_privilege('anon','reserve_order_coupon(uuid,uuid,timestamptz)','EXECUTE')")).toBe(false);
    expect(await scalar("SELECT has_function_privilege('authenticated','coupon_available(uuid)','EXECUTE')")).toBe(false);
    expect(await scalar("SELECT has_function_privilege('service_role','reserve_order_coupon(uuid,uuid,timestamptz)','EXECUTE')")).toBe(true);
    await db.exec("INSERT INTO announcements(message,is_active) VALUES ('OCULTO',false);");
    try {
      await db.exec("SET ROLE anon;");
      expect(await scalar("SELECT count(*) FROM announcements WHERE NOT is_active")).toBe(0);
      await expect(db.query("SELECT * FROM coupons")).rejects.toThrow("permission denied");
    } finally { await db.exec("RESET ROLE;"); }
  });
});
