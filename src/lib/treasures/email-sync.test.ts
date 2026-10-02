import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { it, expect, beforeAll, afterAll } from "vitest";
const db = new PGlite();
beforeAll(async () => {
  await db.exec(
    "CREATE ROLE anon;CREATE ROLE authenticated;CREATE SCHEMA auth;CREATE TABLE memberships(current_week integer,progress_percentage numeric,completed_lessons integer,member_goals text,member_notes text,status text,plan_id uuid);CREATE TABLE auth.users(id uuid PRIMARY KEY,email text UNIQUE);CREATE TABLE profiles(id uuid,email text,updated_at timestamptz);CREATE TABLE membership_plans(id uuid,slug text,price numeric);CREATE TABLE system_config(config_key text);INSERT INTO membership_plans VALUES(gen_random_uuid(),'genesis',123);INSERT INTO system_config VALUES('maintenance_mode'),('brand_primary_color'),('seo_twitter_handle'),('shipping_threshold');",
  );
  await db.exec(
    readFileSync(
      "supabase/migrations/20261003000003_sendero_auth_config.sql",
      "utf8",
    ),
  );
}, 60000);
afterAll(() => db.close());
it("email de Auth persiste sincronizado con perfil", async () => {
  await db.exec(
    "INSERT INTO auth.users VALUES('00000000-0000-0000-0000-000000000001','old@example.com');INSERT INTO profiles VALUES('00000000-0000-0000-0000-000000000001','old@example.com',now());UPDATE auth.users SET email='new@example.com'",
  );
  expect((await db.query("SELECT email FROM profiles")).rows).toEqual([
    { email: "new@example.com" },
  ]);
});
it("asocia programa explícito sin cambiar precio y retira campos obsoletos", async () => {
  expect(
    (await db.query("SELECT slug,price,program_key FROM membership_plans"))
      .rows,
  ).toEqual([{ slug: "genesis", price: "123", program_key: "genesis" }]);
  expect((await db.query("SELECT config_key FROM system_config")).rows).toEqual(
    [{ config_key: "shipping_threshold" }],
  );
});

it("clientes no pueden activar o cambiar su programa",async()=>{const r=await db.query("SELECT has_column_privilege('authenticated','memberships','status','update') activate,has_column_privilege('authenticated','memberships','plan_id','update') plan,has_column_privilege('authenticated','memberships','member_notes','update') notes");expect(r.rows[0]).toEqual({activate:false,plan:false,notes:true})});
