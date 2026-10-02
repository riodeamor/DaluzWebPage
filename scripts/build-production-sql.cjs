const fs = require('node:fs');
const path = require('node:path');

const migrations = [
  '20260804000000_add_bank_transfer_support.sql',
  '20260804000001_bank_transfer_email_templates.sql',
  '20260928000000_payment_effects_outbox.sql',
  '20260929000000_product_info_frontal.sql',
  '20261002000000_dynamic_commerce.sql',
  '20261003000000_catalog_taxonomy.sql',
  '20261003000001_treasure_entitlements.sql',
  '20261003000002_order_revisions.sql',
  '20261003000003_sendero_auth_config.sql',
];

function build() {
  const sections = migrations.map((file, i) => {
    const sql = fs.readFileSync(path.join('supabase/migrations', file), 'utf8')
      .replace(/^BEGIN;\s*/m, '').replace(/^COMMIT;\s*/m, '').trim();
    return `-- ${String(i + 1).padStart(2, '0')} — ${file}\n${sql}`;
  });
  return `-- DA LUZ: release Tiradas 3, 4 y 5.
-- Ejecutar completo en SQL Editor como postgres, sobre la base existente.
-- No instala el esquema histórico inicial. Respaldar antes de aplicar.
-- Transacción única: un error revierte todo el consolidado.
-- Las fuentes son idempotentes; no modifica precios base ni monedas.
BEGIN;
SELECT pg_advisory_xact_lock(3452026);
DO $preflight$
DECLARE required text;
BEGIN
  FOREACH required IN ARRAY ARRAY['auth.users','public.profiles','public.products',
    'public.product_variants','public.orders','public.order_items','public.stock_movements',
    'public.shipping_zones','public.shipping_carriers','public.system_config',
    'public.system_email_templates','public.membership_plans','public.memberships',
    'public.user_treasures'] LOOP
    IF to_regclass(required) IS NULL THEN
      RAISE EXCEPTION 'Falta tabla previa %. Aplicar esquema histórico antes de este release.', required;
    END IF;
  END LOOP;
END;
$preflight$;

${sections.join('\n\n')}

COMMIT;
`;
}

if (require.main === module) {
  const output = 'scripts/sql/deploy-produccion-tiradas-3-4-5.sql';
  const content = build();
  if (process.argv.includes('--check')) {
    if (fs.readFileSync(output, 'utf8').replace(/\r\n/g, '\n') !== content.replace(/\r\n/g, '\n')) {
      throw new Error('Consolidado desactualizado: ejecutar node scripts/build-production-sql.cjs');
    }
  } else {
    fs.writeFileSync(output, content);
  }
}
module.exports = { build, migrations };
