import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, it, expect } from "vitest";
import { searchTokens } from "./search";
const db = new PGlite();
beforeAll(async () => {
  await db.exec(
    "CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;CREATE SCHEMA auth;CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT NULL::uuid $$;CREATE FUNCTION is_admin(uuid) RETURNS boolean LANGUAGE sql AS $$SELECT false$$;CREATE TABLE products(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name text,status text,created_at timestamptz DEFAULT now());",
  );
  await db.exec(
    readFileSync(
      "supabase/migrations/20261003000000_catalog_taxonomy.sql",
      "utf8",
    ),
  );
}, 60000);
afterAll(() => db.close());
it("normaliza diacríticos y exige todos los términos seguros", () => {
  expect(searchTokens("SÉRUM Raíz raíz")).toEqual(["serum", "raiz"]);
  expect(() => searchTokens("x%,or(status.eq.draft)")).toThrow();
  expect(() => searchTokens("x".repeat(121))).toThrow();
});
it("siembra siete categorías y diez necesidades sin asignaciones inferidas", async () => {
  const r = await db.query(
    "SELECT kind,count(*)::int n FROM catalog_terms GROUP BY kind ORDER BY kind",
  );
  expect(r.rows).toEqual([
    { kind: "anatomy", n: 7 },
    { kind: "need", n: 10 },
  ]);
  await db.exec(
    "INSERT INTO products(name,status)VALUES('Serena rostro','active')",
  );
  expect(
    (await db.query("SELECT * FROM product_catalog_terms")).rows,
  ).toHaveLength(0);
});
it("persiste relaciones explícitas y revierte referencias inválidas", async () => {
  await db.exec(
    "UPDATE products SET catalog_term_ids=ARRAY(SELECT id FROM catalog_terms WHERE slug IN ('rostro','facial-serena'))",
  );
  expect(
    (await db.query("SELECT * FROM product_catalog_terms")).rows,
  ).toHaveLength(2);
  await expect(
    db.exec(
      "UPDATE products SET catalog_term_ids=ARRAY['11111111-1111-1111-1111-111111111111'::uuid]",
    ),
  ).rejects.toThrow();
  expect(
    (await db.query("SELECT * FROM product_catalog_terms")).rows,
  ).toHaveLength(2);
});
it("nombre NFD y orden estricto de kits", async () => {
  await db.exec(
    "INSERT INTO products(name,status,is_kit,created_at)VALUES('Kit Raíz','active',true,now()+interval '1 day'),('Fórmula Raíz','active',false,now());",
  );
  const r = await db.query(
    "SELECT name FROM products WHERE name_search ILIKE '%raiz%' ORDER BY is_kit ASC,created_at DESC",
  );
  expect(r.rows).toEqual([{ name: "Fórmula Raíz" }, { name: "Kit Raíz" }]);
});
