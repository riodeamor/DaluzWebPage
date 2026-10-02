BEGIN;

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

COMMIT;
