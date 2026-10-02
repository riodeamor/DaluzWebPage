-- DA LUZ: release Tiradas 3, 4 y 5.
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

-- 01 — 20260804000000_add_bank_transfer_support.sql
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

-- 3. Datos bancarios editables desde el panel.
INSERT INTO system_config (config_key, config_value, category, is_public, is_sensitive, value_type, description)
VALUES
  ('bank_transfer_cbu',    '""', 'payments', true, false, 'string', 'CBU para pagos por transferencia'),
  ('bank_transfer_alias',  '""', 'payments', true, false, 'string', 'Alias para pagos por transferencia'),
  ('bank_transfer_holder', '""', 'payments', true, false, 'string', 'Titular de la cuenta bancaria'),
  ('bank_transfer_bank',   '""', 'payments', true, false, 'string', 'Nombre del banco')
ON CONFLICT (config_key) DO NOTHING;

-- 4. Tipos de template nuevos.
--
-- El CHECK se reconstruye a partir de los tipos que YA existen en la tabla,
-- mas los dos nuevos. No se escribe una lista fija a proposito: el CHECK
-- original de 20250116210000 quedo incompleto (no incluia payment_success ni
-- payment_failed, que el codigo carga en notifications.ts), asi que una lista
-- fija falla con "is violated by some row" en cuanto la base tiene un tipo
-- que el autor de la migracion no conocia.
DO $$
DECLARE
  allowed text;
BEGIN
  SELECT string_agg(quote_literal(t), ', ' ORDER BY t)
  INTO allowed
  FROM (
    SELECT DISTINCT type AS t FROM system_email_templates
    UNION SELECT 'bank_transfer_instructions'
    UNION SELECT 'bank_transfer_expired'
    -- Los tipos de la migracion original se listan igual para que la
    -- restriccion no dependa de que exista al menos una fila de cada uno.
    UNION SELECT 'order_confirmation'
    UNION SELECT 'order_shipped'
    UNION SELECT 'order_delivered'
    UNION SELECT 'password_reset'
    UNION SELECT 'account_welcome'
    UNION SELECT 'membership_welcome'
    UNION SELECT 'membership_reminder'
    UNION SELECT 'low_stock_alert'
    UNION SELECT 'marketing'
    UNION SELECT 'custom'
    UNION SELECT 'payment_success'
    UNION SELECT 'payment_failed'
  ) s;

  EXECUTE 'ALTER TABLE system_email_templates DROP CONSTRAINT IF EXISTS system_email_templates_type_check';
  EXECUTE format(
    'ALTER TABLE system_email_templates ADD CONSTRAINT system_email_templates_type_check CHECK (type IN (%s))',
    allowed
  );
END $$;

-- 02 — 20260804000001_bank_transfer_email_templates.sql
-- Templates de los dos mails del flujo de transferencia bancaria.
-- Reusan los bloques {{order_items}} y {{order_totals}} que genera
-- src/lib/email/blocks.ts, igual que el mail de confirmacion.
INSERT INTO system_email_templates (name, type, subject, content, variables, is_active, is_system)
VALUES
(
  'Instrucciones de transferencia',
  'bank_transfer_instructions',
  'Transferí para completar tu pedido {{order_number}} - DA LUZ CONSCIENTE',
  '<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background-color:#faf7f2;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#faf7f2;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background-color:#ffffff;border-collapse:collapse;">
        <tr><td style="padding:28px 32px 12px 32px;">
          <h1 style="margin:0;font-size:22px;color:#051341;">Hola {{customer_name}}, falta un paso</h1>
          <p style="margin:10px 0 0 0;font-size:15px;color:#4a4a4a;line-height:1.5;">
            Reservamos tu pedido <strong>{{order_number}}</strong>. Para confirmarlo, transferí
            <strong>{{order_total}}</strong> antes del {{transfer_deadline}}.
          </p>
        </td></tr>
        <tr><td style="padding:8px 32px 0 32px;">{{bank_details}}</td></tr>
        <tr><td style="padding:16px 32px 0 32px;">
          <h2 style="margin:16px 0 4px 0;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#051341;">Tu pedido</h2>
          {{order_items}}
        </td></tr>
        <tr><td style="padding:16px 32px 0 32px;">{{order_totals}}</td></tr>
        <tr><td style="padding:20px 32px 28px 32px;">
          <p style="margin:0;padding:12px;background-color:#FFF2E9;font-size:13px;color:#860119;line-height:1.5;">
            <strong>Cuidado con el fraude.</strong> Nuestro alias es siempre el que figura arriba
            y nunca lo cambiamos. Si recibís un mensaje diciendo que cambió, no transfieras y escribinos.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>',
  '["customer_name","order_number","order_total","transfer_deadline","bank_details","order_items","order_totals"]'::jsonb,
  true,
  true
),
(
  'Pedido vencido por falta de transferencia',
  'bank_transfer_expired',
  'Tu pedido {{order_number}} se canceló - DA LUZ CONSCIENTE',
  '<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background-color:#faf7f2;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#faf7f2;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background-color:#ffffff;border-collapse:collapse;">
        <tr><td style="padding:28px 32px;">
          <h1 style="margin:0;font-size:22px;color:#051341;">Hola {{customer_name}}</h1>
          <p style="margin:10px 0 0 0;font-size:15px;color:#4a4a4a;line-height:1.5;">
            No recibimos la transferencia de tu pedido <strong>{{order_number}}</strong>, así que lo cancelamos
            y liberamos los productos.
          </p>
          <p style="margin:14px 0 0 0;font-size:15px;color:#4a4a4a;line-height:1.5;">
            Si todavía los querés, podés armar el pedido de nuevo cuando quieras.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>',
  '["customer_name","order_number"]'::jsonb,
  true,
  true
)
ON CONFLICT (name, type) DO NOTHING;

