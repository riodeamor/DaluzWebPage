BEGIN;
-- Test-project prerequisites from repository migrations; no customer data.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  currency TEXT DEFAULT 'ARS' NOT NULL,
  -- Product details
  sku TEXT UNIQUE,
  barcode TEXT,
  weight DECIMAL(8,2), -- in grams
  dimensions JSONB, -- {length, width, height}
  -- Inventory
  track_inventory BOOLEAN DEFAULT TRUE,
  inventory_quantity INTEGER DEFAULT 0,
  inventory_policy TEXT DEFAULT 'deny' CHECK (inventory_policy IN ('continue', 'deny')),
  low_stock_threshold INTEGER DEFAULT 5,
  -- Images and media
  featured_image TEXT,
  gallery JSONB, -- array of image URLs
  video_url TEXT,
  -- SEO and marketing
  meta_title TEXT,
  meta_description TEXT,
  search_keywords TEXT[],
  -- Product attributes specific to biocosmetics
  ingredients JSONB, -- array of ingredients with percentages
  skin_type TEXT[], -- ['dry', 'oily', 'combination', 'sensitive', 'normal']
  benefits TEXT[], -- product benefits
  usage_instructions TEXT,
  precautions TEXT,
  certifications TEXT[], -- ['organic', 'cruelty-free', 'vegan', etc.]
  shelf_life_months INTEGER,
  -- Category and organization
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  tags TEXT[],
  collections TEXT[],
  vendor TEXT DEFAULT 'ALKIMYA DA LUZ',
  -- Status and visibility
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_digital BOOLEAN DEFAULT FALSE,
  requires_shipping BOOLEAN DEFAULT TRUE,
  -- Timestamps
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  sku TEXT UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  inventory_quantity INTEGER DEFAULT 0,
  weight DECIMAL(8,2),
  barcode TEXT,
  image_url TEXT,
  -- Variant options (size, scent, color, etc.)
  option1 TEXT, -- e.g., "50ml"
  option2 TEXT, -- e.g., "Lavanda"
  option3 TEXT, -- e.g., "Glass bottle"
  position INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  -- Order status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
  fulfillment_status TEXT DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'partial', 'fulfilled')),
  -- Financial details (ARS currency)
  subtotal DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  shipping_amount DECIMAL(12,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'ARS' NOT NULL,
  -- Mercado Pago integration
  mp_payment_id TEXT, -- Mercado Pago payment ID
  mp_preference_id TEXT, -- Mercado Pago preference ID
  mp_payment_method TEXT, -- card, bank_transfer, etc.
  mp_payment_type TEXT, -- credit_card, debit_card, etc.
  mp_status TEXT, -- Mercado Pago status
  mp_status_detail TEXT,
  -- Customer information
  customer_notes TEXT,
  -- Shipping address
  shipping_first_name TEXT,
  shipping_last_name TEXT,
  shipping_company TEXT,
  shipping_address_1 TEXT,
  shipping_address_2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT DEFAULT 'Argentina',
  shipping_phone TEXT,
  -- Billing address
  billing_first_name TEXT,
  billing_last_name TEXT,
  billing_company TEXT,
  billing_address_1 TEXT,
  billing_address_2 TEXT,
  billing_city TEXT,
  billing_state TEXT,
  billing_postal_code TEXT,
  billing_country TEXT DEFAULT 'Argentina',
  billing_phone TEXT,
  -- Tracking and fulfillment
  tracking_number TEXT,
  carrier TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  product_name TEXT NOT NULL, -- Snapshot of product name at time of order
  variant_title TEXT, -- Snapshot of variant title
  sku TEXT, -- Snapshot of SKU
  weight DECIMAL(8,2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- Alter the existing 'orders' table to add Mercado Pago specific fields

-- Add a column to store the Mercado Pago preference ID
-- This ID is generated before the customer is sent to pay and is used to identify the payment attempt.
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS mercadopago_preference_id VARCHAR(255);

-- Add a column to store the final Mercado Pago payment ID
-- This ID is received after a payment is successfully processed.
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS mercadopago_payment_id BIGINT;

-- Add a column to store the payment method used (e.g., 'credit_card', 'ticket')
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100);

-- Add a column to store the number of installments, if applicable
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS installments INTEGER DEFAULT 1;

-- Add a column to store the currency of the transaction (e.g., 'ARS', 'USD')
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'ARS';

ALTER TABLE orders ALTER COLUMN mercadopago_payment_id TYPE text USING mercadopago_payment_id::text;
-- Expand orders.status check to cover the full set of values the webhook
-- service needs to write. The previous constraint blocked 'paid', 'failed',
-- and 'disputed', which caused MercadoPago webhooks to fail with check
-- constraint violations and left orders stuck in 'pending'.

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN (
    'pending',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
    'failed',
    'disputed'
  ));
-- ============================================================
-- Soporte de pago por transferencia bancaria (A1)
-- ============================================================

-- 1. payment_status admite los estados del flujo de transferencia.
--    'proof_submitted' se agrega ahora aunque A1 no lo use: expandir el
--    CHECK dos veces es trabajo repetido.
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN (
    'pending', 'paid', 'failed', 'refunded', 'partially_refunded',
    'awaiting_transfer',
    'proof_submitted'
  ));

-- 2. Vencimiento del pedido por transferencia. Null para MercadoPago.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transfer_expires_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_orders_transfer_expires
  ON orders (transfer_expires_at)
  WHERE payment_status = 'awaiting_transfer';

ALTER TABLE orders ADD COLUMN transaction_amount decimal(12,2), ADD COLUMN net_received_amount decimal(12,2), ADD COLUMN fees decimal(8,2);
ALTER TABLE products ADD COLUMN stock_quantity integer;
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('increase', 'decrease', 'adjustment')),
  quantity INTEGER NOT NULL,
  reason VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY; REVOKE ALL ON categories FROM anon, authenticated;
ALTER TABLE products ENABLE ROW LEVEL SECURITY; REVOKE ALL ON products FROM anon, authenticated;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY; REVOKE ALL ON product_variants FROM anon, authenticated;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY; REVOKE ALL ON orders FROM anon, authenticated;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY; REVOKE ALL ON order_items FROM anon, authenticated;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY; REVOKE ALL ON stock_movements FROM anon, authenticated;
COMMIT;