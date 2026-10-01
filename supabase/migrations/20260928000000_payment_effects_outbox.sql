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

CREATE FUNCTION public.claim_payment_effect(p_order_id uuid DEFAULT NULL)
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

CREATE FUNCTION public.prepare_payment_email(p_id uuid, p_token uuid, p_payload jsonb)
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

CREATE FUNCTION public.begin_payment_email_send(p_id uuid, p_token uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