-- 03 — 20260928000000_payment_effects_outbox.sql
-- Apply before deploying the payment worker. No historical orders are replayed.
CREATE TABLE IF NOT EXISTS public.payment_effects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  kind text NOT NULL CHECK (kind = 'order_confirmation'),
  state text NOT NULL DEFAULT 'pending'
    CHECK (state IN ('pending', 'processing', 'succeeded', 'manual_review')),
  payload jsonb,
  attempts integer NOT NULL DEFAULT 0,
  available_at timestamptz NOT NULL DEFAULT now(),
  lease_until timestamptz,
  claim_token uuid,
  first_send_at timestamptz,
  completed_at timestamptz,
  provider_id text,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_id, kind)
);
CREATE INDEX IF NOT EXISTS payment_effects_pending_idx ON public.payment_effects (available_at, created_at)
  WHERE state IN ('pending', 'processing');
ALTER TABLE public.payment_effects ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.payment_effects FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.payment_effects TO service_role;

CREATE OR REPLACE FUNCTION public.confirm_order_payment_once(
  p_order_id uuid, p_expected jsonb, p_payment jsonb DEFAULT '{}'::jsonb
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_item record;
  v_payment_id text := p_payment->>'mercadopago_payment_id';
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Order not found'; END IF;

  IF v_order.payment_status IN ('paid', 'refunded', 'partially_refunded')
     OR v_order.status IN ('paid', 'completed', 'shipped', 'delivered', 'refunded') THEN
    IF v_payment_id IS NOT NULL AND v_order.mercadopago_payment_id::text IS DISTINCT FROM v_payment_id THEN
      RAISE EXCEPTION 'Order settled by another payment';
    END IF;
    RETURN false;
  END IF;
  IF v_order.status = 'cancelled' THEN RAISE EXCEPTION 'Order cancelled'; END IF;
  IF v_order.updated_at IS DISTINCT FROM (p_expected->>'updated_at')::timestamptz
     OR v_order.status IS DISTINCT FROM p_expected->>'status'
     OR v_order.payment_status IS DISTINCT FROM p_expected->>'payment_status'
     OR v_order.mercadopago_payment_id::text IS DISTINCT FROM p_expected->>'mercadopago_payment_id'
     OR v_order.total_amount IS DISTINCT FROM (p_expected->>'total_amount')::numeric
     OR v_order.currency IS DISTINCT FROM p_expected->>'currency' THEN
    RAISE EXCEPTION 'Order changed during confirmation' USING ERRCODE = '40001';
  END IF;
  IF v_payment_id IS NULL THEN
    IF v_order.payment_method IS DISTINCT FROM 'bank_transfer'
       OR v_order.payment_status IS DISTINCT FROM 'awaiting_transfer' THEN
      RAISE EXCEPTION 'Order not awaiting a bank transfer';
    END IF;
  ELSIF v_order.payment_method = 'bank_transfer'
        OR (p_payment->>'transaction_amount')::numeric IS DISTINCT FROM v_order.total_amount THEN
    RAISE EXCEPTION 'Payment does not match order';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.order_items WHERE order_id = p_order_id)
     OR EXISTS (SELECT 1 FROM public.order_items WHERE order_id = p_order_id AND quantity <= 0) THEN
    RAISE EXCEPTION 'Order has invalid items';
  END IF;

  -- Same inventory policy as the existing flow, but with no swallowed errors.
  -- Deterministic product order prevents deadlocks between different orders.
  FOR v_item IN
    SELECT product_id, sum(quantity)::integer AS quantity
    FROM public.order_items WHERE order_id = p_order_id
    GROUP BY product_id ORDER BY product_id
  LOOP
    UPDATE public.products
    SET inventory_quantity = greatest(0, inventory_quantity - v_item.quantity),
        stock_quantity = greatest(0, coalesce(stock_quantity, inventory_quantity) - v_item.quantity),
        updated_at = now()
    WHERE id = v_item.product_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Order product missing'; END IF;
    INSERT INTO public.stock_movements(product_id, movement_type, quantity, reason)
    VALUES (v_item.product_id, 'decrease', v_item.quantity, 'order_completed');
  END LOOP;

  UPDATE public.orders SET
    status = CASE WHEN v_order.status = 'processing' THEN 'processing' ELSE 'paid' END,
    payment_status = 'paid',
    mercadopago_payment_id = coalesce(v_payment_id, v_order.mercadopago_payment_id::text),
    payment_method = coalesce(p_payment->>'payment_method', v_order.payment_method),
    installments = coalesce((p_payment->>'installments')::integer, v_order.installments),
    transaction_amount = coalesce((p_payment->>'transaction_amount')::numeric, v_order.transaction_amount),
    net_received_amount = coalesce((p_payment->>'net_received_amount')::numeric, v_order.net_received_amount),
    fees = coalesce((p_payment->>'fees')::numeric, v_order.fees),
    updated_at = now()
  WHERE id = p_order_id;

  INSERT INTO public.payment_effects(order_id, kind) VALUES (p_order_id, 'order_confirmation');
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_payment_effect(p_order_id uuid DEFAULT NULL)
RETURNS SETOF public.payment_effects LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id uuid;
BEGIN
  -- Resend retains idempotency keys for 24h. Keep a 1h safety margin.
  UPDATE public.payment_effects SET state = 'manual_review', claim_token = NULL, lease_until = NULL,
    last_error = 'Delivery outcome uncertain beyond the safe retry window'
  WHERE (p_order_id IS NULL OR order_id = p_order_id)
    AND (state = 'pending' OR (state = 'processing' AND lease_until < now()))
    AND (attempts >= 12 OR (kind = 'order_confirmation' AND first_send_at < now() - interval '23 hours'));

  SELECT id INTO v_id FROM public.payment_effects
  WHERE (p_order_id IS NULL OR order_id = p_order_id)
    AND ((state = 'pending' AND available_at <= now()) OR (state = 'processing' AND lease_until < now()))
  ORDER BY created_at, id FOR UPDATE SKIP LOCKED LIMIT 1;
  IF NOT FOUND THEN RETURN; END IF;
  RETURN QUERY UPDATE public.payment_effects SET
    state = 'processing', attempts = attempts + 1,
    claim_token = gen_random_uuid(), lease_until = now() + interval '5 minutes'
  WHERE id = v_id RETURNING *;
