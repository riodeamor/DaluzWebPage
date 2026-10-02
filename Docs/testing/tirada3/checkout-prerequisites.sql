-- ONLY the isolated test project pdxgpfnxsewulpieqdrf.
-- Checkout columns from migrations 20260803 and 20260325.
BEGIN;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_image text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_transfer_percent decimal(5,2) DEFAULT 0;
-- Test subset of system_config; admin-only metadata/FK are outside this flow.
CREATE TABLE public.system_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key text UNIQUE NOT NULL,
  config_value jsonb NOT NULL,
  category text NOT NULL DEFAULT 'general',
  is_public boolean DEFAULT false,
  is_sensitive boolean DEFAULT false
);
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON system_config FROM PUBLIC, anon, authenticated;
COMMIT;
