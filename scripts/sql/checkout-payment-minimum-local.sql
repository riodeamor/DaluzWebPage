-- Candidato de ensayo local. No es una migración automática ni está aprobado para producción.
-- Derivado de 20260928000000_payment_effects_outbox y 20261002000000_dynamic_commerce.
-- Sin semillas, conversiones de zonas, cambios de tarifa, ni reencolado de pedidos existentes.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';
SET LOCAL search_path = public, pg_temp;
DO $guard$
BEGIN
  IF current_setting('daluz.checkout_fixture', true) IS DISTINCT FROM 'synthetic-local-v1' THEN
    RAISE EXCEPTION 'El candidato sólo se puede aplicar en el ensayo local autorizado';
  END IF;
END;
$guard$;

ALTER TABLE public.shipping_zones
  ADD COLUMN region_key text UNIQUE CHECK (region_key IN ('cordoba','centro','nacional','patagonia','respaldo')),
  ADD COLUMN regional_rate numeric(12,2) CHECK (regional_rate >= 0),
  ADD COLUMN carrier_id uuid REFERENCES public.shipping_carriers(id) ON DELETE SET NULL;

CREATE TABLE public.coupons (
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
CREATE TRIGGER coupons_updated BEFORE UPDATE ON public.coupons
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.orders
  ADD COLUMN coupon_id uuid REFERENCES public.coupons(id),
  ADD COLUMN coupon_code text,
  ADD COLUMN coupon_discount_amount numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN transfer_discount_amount numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN shipping_zone_key text,
  ADD COLUMN shipping_carrier_name text,
  ADD COLUMN checkout_request_id uuid,
  ADD COLUMN checkout_ready boolean NOT NULL DEFAULT false,
  ADD COLUMN checkout_fingerprint text;
CREATE UNIQUE INDEX orders_checkout_request ON public.orders(user_id, checkout_request_id) WHERE checkout_request_id IS NOT NULL;

CREATE TABLE public.coupon_redemptions (
  order_id uuid PRIMARY KEY REFERENCES public.orders(id) ON DELETE CASCADE,
  coupon_id uuid NOT NULL REFERENCES public.coupons(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX coupon_redemptions_coupon ON public.coupon_redemptions(coupon_id);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.coupons, public.coupon_redemptions FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coupons, public.coupon_redemptions TO service_role;
CREATE POLICY coupons_admin ON public.coupons FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coupons TO authenticated;

-- Pedidos cancelados/fallidos liberan el cupo. Los pendientes lo reservan;
-- así el último uso no puede venderse a dos compradoras simultáneas.
CREATE FUNCTION public.coupon_available(p_coupon_id uuid) RETURNS boolean
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

CREATE FUNCTION public.reserve_order_coupon(p_order_id uuid, p_coupon_id uuid, p_updated_at timestamptz)
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
CREATE FUNCTION public.ensure_order_coupon_reserved() RETURNS trigger
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
CREATE TRIGGER order_coupon_reserved BEFORE UPDATE OF payment_status ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.ensure_order_coupon_reserved();

REVOKE ALL ON FUNCTION public.ensure_order_coupon_reserved() FROM PUBLIC, anon, authenticated;

-- Apply before deploying the payment worker. No historical orders are replayed.
CREATE TABLE public.payment_effects (
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
CREATE INDEX payment_effects_pending_idx ON public.payment_effects (available_at, created_at)
  WHERE state IN ('pending', 'processing');
ALTER TABLE public.payment_effects ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.payment_effects FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.payment_effects TO service_role;

CREATE FUNCTION public.confirm_order_payment_once(
  p_order_id uuid, p_expected jsonb, p_payment jsonb DEFAULT '{}'::jsonb
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
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

CREATE FUNCTION public.claim_payment_effect(p_order_id uuid DEFAULT NULL)
RETURNS SETOF public.payment_effects LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
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

CREATE FUNCTION public.prepare_payment_email(p_id uuid, p_token uuid, p_payload jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
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

CREATE FUNCTION public.begin_payment_email_send(p_id uuid, p_token uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  UPDATE public.payment_effects SET first_send_at = coalesce(first_send_at, now())
  WHERE id = p_id AND claim_token = p_token AND state = 'processing'
    AND kind = 'order_confirmation' AND payload IS NOT NULL AND lease_until > now()
    AND (first_send_at IS NULL OR first_send_at > now() - interval '23 hours');
  RETURN FOUND;
END;
$$;

CREATE FUNCTION public.finish_payment_effect(
  p_id uuid, p_token uuid, p_success boolean, p_error text DEFAULT NULL,
  p_manual boolean DEFAULT false, p_provider_id text DEFAULT NULL
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
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

COMMIT;