END;
$$;

CREATE OR REPLACE FUNCTION public.prepare_payment_email(p_id uuid, p_token uuid, p_payload jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_payload jsonb;
BEGIN
  UPDATE public.payment_effects SET payload = coalesce(payload, p_payload)
  WHERE id = p_id AND claim_token = p_token AND state = 'processing'
    AND kind = 'order_confirmation' AND lease_until > now()
  RETURNING payload INTO v_payload;
  IF NOT FOUND THEN RAISE EXCEPTION 'Payment effect lease lost'; END IF;
  RETURN v_payload;
END;
$$;

CREATE OR REPLACE FUNCTION public.begin_payment_email_send(p_id uuid, p_token uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.payment_effects SET first_send_at = coalesce(first_send_at, now())
  WHERE id = p_id AND claim_token = p_token AND state = 'processing'
    AND kind = 'order_confirmation' AND payload IS NOT NULL AND lease_until > now()
    AND (first_send_at IS NULL OR first_send_at > now() - interval '23 hours');
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.finish_payment_effect(
  p_id uuid, p_token uuid, p_success boolean, p_error text DEFAULT NULL,
  p_manual boolean DEFAULT false, p_provider_id text DEFAULT NULL
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.payment_effects SET
    state = CASE WHEN p_success THEN 'succeeded'
      WHEN p_manual OR attempts >= 12 OR first_send_at < now() - interval '23 hours' THEN 'manual_review'
      ELSE 'pending' END,
    completed_at = CASE WHEN p_success THEN now() ELSE NULL END,
    provider_id = coalesce(p_provider_id, provider_id),
    last_error = CASE WHEN p_success THEN NULL ELSE left(p_error, 300) END,
    available_at = now() + make_interval(secs => least(3600, 60 * power(2, least(attempts, 6)))::integer),
    claim_token = NULL, lease_until = NULL
  WHERE id = p_id AND claim_token = p_token AND state = 'processing';
  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_order_payment_once(uuid,jsonb,jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_payment_effect(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prepare_payment_email(uuid,uuid,jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.begin_payment_email_send(uuid,uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.finish_payment_effect(uuid,uuid,boolean,text,boolean,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_order_payment_once(uuid,jsonb,jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_payment_effect(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.prepare_payment_email(uuid,uuid,jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.begin_payment_email_send(uuid,uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.finish_payment_effect(uuid,uuid,boolean,text,boolean,text) TO service_role;

-- 04 — 20260929000000_product_info_frontal.sql
-- Additive, optional catalog field. Apply before enabling the updated admin.
-- No product titles, prices, payment benefits or existing descriptions change.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS info_frontal text;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_info_frontal_length;
ALTER TABLE public.products ADD CONSTRAINT products_info_frontal_length
  CHECK (info_frontal IS NULL OR char_length(info_frontal) <= 65);
COMMENT ON COLUMN public.products.info_frontal IS
  'Texto breve de portada: activos y tipo de piel. Maximo 65 caracteres.';

-- 05 — 20261002000000_dynamic_commerce.sql
ALTER TABLE public.shipping_zones
  ADD COLUMN IF NOT EXISTS region_key text UNIQUE CHECK (region_key IN ('cordoba','centro','nacional','patagonia','respaldo')),
  ADD COLUMN IF NOT EXISTS regional_rate numeric(12,2) CHECK (regional_rate >= 0),
  ADD COLUMN IF NOT EXISTS carrier_id uuid REFERENCES public.shipping_carriers(id) ON DELETE SET NULL;

-- No se inventan tarifas: las zonas quedan sin precio hasta configurarlas en Admin.
INSERT INTO public.shipping_zones (name, description, region_key, sort_order)
VALUES
  ('Córdoba Capital y Sierras','CP 5000 a 5999','cordoba',1),
  ('Centro / CABA / GBA / Santa Fe','CP 1000 a 2999','centro',2),
  ('Nacional / Interior','CP 3000 a 4999 y 6000 a 7999','nacional',3),
  ('Patagonia / Tierra del Fuego','CP 8000 a 9499','patagonia',4),
  ('Zona de respaldo','CP fuera de los rangos regionales','respaldo',5)
ON CONFLICT (region_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL CHECK (code ~ '^[A-Z0-9_-]{1,40}$'),
  type text NOT NULL CHECK (type IN ('percent','fixed')),
  value numeric(12,2) NOT NULL CHECK (value > 0 AND (type <> 'percent' OR value <= 100)),
  minimum_purchase numeric(12,2) NOT NULL DEFAULT 0 CHECK (minimum_purchase >= 0),
  expires_at timestamptz,
  usage_limit integer CHECK (usage_limit > 0),
  is_active boolean NOT NULL DEFAULT true,
  combinable_con_transferencia boolean NOT NULL DEFAULT true,
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS coupons_updated ON public.coupons;
CREATE TRIGGER coupons_updated BEFORE UPDATE ON public.coupons
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL CHECK (length(trim(message)) BETWEEN 1 AND 500),
  link text CHECK (link IS NULL OR (length(link) <= 2000 AND (link ~ '^/[^/]' OR link = '/' OR link ~ '^https://'))),
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS announcements_updated ON public.announcements;
CREATE TRIGGER announcements_updated BEFORE UPDATE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX IF NOT EXISTS announcements_active_order ON public.announcements(sort_order, id) WHERE is_active;

INSERT INTO public.announcements (message,link,sort_order) SELECT seed.message,seed.link,seed.sort_order FROM (VALUES
 ('ENVÍO GRATIS A TODO EL PAÍS CON SUBTOTAL POST-CUPÓN SUPERIOR A {{free_shipping_threshold}}',NULL,0),
 ('10% OFF POR TRANSFERENCIA BANCARIA • 3 CUOTAS SIN INTERÉS',NULL,1),
 ('TESORO RITUAL DE REGALO EN CADA COMPRA PARA ACTIVAR EL GOCE EN EL COTIDIANO ✨',NULL,2),
 ('¿NO SABÉS QUÉ ALQUIMIA NECESITA TU PIEL? AGENDÁ TU SESIÓN UMBRAL 1 A 1 →','/servicios/consultas',3)) AS seed(message,link,sort_order) WHERE NOT EXISTS(SELECT 1 FROM public.announcements);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS coupon_id uuid REFERENCES public.coupons(id),
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS coupon_discount_amount numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS transfer_discount_amount numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_zone_key text,
  ADD COLUMN IF NOT EXISTS shipping_carrier_name text,
  ADD COLUMN IF NOT EXISTS checkout_request_id uuid,
  ADD COLUMN IF NOT EXISTS checkout_ready boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS checkout_fingerprint text;
CREATE UNIQUE INDEX IF NOT EXISTS orders_checkout_request ON public.orders(user_id, checkout_request_id) WHERE checkout_request_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  order_id uuid PRIMARY KEY REFERENCES public.orders(id) ON DELETE CASCADE,
  coupon_id uuid NOT NULL REFERENCES public.coupons(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS coupon_redemptions_coupon ON public.coupon_redemptions(coupon_id);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coupons_admin ON public.coupons;
CREATE POLICY coupons_admin ON public.coupons FOR ALL TO authenticated
USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
DROP POLICY IF EXISTS announcements_admin ON public.announcements;
CREATE POLICY announcements_admin ON public.announcements FOR ALL TO authenticated
USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
DROP POLICY IF EXISTS announcements_public ON public.announcements;
CREATE POLICY announcements_public ON public.announcements FOR SELECT TO anon, authenticated USING (is_active);
DROP POLICY IF EXISTS coupon_redemptions_admin ON public.coupon_redemptions;
CREATE POLICY coupon_redemptions_admin ON public.coupon_redemptions FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
GRANT ALL ON public.coupons, public.announcements TO authenticated, service_role;
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT ON public.coupon_redemptions TO authenticated;
GRANT ALL ON public.coupon_redemptions TO service_role;

-- Pedidos cancelados/fallidos liberan el cupo. Los pendientes lo reservan;
-- así el último uso no puede venderse a dos compradoras simultáneas.
CREATE OR REPLACE FUNCTION public.coupon_available(p_coupon_id uuid) RETURNS boolean
LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.coupons c WHERE c.id = p_coupon_id AND c.is_active AND NOT c.archived
    AND (c.expires_at IS NULL OR c.expires_at > now())
    AND (c.usage_limit IS NULL OR c.usage_limit > (
      SELECT count(*) FROM public.coupon_redemptions r JOIN public.orders o ON o.id = r.order_id
      WHERE r.coupon_id = c.id AND o.status NOT IN ('cancelled','failed')
    ))
  );
$$;

CREATE OR REPLACE FUNCTION public.reserve_order_coupon(p_order_id uuid, p_coupon_id uuid, p_updated_at timestamptz)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE c public.coupons; o public.orders; expected_discount numeric;
BEGIN
  -- Orden fijo de bloqueos. Toda reserva del mismo cupón se serializa aquí.
  SELECT * INTO c FROM public.coupons WHERE id = p_coupon_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Cupón no encontrado'; END IF;
  SELECT * INTO o FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND OR o.status <> 'pending' OR o.coupon_id IS DISTINCT FROM c.id THEN
    RAISE EXCEPTION 'Pedido inválido para reservar cupón';
  END IF;
  IF EXISTS (SELECT 1 FROM public.coupon_redemptions WHERE order_id = o.id AND coupon_id = c.id) THEN RETURN; END IF;
  IF c.updated_at IS DISTINCT FROM p_updated_at OR NOT public.coupon_available(c.id) OR o.subtotal < c.minimum_purchase THEN
    RAISE EXCEPTION 'El cupón cambió o agotó sus usos. Volvé a aplicarlo';
  END IF;
  expected_discount := least(o.subtotal, CASE WHEN c.type = 'percent' THEN round(o.subtotal * c.value / 100, 2) ELSE c.value END);
  IF o.coupon_discount_amount IS DISTINCT FROM expected_discount THEN RAISE EXCEPTION 'Descuento de cupón inválido'; END IF;
  INSERT INTO public.coupon_redemptions(order_id,coupon_id) VALUES (o.id,c.id);
END;
$$;
REVOKE ALL ON FUNCTION public.coupon_available(uuid), public.reserve_order_coupon(uuid,uuid,timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coupon_available(uuid), public.reserve_order_coupon(uuid,uuid,timestamptz) TO service_role;

-- Un pedido interrumpido antes de reservar no puede confirmarse con cupón.
-- No cambia la confirmación ni la cola de efectos de los pedidos de Tirada 3.
CREATE OR REPLACE FUNCTION public.ensure_order_coupon_reserved() RETURNS trigger
LANGUAGE plpgsql SET search_path = public, pg_temp AS $$
BEGIN
  IF NEW.coupon_id IS NOT NULL AND NEW.payment_status = 'paid'
     AND OLD.payment_status IS DISTINCT FROM 'paid'
     AND NOT EXISTS (SELECT 1 FROM public.coupon_redemptions WHERE order_id = NEW.id AND coupon_id = NEW.coupon_id) THEN
    RAISE EXCEPTION 'El pedido no tiene una reserva de cupón válida';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS order_coupon_reserved ON public.orders;
CREATE TRIGGER order_coupon_reserved BEFORE UPDATE OF payment_status ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.ensure_order_coupon_reserved();

-- 06 — 20261003000000_catalog_taxonomy.sql
CREATE TABLE IF NOT EXISTS public.catalog_terms (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text UNIQUE NOT NULL CHECK(slug ~ '^[a-z0-9-]{1,80}$'),
 label text NOT NULL CHECK(length(trim(label)) BETWEEN 1 AND 120),
 kind text NOT NULL CHECK(kind IN ('anatomy','need')), group_name text CHECK(group_name IN ('facial','capilar')),
 is_active boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.catalog_terms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS catalog_terms_public ON public.catalog_terms;
CREATE POLICY catalog_terms_public ON public.catalog_terms FOR SELECT TO anon,authenticated USING(is_active OR public.is_admin(auth.uid()));
DROP POLICY IF EXISTS catalog_terms_admin ON public.catalog_terms;
CREATE POLICY catalog_terms_admin ON public.catalog_terms FOR ALL TO authenticated USING(public.is_admin(auth.uid())) WITH CHECK(public.is_admin(auth.uid()));
GRANT SELECT ON public.catalog_terms TO anon;
GRANT ALL ON public.catalog_terms TO authenticated,service_role;
INSERT INTO public.catalog_terms(slug,label,kind,group_name,sort_order) VALUES
 ('rostro','Rostro','anatomy',NULL,1),('cuerpo','Cuerpo','anatomy',NULL,2),('cabello','Cabello','anatomy',NULL,3),('bucal','Bucal','anatomy',NULL,4),('aromaterapia','Aromaterapia','anatomy',NULL,5),('maquillaje','Maquillaje de la Tierra','anatomy',NULL,6),('herbales','Herbales','anatomy',NULL,7),
 ('facial-serena','Poros & Brillo • Serena','need','facial',1),('facial-ilumina','Nutrición & Sequedad • Ilumina','need','facial',2),('facial-soy','Firmeza & Regeneración • Soy','need','facial',3),('facial-claridad','Tono Uniforme & Calma • Claridad','need','facial',4),('facial-rituales','Rituales Faciales Completos','need','facial',5),
 ('capilar-raiz','Fuerza & Densidad • Raíz','need','capilar',6),('capilar-serena','Equilibrio & Cuero Cabelludo • Serena','need','capilar',7),('capilar-ilumina','Nutrición & Brillo • Ilumina','need','capilar',8),('capilar-pureza','Desenredo & Suavidad • Pureza','need','capilar',9),('capilar-ceremonia','Ceremonia Capilar Completa','need','capilar',10) ON CONFLICT (slug) DO NOTHING;
CREATE OR REPLACE FUNCTION public.catalog_normalize(value text) RETURNS text LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE AS $$
 SELECT regexp_replace(normalize(lower(value),NFD),U&'[\0300-\036f]','','g');
$$;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_kit boolean NOT NULL DEFAULT false,
 ADD COLUMN IF NOT EXISTS catalog_term_ids uuid[] NOT NULL DEFAULT '{}',
 ADD COLUMN IF NOT EXISTS name_search text GENERATED ALWAYS AS (public.catalog_normalize(name)) STORED,
 ADD COLUMN IF NOT EXISTS audio_url text CHECK(audio_url IS NULL OR audio_url ~ '^https://'),
 ADD COLUMN IF NOT EXISTS pdf_url text CHECK(pdf_url IS NULL OR pdf_url ~ '^https://');
CREATE TABLE IF NOT EXISTS public.product_catalog_terms (
 product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
 term_id uuid REFERENCES public.catalog_terms(id) ON DELETE RESTRICT,
 PRIMARY KEY(product_id,term_id)
);
ALTER TABLE public.product_catalog_terms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS product_terms_read ON public.product_catalog_terms;
CREATE POLICY product_terms_read ON public.product_catalog_terms FOR SELECT TO anon,authenticated
 USING(EXISTS(SELECT 1 FROM public.products p WHERE p.id=product_id AND (p.status='active' OR public.is_admin(auth.uid()))));
GRANT SELECT ON public.product_catalog_terms TO anon,authenticated;
GRANT ALL ON public.product_catalog_terms TO service_role;
CREATE OR REPLACE FUNCTION public.sync_product_catalog_terms() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM unnest(NEW.catalog_term_ids) t WHERE NOT EXISTS(SELECT 1 FROM catalog_terms c WHERE c.id=t)) THEN RAISE EXCEPTION 'Taxonomía inválida'; END IF;
 DELETE FROM product_catalog_terms WHERE product_id=NEW.id;
 INSERT INTO product_catalog_terms SELECT NEW.id,t FROM (SELECT DISTINCT unnest(NEW.catalog_term_ids) t) terms;
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS product_catalog_sync ON public.products;
CREATE TRIGGER product_catalog_sync AFTER INSERT OR UPDATE OF catalog_term_ids ON public.products FOR EACH ROW EXECUTE FUNCTION public.sync_product_catalog_terms();
CREATE INDEX IF NOT EXISTS products_kit_order ON public.products(is_kit,created_at DESC);
CREATE INDEX IF NOT EXISTS product_terms_lookup ON public.product_catalog_terms(term_id,product_id);
-- No asignaciones inferidas del nombre: Admin decide las relaciones de cada producto.

-- 07 — 20261003000001_treasure_entitlements.sql
CREATE TABLE IF NOT EXISTS public.treasure_catalog(access_id text PRIMARY KEY,route text UNIQUE NOT NULL,title text NOT NULL,audio_url text CHECK(audio_url IS NULL OR audio_url ~ '^https://'),pdf_url text CHECK(pdf_url IS NULL OR pdf_url ~ '^https://'));
INSERT INTO treasure_catalog(access_id,route,title) VALUES ('tesoro-gral','/tesoro-bienvenida','Bienvenida'),('linea-ecos','/tesoro-ecos','Ecos'),('linea-umbral','/tesoro-umbral','Umbral'),('linea-alma-terra','/tesoro-alma-terra','Alma Terra'),('linea-jade','/tesoro-jade','Jade'),('linea-prisma','/tesoro-prisma','Prisma'),('kit-antena','/tesoro-kit-antena','Kit Antena'),('kit-templo','/tesoro-kit-templo','Kit Templo'),('kit-alquimia','/tesoro-kit-alquimia','Kit Alquimia'),('kit-aura','/tesoro-kit-aura','Kit Aura') ON CONFLICT (access_id) DO NOTHING;
-- Backfill only when introducing the column; preserve subsequent Admin removals.
DO $product_access$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='treasure_access_ids') THEN
  ALTER TABLE products ADD COLUMN treasure_access_ids text[] NOT NULL DEFAULT '{}';
  UPDATE products SET treasure_access_ids=ARRAY[CASE access_id WHEN 'kit-alkimya' THEN 'kit-alquimia' ELSE access_id END] WHERE access_id IN (SELECT access_id FROM treasure_catalog) OR access_id='kit-alkimya';
 END IF;
END;$product_access$;
CREATE TABLE IF NOT EXISTS public.treasure_grants(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,access_id text NOT NULL REFERENCES treasure_catalog(access_id),order_id uuid REFERENCES orders(id) ON DELETE RESTRICT,source_key text NOT NULL,granted_at timestamptz NOT NULL DEFAULT now(),revoked_at timestamptz,UNIQUE(user_id,access_id,source_key));
CREATE INDEX IF NOT EXISTS treasure_grants_user ON treasure_grants(user_id,access_id) WHERE revoked_at IS NULL;
ALTER TABLE treasure_grants ENABLE ROW LEVEL SECURITY;ALTER TABLE treasure_catalog ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS grants_owner ON treasure_grants;
CREATE POLICY grants_owner ON treasure_grants FOR SELECT TO authenticated USING(user_id=auth.uid());
DROP POLICY IF EXISTS catalog_entitled ON treasure_catalog;
CREATE POLICY catalog_entitled ON treasure_catalog FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM treasure_grants g WHERE g.user_id=auth.uid() AND g.access_id=treasure_catalog.access_id AND g.revoked_at IS NULL) OR public.is_admin(auth.uid()));
REVOKE ALL ON treasure_grants,treasure_catalog FROM PUBLIC,anon,authenticated;GRANT SELECT ON treasure_grants,treasure_catalog TO authenticated;GRANT ALL ON treasure_grants,treasure_catalog TO service_role;
CREATE OR REPLACE FUNCTION public.reconcile_order_treasures(p_order_id uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE o orders%ROWTYPE; ids text[];
BEGIN
 SELECT * INTO o FROM orders WHERE id=p_order_id FOR UPDATE;IF NOT FOUND THEN RAISE EXCEPTION 'Pedido inexistente';END IF;
 ids:='{}';
 IF o.user_id IS NOT NULL AND o.payment_status IN ('paid','partially_refunded') AND o.status<>'refunded' AND EXISTS(SELECT 1 FROM order_items WHERE order_id=o.id AND quantity>0) THEN
  SELECT array_agg(DISTINCT t) INTO ids FROM (SELECT 'tesoro-gral' t UNION SELECT unnest(p.treasure_access_ids) FROM order_items i JOIN products p ON p.id=i.product_id WHERE i.order_id=o.id) a JOIN treasure_catalog c ON c.access_id=a.t;
 END IF;
 UPDATE treasure_grants SET revoked_at=now() WHERE order_id=o.id AND revoked_at IS NULL AND (user_id IS DISTINCT FROM o.user_id OR NOT(access_id=ANY(coalesce(ids,'{}'))));
 IF o.user_id IS NOT NULL THEN
  INSERT INTO treasure_grants(user_id,access_id,order_id,source_key) SELECT o.user_id,t,o.id,'order:'||o.id FROM unnest(coalesce(ids,'{}')) t ON CONFLICT(user_id,access_id,source_key) DO UPDATE SET revoked_at=NULL;
 END IF;
END;$$;
CREATE OR REPLACE FUNCTION public.order_treasure_trigger() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$ BEGIN PERFORM reconcile_order_treasures(NEW.id);RETURN NEW;END;$$;
DROP TRIGGER IF EXISTS order_treasures ON orders;
CREATE TRIGGER order_treasures AFTER INSERT OR UPDATE OF payment_status,status ON orders FOR EACH ROW EXECUTE FUNCTION order_treasure_trigger();
CREATE OR REPLACE FUNCTION public.item_treasure_trigger() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$ BEGIN PERFORM reconcile_order_treasures(CASE WHEN TG_OP='DELETE' THEN OLD.order_id ELSE NEW.order_id END);RETURN NULL;END;$$;
DROP TRIGGER IF EXISTS item_treasures ON order_items;
CREATE TRIGGER item_treasures AFTER INSERT OR UPDATE OR DELETE ON order_items FOR EACH ROW EXECUTE FUNCTION item_treasure_trigger();
REVOKE ALL ON FUNCTION reconcile_order_treasures(uuid) FROM PUBLIC,anon,authenticated;GRANT EXECUTE ON FUNCTION reconcile_order_treasures(uuid) TO service_role;
-- Legacy granting RPCs cannot be invoked by clients.
REVOKE ALL ON FUNCTION grant_treasure_access(uuid,text,treasure_access_type,text,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION grant_treasures_from_order(uuid,uuid,text[]) FROM PUBLIC,anon,authenticated;
-- Import only grants with audited manual provenance. Purchase grants are rebuilt from approved orders.
INSERT INTO treasure_grants(user_id,access_id,source_key,granted_at) SELECT u.user_id,CASE u.access_id WHEN 'kit-alkimya' THEN 'kit-alquimia' ELSE u.access_id END,'legacy:'||u.id,u.granted_at FROM user_treasures u WHERE source_type<>'purchase' AND (u.access_id IN (SELECT access_id FROM treasure_catalog) OR u.access_id='kit-alkimya') ON CONFLICT(user_id,access_id,source_key) DO NOTHING;
DO $$ DECLARE o record;BEGIN FOR o IN SELECT id FROM orders WHERE payment_status IN ('paid','partially_refunded') LOOP PERFORM reconcile_order_treasures(o.id);END LOOP;END;$$;
-- Client order writes could otherwise fabricate an approved purchase. Server/Admin flows use service_role.
REVOKE INSERT,UPDATE,DELETE ON orders,order_items FROM anon,authenticated;
CREATE OR REPLACE FUNCTION public.validate_product_treasures() RETURNS trigger LANGUAGE plpgsql AS $$BEGIN IF EXISTS(SELECT 1 FROM unnest(NEW.treasure_access_ids) t WHERE NOT EXISTS(SELECT 1 FROM treasure_catalog c WHERE c.access_id=t)) THEN RAISE EXCEPTION 'Tesoro inválido';END IF;RETURN NEW;END;$$;
DROP TRIGGER IF EXISTS validate_product_treasures ON products;
CREATE TRIGGER validate_product_treasures BEFORE INSERT OR UPDATE OF treasure_access_ids ON products FOR EACH ROW EXECUTE FUNCTION validate_product_treasures();

-- 08 — 20261003000002_order_revisions.sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS revision_version integer NOT NULL DEFAULT 0,ADD COLUMN IF NOT EXISTS original_paid_amount numeric(12,2),ADD COLUMN IF NOT EXISTS adjustment_balance numeric(12,2) NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS order_revisions(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),order_id uuid NOT NULL REFERENCES orders(id),request_id uuid NOT NULL,version integer NOT NULL,actor_id uuid NOT NULL,reason text NOT NULL CHECK(length(trim(reason)) BETWEEN 5 AND 1000),before_snapshot jsonb NOT NULL,after_snapshot jsonb NOT NULL,request_payload jsonb NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),UNIQUE(order_id,request_id),UNIQUE(order_id,version));
ALTER TABLE order_revisions ENABLE ROW LEVEL SECURITY;DROP POLICY IF EXISTS revisions_owner ON order_revisions;
CREATE POLICY revisions_owner ON order_revisions FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM orders o WHERE o.id=order_id AND o.user_id=auth.uid()) OR public.is_admin(auth.uid()));GRANT SELECT ON order_revisions TO authenticated;GRANT ALL ON order_revisions TO service_role;
CREATE OR REPLACE FUNCTION rectify_order(p_order_id uuid,p_actor uuid,p_request uuid,p_version integer,p_reason text,p_items jsonb,p_adjustments jsonb DEFAULT '{}') RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE o orders%ROWTYPE; old_items jsonb; new_items jsonb; payload jsonb; existing order_revisions%ROWTYPE; item jsonb; p products%ROWTYPE; v product_variants%ROWTYPE; delta record; v_subtotal numeric:=0; shipping numeric; coupon numeric; transfer numeric; total numeric; other_discount numeric; qty integer; price numeric; variant uuid;
BEGIN
 IF NOT public.is_admin(p_actor) THEN RAISE EXCEPTION 'Administración requerida';END IF;
 SELECT * INTO o FROM orders WHERE id=p_order_id FOR UPDATE;IF NOT FOUND THEN RAISE EXCEPTION 'Pedido inexistente';END IF;
 payload:=jsonb_build_object('items',p_items,'adjustments',p_adjustments,'reason',p_reason,'version',p_version);
 SELECT * INTO existing FROM order_revisions WHERE order_id=o.id AND request_id=p_request;
 IF FOUND THEN IF existing.request_payload<>payload THEN RAISE EXCEPTION 'Identificador reutilizado con otros datos';END IF;RETURN existing.after_snapshot;END IF;
 IF o.revision_version<>p_version THEN RAISE EXCEPTION 'El pedido cambió. Recargá antes de guardar' USING ERRCODE='40001';END IF;
 IF length(trim(p_reason)) NOT BETWEEN 5 AND 1000 OR jsonb_typeof(p_items)<>'array' OR jsonb_array_length(p_items) NOT BETWEEN 1 AND 100 THEN RAISE EXCEPTION 'Rectificación inválida';END IF;
 IF o.payment_status IN ('refunded','partially_refunded') OR o.status IN ('cancelled','refunded') THEN RAISE EXCEPTION 'Pedido cerrado o con reembolso: requiere revisión manual';END IF;
 IF EXISTS(SELECT 1 FROM jsonb_array_elements(p_items) i GROUP BY i->>'product_id',coalesce(i->>'variant_id','') HAVING count(*)>1) THEN RAISE EXCEPTION 'Ítems duplicados';END IF;
 SELECT coalesce(jsonb_agg(to_jsonb(i) ORDER BY i.id),'[]') INTO old_items FROM order_items i WHERE order_id=o.id;
 -- Lock all affected products in deterministic order, including items being removed.
 PERFORM 1 FROM products WHERE id IN (SELECT product_id FROM order_items WHERE order_id=o.id UNION SELECT (i->>'product_id')::uuid FROM jsonb_array_elements(p_items) i) ORDER BY id FOR UPDATE;
 FOR item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
  SELECT * INTO p FROM products WHERE id=(item->>'product_id')::uuid;IF NOT FOUND THEN RAISE EXCEPTION 'Producto inexistente';END IF;
  qty:=(item->>'quantity')::integer;price:=(item->>'unit_price')::numeric;variant:=nullif(item->>'variant_id','')::uuid;
  IF qty NOT BETWEEN 1 AND 10000 OR price IS NULL OR price<0 OR price<>round(price,2) THEN RAISE EXCEPTION 'Cantidad o precio inválido';END IF;
  IF variant IS NOT NULL THEN SELECT * INTO v FROM product_variants WHERE id=variant AND product_id=p.id;IF NOT FOUND THEN RAISE EXCEPTION 'Variante inválida';END IF;END IF;
  v_subtotal:=v_subtotal+qty*price;
 END LOOP;
 shipping:=coalesce((p_adjustments->>'shipping_amount')::numeric,o.shipping_amount,0);coupon:=coalesce((p_adjustments->>'coupon_discount_amount')::numeric,o.coupon_discount_amount,0);transfer:=coalesce((p_adjustments->>'transfer_discount_amount')::numeric,o.transfer_discount_amount,0);
 IF shipping<0 OR coupon<0 OR transfer<0 OR coupon+transfer>v_subtotal OR shipping<>round(shipping,2) OR coupon<>round(coupon,2) OR transfer<>round(transfer,2) THEN RAISE EXCEPTION 'Descuentos o envío inválidos';END IF;
 other_discount:=greatest(0,coalesce(o.discount_amount,0)-coalesce(o.coupon_discount_amount,0)-coalesce(o.transfer_discount_amount,0));
 IF coupon+transfer+other_discount>v_subtotal THEN RAISE EXCEPTION 'Los descuentos conservados superan el subtotal';END IF;
 total:=v_subtotal-coupon-transfer-other_discount+shipping+coalesce(o.tax_amount,0);
 IF o.payment_status='paid' THEN
  FOR delta IN SELECT product_id,sum(q)::integer q FROM (SELECT product_id,-quantity q FROM order_items WHERE order_id=o.id UNION ALL SELECT (i->>'product_id')::uuid,(i->>'quantity')::integer FROM jsonb_array_elements(p_items) i) d GROUP BY product_id ORDER BY product_id LOOP
   UPDATE products SET inventory_quantity=inventory_quantity-delta.q,stock_quantity=coalesce(stock_quantity,inventory_quantity)-delta.q WHERE id=delta.product_id AND inventory_quantity>=delta.q;
   IF NOT FOUND THEN RAISE EXCEPTION 'Stock insuficiente';END IF;
   IF delta.q<>0 THEN INSERT INTO stock_movements(product_id,movement_type,quantity,reason) VALUES(delta.product_id,CASE WHEN delta.q>0 THEN 'decrease' ELSE 'increase' END,abs(delta.q),'order_rectification:'||o.id);END IF;
  END LOOP;
 END IF;
 DELETE FROM order_items WHERE order_id=o.id;
 FOR item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
  SELECT * INTO p FROM products WHERE id=(item->>'product_id')::uuid;variant:=nullif(item->>'variant_id','')::uuid;
  INSERT INTO order_items(order_id,product_id,variant_id,quantity,unit_price,total_price,product_name,variant_title,sku) VALUES(o.id,p.id,variant,(item->>'quantity')::integer,(item->>'unit_price')::numeric,(item->>'quantity')::integer*(item->>'unit_price')::numeric,p.name,(SELECT title FROM product_variants WHERE id=variant),p.sku);
 END LOOP;
 UPDATE orders SET subtotal=v_subtotal,shipping_amount=shipping,coupon_discount_amount=coupon,transfer_discount_amount=transfer,discount_amount=coupon+transfer+other_discount,total_amount=total,revision_version=o.revision_version+1,original_paid_amount=CASE WHEN o.payment_status='paid' THEN coalesce(o.original_paid_amount,o.total_amount) ELSE o.original_paid_amount END,adjustment_balance=CASE WHEN o.payment_status='paid' THEN total-coalesce(o.original_paid_amount,o.total_amount) ELSE 0 END,updated_at=now() WHERE id=o.id;
 PERFORM reconcile_order_treasures(o.id);
 SELECT jsonb_build_object('order',to_jsonb(a),'items',(SELECT jsonb_agg(to_jsonb(i) ORDER BY i.id) FROM order_items i WHERE order_id=o.id)) INTO new_items FROM orders a WHERE a.id=o.id;
 INSERT INTO order_revisions(order_id,request_id,version,actor_id,reason,before_snapshot,after_snapshot,request_payload) VALUES(o.id,p_request,o.revision_version+1,p_actor,p_reason,jsonb_build_object('order',to_jsonb(o),'items',old_items),new_items,payload);
 RETURN new_items;
END;$$;
REVOKE ALL ON FUNCTION rectify_order(uuid,uuid,uuid,integer,text,jsonb,jsonb) FROM PUBLIC,anon,authenticated;GRANT EXECUTE ON FUNCTION rectify_order(uuid,uuid,uuid,integer,text,jsonb,jsonb) TO service_role;

-- 09 — 20261003000003_sendero_auth_config.sql
DO $programs$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='membership_plans' AND column_name='program_key') THEN
  ALTER TABLE membership_plans ADD COLUMN program_key text CHECK(program_key IN ('el-pulso','genesis','sintropia'));
  UPDATE membership_plans SET program_key=CASE slug WHEN 'el-pulso' THEN 'el-pulso' WHEN 'genesis' THEN 'genesis' WHEN 'sintropia' THEN 'sintropia' END WHERE slug IN ('el-pulso','genesis','sintropia');
 END IF;
END;$programs$;
CREATE UNIQUE INDEX IF NOT EXISTS membership_plan_program ON membership_plans(program_key) WHERE program_key IS NOT NULL;
-- Keep Auth and profile email synchronized in the same database transaction.
CREATE OR REPLACE FUNCTION public.sync_auth_profile_email() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$ BEGIN UPDATE profiles SET email=NEW.email,updated_at=now() WHERE id=NEW.id;RETURN NEW;END;$$;
DROP TRIGGER IF EXISTS auth_profile_email ON auth.users;
CREATE TRIGGER auth_profile_email AFTER UPDATE OF email ON auth.users FOR EACH ROW WHEN (OLD.email IS DISTINCT FROM NEW.email) EXECUTE FUNCTION public.sync_auth_profile_email();
DELETE FROM system_config WHERE config_key IN ('seo_twitter_handle','maintenance_mode') OR config_key ~ '^brand_.*color$';
-- Enrollment credentials can only be changed by Admin's service role.
REVOKE INSERT,UPDATE,DELETE ON memberships FROM anon,authenticated;
GRANT UPDATE(current_week,progress_percentage,completed_lessons,member_goals,member_notes) ON memberships TO authenticated;

COMMIT;
