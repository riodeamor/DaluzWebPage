import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { it, expect } from 'vitest';
const require = createRequire(import.meta.url);
const { build, migrations } = require('../../../scripts/build-production-sql.cjs');
const fixture = `
CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY,email text UNIQUE);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT NULL::uuid$$;
CREATE FUNCTION is_admin(uuid) RETURNS boolean LANGUAGE sql AS $$SELECT true$$;
CREATE FUNCTION update_updated_at_column() RETURNS trigger LANGUAGE plpgsql AS $$BEGIN NEW.updated_at=now();RETURN NEW;END;$$;
CREATE TYPE treasure_access_type AS ENUM ('general','linea','kit');
CREATE FUNCTION grant_treasure_access(uuid,text,treasure_access_type,text,uuid) RETURNS void LANGUAGE sql AS $$SELECT$$;
CREATE FUNCTION grant_treasures_from_order(uuid,uuid,text[]) RETURNS void LANGUAGE sql AS $$SELECT$$;
CREATE TABLE user_treasures(id uuid,user_id uuid,access_id text,source_type text,granted_at timestamptz);
CREATE TABLE profiles(id uuid,email text,updated_at timestamptz);
CREATE TABLE products(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name text,status text,created_at timestamptz DEFAULT now(),updated_at timestamptz,access_id text,sku text,inventory_quantity integer,stock_quantity integer,price numeric);
CREATE TABLE product_variants(id uuid PRIMARY KEY,product_id uuid,title text);
CREATE TABLE orders(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid,status text,payment_status text,subtotal numeric,shipping_amount numeric,discount_amount numeric,total_amount numeric,tax_amount numeric,updated_at timestamptz,payment_method text,mercadopago_payment_id text,currency text,installments integer,transaction_amount numeric,net_received_amount numeric,fees numeric);
CREATE TABLE order_items(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),order_id uuid,product_id uuid,variant_id uuid,quantity integer,unit_price numeric,total_price numeric,product_name text,variant_title text,sku text);
CREATE TABLE stock_movements(product_id uuid,movement_type text,quantity integer,reason text);
CREATE TABLE shipping_carriers(id uuid PRIMARY KEY); CREATE TABLE shipping_zones(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name text,description text,sort_order integer);
CREATE TABLE system_config(config_key text PRIMARY KEY,config_value jsonb,category text,is_public boolean,is_sensitive boolean,value_type text,description text);
CREATE TABLE system_email_templates(name text,type text,subject text,content text,variables jsonb,is_active boolean,is_system boolean,UNIQUE(name,type));
CREATE TABLE membership_plans(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),slug text,price numeric);
CREATE TABLE memberships(current_week integer,progress_percentage numeric,completed_lessons integer,member_goals text,member_notes text,status text,plan_id uuid);
`;

it('el consolidado coincide exactamente con sus fuentes ordenadas', () => {
  expect(readFileSync('scripts/sql/deploy-produccion-tiradas-3-4-5.sql','utf8').replace(/\r\n/g,'\n')).toBe(build().replace(/\r\n/g,'\n'));
});

it('aplica sobre base existente, repite sin duplicar ni sobrescribir configuración', async () => {
  const db = new PGlite();
  try {
    await db.exec(fixture);
    await db.exec("INSERT INTO membership_plans(slug,price) VALUES('genesis',123);INSERT INTO products(name,status,price) VALUES('Raíz','active',456)");
    await db.exec(build());
    await db.exec("UPDATE announcements SET message='Promoción editada' WHERE sort_order=0;UPDATE products SET access_id='linea-ecos',treasure_access_ids='{}';UPDATE membership_plans SET program_key=NULL");
    await db.exec(build());
    expect((await db.query('SELECT treasure_access_ids FROM products')).rows[0]).toEqual({treasure_access_ids:[]});
    expect((await db.query('SELECT program_key FROM membership_plans')).rows[0]).toEqual({program_key:null});
    expect((await db.query('SELECT count(*)::int n FROM announcements')).rows[0]).toEqual({n:4});
    await db.exec("UPDATE products SET treasure_access_ids=ARRAY['linea-jade'];UPDATE membership_plans SET program_key='sintropia'");
    await db.exec("UPDATE shipping_zones SET regional_rate=1000;UPDATE catalog_terms SET label='Rostro editado' WHERE slug='rostro';UPDATE treasure_catalog SET audio_url='https://example.com/audio.mp3' WHERE access_id='tesoro-gral';UPDATE products SET treasure_access_ids=ARRAY['linea-jade'];UPDATE membership_plans SET program_key='sintropia';UPDATE system_email_templates SET subject='Personalizado'");
    await db.exec(build());
    expect((await db.query('SELECT count(*)::int n FROM catalog_terms')).rows[0]).toEqual({n:17});
    expect((await db.query('SELECT count(*)::int n FROM announcements')).rows[0]).toEqual({n:4});
    expect((await db.query('SELECT count(*)::int n FROM treasure_catalog')).rows[0]).toEqual({n:10});
    expect((await db.query('SELECT count(*)::int n FROM shipping_zones WHERE regional_rate=1000')).rows[0]).toEqual({n:5});
    expect((await db.query("SELECT label FROM catalog_terms WHERE slug='rostro'")).rows[0]).toEqual({label:'Rostro editado'});
    expect((await db.query('SELECT price,treasure_access_ids FROM products')).rows[0]).toEqual({price:'456',treasure_access_ids:['linea-jade']});
    expect((await db.query('SELECT price,program_key FROM membership_plans')).rows[0]).toEqual({price:'123',program_key:'sintropia'});
    expect((await db.query("SELECT count(*)::int n FROM system_email_templates WHERE subject='Personalizado'")).rows[0]).toEqual({n:2});
    expect((await db.query("SELECT audio_url FROM treasure_catalog WHERE access_id='tesoro-gral'")).rows[0]).toEqual({audio_url:'https://example.com/audio.mp3'});
  } finally { await db.close(); }
}, 60000);

it('acepta migraciones previamente aplicadas individualmente sin registro adicional', async () => {
  const db = new PGlite();
  try {
    await db.exec(fixture);
    for (const file of migrations) await db.exec(readFileSync('supabase/migrations/'+file,'utf8'));
    await db.exec(build());
    expect((await db.query('SELECT count(*)::int n FROM announcements')).rows[0]).toEqual({n:4});
  } finally { await db.close(); }
}, 60000);

it('detiene el release antes de crear objetos cuando falta el esquema histórico', async () => {
  const db = new PGlite();
  try {
    await expect(db.exec(build())).rejects.toThrow('Falta tabla previa');
    await db.exec('ROLLBACK');
    expect((await db.query("SELECT to_regclass('public.payment_effects') t")).rows[0]).toEqual({t:null});
  } finally { await db.close(); }
}, 60000);
