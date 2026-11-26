-- Para el ensayo aislado de envíos, después del complemento de checkout.

BEGIN;

SET LOCAL lock_timeout = '5s';

SET LOCAL statement_timeout = '60s';

SET LOCAL search_path = public, pg_temp;

ALTER TABLE public.orders ADD COLUMN shipping_region_name text;

-- LOCAL PROPOSAL ONLY. Creates a separate model; no legacy zone/rate/config updates.

DO $guard$ BEGIN
 IF to_regclass('public.shipping_regions') IS NOT NULL OR to_regclass('public.shipping_policy') IS NOT NULL
 OR EXISTS(SELECT 1 FROM pg_proc WHERE pronamespace='public'::regnamespace AND proname IN
 ('shipping_text_key','shipping_coverage_valid','shipping_coverages_overlap','shipping_region_guard','shipping_policy_guard','resolve_shipping_destination')) THEN
  RAISE EXCEPTION 'Configurable shipping object already exists; compare before applying';
 END IF;
END $guard$;

CREATE TABLE public.shipping_policy(
 id boolean PRIMARY KEY DEFAULT true CHECK(id),
 enabled boolean NOT NULL DEFAULT false,
 free_shipping_threshold_ars numeric(12,2) NOT NULL CHECK(free_shipping_threshold_ars BETWEEN 0 AND 999999999),
 version integer NOT NULL DEFAULT 1 CHECK(version>0), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.shipping_regions(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL CHECK(length(trim(name)) BETWEEN 1 AND 120),
 rate_ars numeric(12,2) CHECK(rate_ars BETWEEN 0 AND 999999999),
 carrier_id uuid REFERENCES public.shipping_carriers(id) ON DELETE RESTRICT,
 is_active boolean NOT NULL DEFAULT false,
 coverage jsonb NOT NULL DEFAULT '[]' CHECK(jsonb_typeof(coverage)='array' AND jsonb_array_length(coverage)<=100),
 version integer NOT NULL DEFAULT 1 CHECK(version>0),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX shipping_region_name_unique ON public.shipping_regions(lower(trim(name)));
-- New setting only. Legacy free_shipping_threshold=50001 and rate threshold=77000 stay intact.
INSERT INTO public.shipping_policy(id,enabled,free_shipping_threshold_ars) VALUES(true,false,90000);

CREATE FUNCTION public.shipping_text_key(value text) RETURNS text LANGUAGE sql IMMUTABLE STRICT
SET search_path=public,pg_temp AS $$
 SELECT lower(regexp_replace(regexp_replace(normalize(trim(value),NFD),U&'[\0300-\036f]','','g'),'\s+',' ','g'));
$$;
CREATE FUNCTION public.shipping_coverage_valid(c jsonb) RETURNS boolean LANGUAGE plpgsql IMMUTABLE
SET search_path=public,pg_temp AS $$
BEGIN
 IF jsonb_typeof(c) IS DISTINCT FROM 'object' OR NOT(c ?& ARRAY['province','city','postal_from','postal_to']) THEN RETURN false; END IF;
 IF EXISTS(SELECT 1 FROM jsonb_object_keys(c) k WHERE k NOT IN ('province','city','postal_from','postal_to')) THEN RETURN false; END IF;
 IF jsonb_typeof(c->'province') NOT IN ('string','null') OR jsonb_typeof(c->'city') NOT IN ('string','null')
 OR jsonb_typeof(c->'postal_from') NOT IN ('number','null') OR jsonb_typeof(c->'postal_to') NOT IN ('number','null') THEN RETURN false; END IF;
 IF (c->>'province' IS NOT NULL AND (length(trim(c->>'province')) NOT BETWEEN 1 AND 120 OR c->>'province' ~ '[[:cntrl:]]'))
 OR (c->>'city' IS NOT NULL AND (length(trim(c->>'city')) NOT BETWEEN 1 AND 120 OR c->>'city' ~ '[[:cntrl:]]')) THEN RETURN false; END IF;
 IF c->>'city' IS NOT NULL AND c->>'province' IS NULL THEN RETURN false; END IF;
 IF (c->>'postal_from' IS NULL) <> (c->>'postal_to' IS NULL) THEN RETURN false; END IF;
 IF c->>'province' IS NULL AND c->>'postal_from' IS NULL THEN RETURN false; END IF;
 IF c->>'postal_from' IS NOT NULL THEN
  IF (c->>'postal_from')::numeric NOT BETWEEN 0 AND 9999 OR (c->>'postal_to')::numeric NOT BETWEEN 0 AND 9999
   OR (c->>'postal_from')::numeric <> trunc((c->>'postal_from')::numeric)
   OR (c->>'postal_to')::numeric <> trunc((c->>'postal_to')::numeric)
   OR (c->>'postal_from')::numeric > (c->>'postal_to')::numeric THEN RETURN false; END IF;
 END IF;
 RETURN true;
END;
$$;
CREATE FUNCTION public.shipping_coverages_overlap(a jsonb,b jsonb) RETURNS boolean LANGUAGE sql IMMUTABLE
SET search_path=public,pg_temp AS $$
 SELECT NOT(
  (a->>'province' IS NOT NULL AND b->>'province' IS NOT NULL AND a->>'province' <> b->>'province') OR
  (a->>'city' IS NOT NULL AND b->>'city' IS NOT NULL AND a->>'city' <> b->>'city') OR
  (a->>'postal_from' IS NOT NULL AND b->>'postal_from' IS NOT NULL AND
   ((a->>'postal_to')::integer < (b->>'postal_from')::integer OR (b->>'postal_to')::integer < (a->>'postal_from')::integer))
 );
$$;
CREATE FUNCTION public.shipping_region_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path=public,pg_temp AS $$
DECLARE c jsonb; normal jsonb; i integer; j integer;
BEGIN
 -- Serialize activation/coverage edits; subsequent volatile SPI queries see committed competitors.
 PERFORM pg_advisory_xact_lock(20261013,904);
 IF TG_OP='UPDATE' THEN
  IF NEW.id IS DISTINCT FROM OLD.id THEN RAISE EXCEPTION 'No se cambia el ID de una región'; END IF;
  NEW.version:=OLD.version+1; NEW.created_at:=OLD.created_at;
 ELSE NEW.version:=1; END IF;
 NEW.updated_at:=now(); NEW.name:=trim(NEW.name);
 IF jsonb_typeof(NEW.coverage) IS DISTINCT FROM 'array' OR jsonb_array_length(NEW.coverage)>100 THEN RAISE EXCEPTION 'Cobertura inválida'; END IF;
 FOR c IN SELECT value FROM jsonb_array_elements(NEW.coverage) LOOP
  IF NOT public.shipping_coverage_valid(c) THEN RAISE EXCEPTION 'Cobertura inválida: provincia, localidad y/o rango postal'; END IF;
 END LOOP;
 SELECT coalesce(jsonb_agg(jsonb_build_object('province',public.shipping_text_key(value->>'province'),
  'city',public.shipping_text_key(value->>'city'),'postal_from',value->'postal_from','postal_to',value->'postal_to')),'[]')
 INTO normal FROM jsonb_array_elements(NEW.coverage);
 NEW.coverage:=normal;
 FOR i IN 0..jsonb_array_length(NEW.coverage)-1 LOOP
  FOR j IN i+1..jsonb_array_length(NEW.coverage)-1 LOOP
   IF public.shipping_coverages_overlap(NEW.coverage->i,NEW.coverage->j) THEN RAISE EXCEPTION 'Coberturas superpuestas dentro de la región'; END IF;
  END LOOP;
 END LOOP;
 IF NEW.is_active THEN
  IF jsonb_array_length(NEW.coverage)=0 OR NOT EXISTS(
   SELECT 1 FROM shipping_services s JOIN shipping_manual_rates r ON r.service_id=s.id AND r.is_active
   JOIN shipping_dispatch_points p ON p.id=s.dispatch_point_id AND p.is_active
   JOIN shipping_carriers c ON c.id=s.carrier_id AND c.is_active WHERE s.region_id=NEW.id
  ) THEN RAISE EXCEPTION 'Para activar región: cobertura y tarifa manual confirmada con origen y transportista válidos'; END IF;
  IF EXISTS(SELECT 1 FROM public.shipping_regions r CROSS JOIN LATERAL jsonb_array_elements(r.coverage) a
    CROSS JOIN LATERAL jsonb_array_elements(NEW.coverage) b WHERE r.is_active AND r.id<>NEW.id
    AND (a.value->>'city' IS NULL) = (b.value->>'city' IS NULL)
    AND (a.value->>'postal_from' IS NULL) = (b.value->>'postal_from' IS NULL)
    AND public.shipping_coverages_overlap(a.value,b.value)) THEN
   RAISE EXCEPTION 'La cobertura se superpone con otra región activa del mismo nivel';
  END IF;
 END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER shipping_region_validation BEFORE INSERT OR UPDATE ON public.shipping_regions
FOR EACH ROW EXECUTE FUNCTION public.shipping_region_guard();
CREATE FUNCTION public.shipping_policy_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path=public,pg_temp AS $$
BEGIN
 PERFORM pg_advisory_xact_lock(20261013,904);
 IF NEW.enabled AND (NEW.default_dispatch_point_id IS NULL OR NEW.packaging_weight_g IS NULL
 OR NOT EXISTS(SELECT 1 FROM shipping_dispatch_points WHERE id=NEW.default_dispatch_point_id AND is_active)
 OR NOT EXISTS(SELECT 1 FROM shipping_services s JOIN shipping_regions r ON r.id=s.region_id AND r.is_active
 JOIN shipping_manual_rates t ON t.service_id=s.id AND t.is_active JOIN shipping_carriers c ON c.id=s.carrier_id AND c.is_active
 WHERE s.is_active AND s.dispatch_point_id=NEW.default_dispatch_point_id)) THEN
  RAISE EXCEPTION 'Configurá al menos una región activa antes de habilitar el modelo';
 END IF;
 NEW.version:=OLD.version+1; NEW.updated_at:=now(); RETURN NEW;
END;
$$;
CREATE TRIGGER shipping_policy_validation BEFORE UPDATE ON public.shipping_policy
FOR EACH ROW EXECUTE FUNCTION public.shipping_policy_guard();

CREATE FUNCTION public.resolve_shipping_destination(p_country text,p_province text,p_city text,p_postal integer)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE policy public.shipping_policy; r public.shipping_regions; c jsonb;
 chosen public.shipping_regions; matched integer:=0; uncertain boolean:=false; exact boolean;
 result jsonb;
BEGIN
 SELECT * INTO policy FROM public.shipping_policy WHERE id=true;
 result:=jsonb_build_object('threshold',policy.free_shipping_threshold_ars,'region_id',NULL,'rate_ars',NULL,
  'region_name',NULL,'carrier_name',NULL,'message','Este destino requiere coordinar el envío.');
 IF NOT FOUND OR NOT policy.enabled THEN RETURN result; END IF;
 IF public.shipping_text_key(coalesce(nullif(trim(p_country),''),'Argentina')) NOT IN ('argentina','ar','arg') THEN RETURN result; END IF;
 IF p_postal IS NOT NULL AND p_postal NOT BETWEEN 0 AND 9999 THEN RETURN result; END IF;
 p_province:=nullif(public.shipping_text_key(p_province),''); p_city:=nullif(public.shipping_text_key(p_city),'');
 FOR r IN SELECT * FROM public.shipping_regions WHERE is_active LOOP
  exact:=false;
  FOR c IN SELECT value FROM jsonb_array_elements(r.coverage) LOOP
   IF c->>'province' IS NOT NULL AND p_province IS NOT NULL AND c->>'province'<>p_province THEN CONTINUE; END IF;
   IF c->>'city' IS NOT NULL AND p_city IS NOT NULL AND c->>'city'<>p_city THEN CONTINUE; END IF;
   IF c->>'postal_from' IS NOT NULL AND p_postal IS NOT NULL AND p_postal NOT BETWEEN (c->>'postal_from')::integer AND (c->>'postal_to')::integer THEN CONTINUE; END IF;
   IF (c->>'province' IS NOT NULL AND p_province IS NULL) OR (c->>'city' IS NOT NULL AND p_city IS NULL)
    OR (c->>'postal_from' IS NOT NULL AND p_postal IS NULL) THEN uncertain:=true;
   ELSE exact:=true; END IF;
  END LOOP;
  IF exact THEN matched:=matched+1; chosen:=r; END IF;
 END LOOP;
 IF uncertain OR matched<>1 THEN RETURN result; END IF;
 IF chosen.rate_ars IS NULL OR chosen.carrier_id IS NULL OR NOT EXISTS(SELECT 1 FROM public.shipping_carriers WHERE id=chosen.carrier_id AND is_active) THEN RETURN result; END IF;
 RETURN result || jsonb_build_object('region_id',chosen.id,'rate_ars',chosen.rate_ars,'region_name',chosen.name,
  'carrier_name',(SELECT name FROM public.shipping_carriers WHERE id=chosen.carrier_id),'message',NULL);
END;
$$;

ALTER TABLE public.shipping_policy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_regions ENABLE ROW LEVEL SECURITY;
CREATE POLICY shipping_policy_admin_read ON public.shipping_policy FOR SELECT TO authenticated USING(public.is_admin(auth.uid()));
CREATE POLICY shipping_policy_admin_update ON public.shipping_policy FOR UPDATE TO authenticated USING(public.is_admin(auth.uid())) WITH CHECK(public.is_admin(auth.uid()));
CREATE POLICY shipping_regions_admin ON public.shipping_regions FOR ALL TO authenticated USING(public.is_admin(auth.uid())) WITH CHECK(public.is_admin(auth.uid()));
REVOKE ALL ON public.shipping_regions,public.shipping_policy FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE ON public.shipping_regions TO authenticated;
GRANT SELECT,UPDATE ON public.shipping_policy TO authenticated;
GRANT SELECT,INSERT,UPDATE ON public.shipping_regions,public.shipping_policy TO service_role;
REVOKE ALL ON FUNCTION public.resolve_shipping_destination(text,text,text,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_shipping_destination(text,text,text,integer) TO service_role;
REVOKE ALL ON FUNCTION public.shipping_region_guard(),public.shipping_policy_guard() FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.shipping_text_key(text),public.shipping_coverage_valid(jsonb),public.shipping_coverages_overlap(jsonb,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.shipping_text_key(text),public.shipping_coverage_valid(jsonb),public.shipping_coverages_overlap(jsonb,jsonb) TO authenticated,service_role;

-- LOCAL PROPOSAL. Run only together with the updated additive reconciliation.

CREATE TABLE public.shipping_dispatch_points(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL CHECK(length(trim(name)) BETWEEN 1 AND 120),
 province text NOT NULL, city text NOT NULL, address text, postal_code text,
 is_active boolean NOT NULL DEFAULT false, version integer NOT NULL DEFAULT 1,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(address IS NULL OR length(trim(address)) BETWEEN 1 AND 240),
 CHECK(postal_code IS NULL OR postal_code ~* '^(\d{4}|[A-Z]\d{4}[A-Z]{3})$'),
 CHECK(NOT is_active OR (address IS NOT NULL AND postal_code IS NOT NULL))
);
INSERT INTO public.shipping_dispatch_points(name,province,city) VALUES
 ('Río Ceballos','Córdoba','Río Ceballos'),('Unquillo','Córdoba','Unquillo'),('Córdoba Capital','Córdoba','Córdoba Capital');
ALTER TABLE public.shipping_policy ADD COLUMN default_dispatch_point_id uuid REFERENCES public.shipping_dispatch_points(id) ON DELETE RESTRICT,
 ADD COLUMN packaging_weight_g integer CHECK(packaging_weight_g>0 AND packaging_weight_g<=100000000),
 ADD COLUMN free_shipping_enabled boolean NOT NULL DEFAULT false;
CREATE TABLE public.shipping_services(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL CHECK(length(trim(name)) BETWEEN 1 AND 120),
 region_id uuid REFERENCES public.shipping_regions(id) ON DELETE RESTRICT,
 dispatch_point_id uuid REFERENCES public.shipping_dispatch_points(id) ON DELETE RESTRICT,
 carrier_id uuid REFERENCES public.shipping_carriers(id) ON DELETE RESTRICT,
 modality text NOT NULL CHECK(modality IN ('domicile','branch')),
 branch_name text, branch_address text, branch_postal_code text,
 oca_coverage_reference text CHECK(length(trim(oca_coverage_reference)) BETWEEN 1 AND 240),
 eligible_for_free_shipping boolean NOT NULL DEFAULT false, is_active boolean NOT NULL DEFAULT false,
 version integer NOT NULL DEFAULT 1, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(branch_postal_code IS NULL OR branch_postal_code ~* '^(\d{4}|[A-Z]\d{4}[A-Z]{3})$'),
 CHECK(NOT is_active OR (region_id IS NOT NULL AND dispatch_point_id IS NOT NULL AND carrier_id IS NOT NULL
 AND (modality='domicile' OR (length(trim(branch_name))>0 AND length(trim(branch_address))>0 AND branch_postal_code IS NOT NULL))))
);
CREATE TABLE public.shipping_manual_rates(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), service_id uuid REFERENCES public.shipping_services(id) ON DELETE RESTRICT,
 weight_from_g integer CHECK(weight_from_g>=0 AND weight_from_g<100000000), weight_to_g integer CHECK(weight_to_g>0 AND weight_to_g<=100000000),
 rate_ars numeric(12,2) CHECK(rate_ars BETWEEN 0 AND 999999999), confirmed_reference text, confirmed_on date,
 is_active boolean NOT NULL DEFAULT false, version integer NOT NULL DEFAULT 1,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(weight_from_g IS NULL OR weight_to_g IS NULL OR weight_from_g<weight_to_g),
 CHECK(NOT is_active OR (service_id IS NOT NULL AND weight_from_g IS NOT NULL AND weight_to_g IS NOT NULL
 AND rate_ars IS NOT NULL AND length(trim(confirmed_reference))>0 AND confirmed_on IS NOT NULL))
);
CREATE TABLE public.shipping_item_weights(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
 variant_id uuid REFERENCES public.product_variants(id) ON DELETE RESTRICT,
 weight_g integer CHECK(weight_g>0 AND weight_g<=100000000), is_active boolean NOT NULL DEFAULT false,
 version integer NOT NULL DEFAULT 1, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE NULLS NOT DISTINCT(product_id,variant_id), CHECK(NOT is_active OR weight_g IS NOT NULL)
);
ALTER TABLE public.orders ADD COLUMN shipping_snapshot jsonb;
CREATE TABLE public.shipping_order_snapshots(
 order_id uuid PRIMARY KEY REFERENCES public.orders(id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED,
 snapshot jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shipping_order_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY shipping_snapshot_admin ON public.shipping_order_snapshots FOR SELECT TO authenticated USING(public.is_admin(auth.uid()));
REVOKE ALL ON public.shipping_order_snapshots FROM PUBLIC,anon,authenticated,service_role;
GRANT SELECT ON public.shipping_order_snapshots TO authenticated,service_role;
CREATE FUNCTION public.shipping_private_snapshot_guard() RETURNS trigger LANGUAGE plpgsql SET search_path=public,pg_temp AS $$
BEGIN RAISE EXCEPTION 'La copia privada de envío es inmutable y requiere revisión'; END; $$;
CREATE TRIGGER shipping_private_snapshot_immutable BEFORE UPDATE OR DELETE ON public.shipping_order_snapshots FOR EACH ROW EXECUTE FUNCTION public.shipping_private_snapshot_guard();
CREATE FUNCTION public.manual_shipping_free_available() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path=public,pg_temp AS $$
 SELECT EXISTS(SELECT 1 FROM shipping_policy p JOIN shipping_dispatch_points o ON o.id=p.default_dispatch_point_id AND o.is_active
 JOIN shipping_services s ON s.dispatch_point_id=o.id AND s.is_active AND s.eligible_for_free_shipping
 JOIN shipping_regions g ON g.id=s.region_id AND g.is_active JOIN shipping_carriers c ON c.id=s.carrier_id AND c.is_active
 JOIN shipping_manual_rates r ON r.service_id=s.id AND r.is_active WHERE p.id=true AND p.enabled AND p.free_shipping_enabled AND p.packaging_weight_g IS NOT NULL);
$$;

-- One global configuration lock serializes concurrent edits and quote acceptance.
CREATE FUNCTION public.shipping_manual_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path=public,pg_temp AS $$
BEGIN
 PERFORM pg_advisory_xact_lock(20261013,904);
 IF TG_OP='UPDATE' THEN NEW.version:=OLD.version+1; NEW.updated_at:=now(); END IF;
 IF TG_TABLE_NAME='shipping_services' AND NEW.is_active THEN
  IF NOT EXISTS(SELECT 1 FROM shipping_dispatch_points WHERE id=NEW.dispatch_point_id AND is_active)
  OR NOT EXISTS(SELECT 1 FROM shipping_regions WHERE id=NEW.region_id AND is_active)
  OR NOT EXISTS(SELECT 1 FROM shipping_carriers WHERE id=NEW.carrier_id AND is_active) THEN
   RAISE EXCEPTION 'Servicio requiere origen, región y transportista activos';
  END IF;
  IF NEW.modality='branch' AND (NEW.branch_name IS NULL OR NEW.branch_address IS NULL OR NEW.branch_postal_code IS NULL) THEN
   RAISE EXCEPTION 'Completá los datos de la sucursal';
  END IF;
  IF NOT EXISTS(SELECT 1 FROM shipping_manual_rates WHERE service_id=NEW.id AND is_active) THEN RAISE EXCEPTION 'Confirmá una tarifa antes de activar servicio'; END IF;
  IF EXISTS(SELECT 1 FROM shipping_services s WHERE s.id<>NEW.id AND s.is_active AND s.region_id=NEW.region_id
   AND s.dispatch_point_id=NEW.dispatch_point_id AND s.carrier_id=NEW.carrier_id AND s.modality=NEW.modality
   AND (NEW.modality='domicile' OR lower(trim(s.branch_address))=lower(trim(NEW.branch_address)))) THEN
   RAISE EXCEPTION 'Servicio activo ambiguo o duplicado';
  END IF;
 ELSIF TG_TABLE_NAME='shipping_manual_rates' AND NEW.is_active THEN
  IF NEW.service_id IS NULL OR NEW.rate_ars IS NULL OR NEW.weight_from_g IS NULL OR NEW.weight_to_g IS NULL
  OR NEW.confirmed_reference IS NULL OR NEW.confirmed_on IS NULL THEN RAISE EXCEPTION 'Tarifa incompleta o sin confirmar'; END IF;
  IF NOT EXISTS(SELECT 1 FROM shipping_services s JOIN shipping_dispatch_points p ON p.id=s.dispatch_point_id AND p.is_active
   JOIN shipping_carriers c ON c.id=s.carrier_id AND c.is_active WHERE s.id=NEW.service_id AND s.region_id IS NOT NULL
   AND (s.modality='domicile' OR (length(trim(s.branch_name))>0 AND length(trim(s.branch_address))>0 AND s.branch_postal_code IS NOT NULL))) THEN
    RAISE EXCEPTION 'La tarifa requiere un servicio completo y un origen válido'; END IF;
  IF EXISTS(SELECT 1 FROM shipping_manual_rates r WHERE r.id<>NEW.id AND r.is_active AND r.service_id=NEW.service_id
   AND NEW.weight_from_g<r.weight_to_g AND r.weight_from_g<NEW.weight_to_g) THEN RAISE EXCEPTION 'Los rangos de peso se superponen'; END IF;
 ELSIF TG_TABLE_NAME='shipping_item_weights' THEN
  IF NEW.variant_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM product_variants WHERE id=NEW.variant_id AND product_id=NEW.product_id) THEN
   RAISE EXCEPTION 'La variante no pertenece al producto'; END IF;
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER shipping_point_validation BEFORE INSERT OR UPDATE ON public.shipping_dispatch_points FOR EACH ROW EXECUTE FUNCTION public.shipping_manual_guard();
CREATE TRIGGER shipping_service_validation BEFORE INSERT OR UPDATE ON public.shipping_services FOR EACH ROW EXECUTE FUNCTION public.shipping_manual_guard();
CREATE TRIGGER shipping_rate_validation BEFORE INSERT OR UPDATE ON public.shipping_manual_rates FOR EACH ROW EXECUTE FUNCTION public.shipping_manual_guard();
CREATE TRIGGER shipping_weight_validation BEFORE INSERT OR UPDATE ON public.shipping_item_weights FOR EACH ROW EXECUTE FUNCTION public.shipping_manual_guard();
CREATE FUNCTION public.shipping_carrier_lock() RETURNS trigger LANGUAGE plpgsql SET search_path=public,pg_temp AS $$
BEGIN PERFORM pg_advisory_xact_lock(20261013,904); RETURN NEW; END; $$;
CREATE TRIGGER shipping_carrier_manual_lock BEFORE UPDATE ON public.shipping_carriers FOR EACH ROW EXECUTE FUNCTION public.shipping_carrier_lock();

CREATE FUNCTION public.resolve_manual_shipping(p_country text,p_province text,p_city text,p_postal integer,p_items jsonb,p_service_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE policy shipping_policy; origin shipping_dispatch_points; region shipping_regions;
 svc shipping_services; rate shipping_manual_rates; item jsonb; weight shipping_item_weights;
 total_g bigint:=0; item_g bigint:=0; lines jsonb:='[]'; choices jsonb:='[]'; snapshot jsonb;
 result jsonb;
BEGIN
 result:=jsonb_build_object('rate_ars',NULL,'threshold',NULL,'snapshot',NULL,'options','[]'::jsonb,'message','Coordinar envío');
 SELECT * INTO policy FROM shipping_policy WHERE id=true;
 IF NOT FOUND OR NOT policy.enabled OR policy.packaging_weight_g IS NULL OR policy.default_dispatch_point_id IS NULL THEN RETURN result; END IF;
 SELECT * INTO origin FROM shipping_dispatch_points WHERE id=policy.default_dispatch_point_id AND is_active;
 IF NOT FOUND OR shipping_text_key(coalesce(p_country,'')) NOT IN ('argentina','ar') THEN RETURN result; END IF;
 IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' OR jsonb_array_length(p_items) NOT BETWEEN 1 AND 100 THEN RETURN result; END IF;
 FOR item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
  IF coalesce(item->>'quantity','') !~ '^[1-9][0-9]*$' OR (item->>'quantity')::numeric>100000 THEN RETURN result; END IF;
  SELECT * INTO weight FROM shipping_item_weights WHERE product_id=(item->>'productId')::uuid
   AND variant_id IS NOT DISTINCT FROM nullif(item->>'variantId','')::uuid AND is_active;
  IF NOT FOUND THEN RETURN result; END IF;
  item_g:=item_g+weight.weight_g::bigint*(item->>'quantity')::integer;
  lines:=lines||jsonb_build_array(jsonb_build_object('productId',item->>'productId','variantId',item->>'variantId',
   'quantity',(item->>'quantity')::integer,'weight_id',weight.id,'weight_version',weight.version,'unit_weight_g',weight.weight_g));
 END LOOP;
 total_g:=item_g+policy.packaging_weight_g;
 IF total_g>100000000 THEN RETURN result; END IF;
 -- Keep incomplete addresses from selecting a provincial fallback prematurely.
 IF nullif(shipping_text_key(p_province),'') IS NULL OR nullif(shipping_text_key(p_city),'') IS NULL OR p_postal IS NULL THEN RETURN result; END IF;
 WITH matching_regions AS (
  SELECT g.id, max(CASE WHEN c->>'city' IS NOT NULL THEN 2 ELSE 0 END
    + CASE WHEN c->>'postal_from' IS NOT NULL THEN 1 ELSE 0 END) AS specificity
  FROM shipping_regions g CROSS JOIN LATERAL jsonb_array_elements(g.coverage) c
  WHERE g.is_active
    AND (c->>'province' IS NULL OR c->>'province'=shipping_text_key(p_province))
    AND (c->>'city' IS NULL OR c->>'city'=shipping_text_key(p_city))
    AND (c->>'postal_from' IS NULL OR p_postal BETWEEN (c->>'postal_from')::integer AND (c->>'postal_to')::integer)
  GROUP BY g.id
 ), covered AS (
  SELECT s.*, sc.name AS carrier_name, g.specificity,
    CASE
      WHEN 'oca' IN (carrier_keys.code,carrier_keys.name) THEN 'oca'
      WHEN 'andreani' IN (carrier_keys.code,carrier_keys.name) THEN 'andreani'
      WHEN carrier_keys.code IN ('correoargentino','correoarg','paqar') OR carrier_keys.name IN ('correoargentino','correoarg','paqar') THEN 'correoargentino'
    END AS carrier_code
  FROM matching_regions g JOIN shipping_services s ON s.region_id=g.id
  JOIN shipping_carriers sc ON sc.id=s.carrier_id AND sc.is_active
  CROSS JOIN LATERAL (SELECT regexp_replace(shipping_text_key(sc.code),'[^a-z0-9]','','g') AS code,
    regexp_replace(shipping_text_key(sc.name),'[^a-z0-9]','','g') AS name) carrier_keys
  WHERE s.is_active AND s.dispatch_point_id=origin.id
 ), priced AS (
  SELECT c.*, r.rate_ars, dense_rank() OVER (PARTITION BY c.carrier_id,c.modality ORDER BY c.specificity DESC) AS priority
  FROM covered c JOIN shipping_manual_rates r ON r.service_id=c.id AND r.is_active
    AND total_g>=r.weight_from_g AND total_g<r.weight_to_g
  WHERE c.carrier_code IN ('andreani','correoargentino') OR (c.carrier_code='oca' AND c.specificity>=2 AND nullif(trim(c.oca_coverage_reference),'') IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM covered primary_service WHERE primary_service.carrier_code IN ('andreani','correoargentino')
      AND primary_service.modality=c.modality))
 )
 SELECT coalesce(jsonb_agg(jsonb_build_object('id',p.id,'name',p.name,'carrier_name',p.carrier_name,'modality',p.modality,
  'branch_name',p.branch_name,'branch_address',p.branch_address,'branch_postal_code',p.branch_postal_code,
  'manual_rate_ars',p.rate_ars,'free_shipping_threshold',CASE WHEN policy.free_shipping_enabled AND p.eligible_for_free_shipping THEN policy.free_shipping_threshold_ars ELSE NULL END)
  ORDER BY p.carrier_name,p.modality,p.name,p.id),'[]') INTO choices FROM priced p WHERE p.priority=1;
 result:=result||jsonb_build_object('options',choices,'weight_g',total_g);
 IF p_service_id IS NULL THEN RETURN result||jsonb_build_object('message',CASE WHEN jsonb_array_length(choices)>0 THEN 'Elegí un servicio de envío' ELSE 'Coordinar envío' END); END IF;
 IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(choices) o WHERE o->>'id'=p_service_id::text) THEN RETURN result; END IF;
 SELECT * INTO svc FROM shipping_services WHERE id=p_service_id;
 SELECT * INTO region FROM shipping_regions WHERE id=svc.region_id;
 SELECT * INTO rate FROM shipping_manual_rates WHERE service_id=svc.id AND is_active AND total_g>=weight_from_g AND total_g<weight_to_g;
 snapshot:=jsonb_build_object('origin',to_jsonb(origin),'region',to_jsonb(region),'service',to_jsonb(svc),'rate',to_jsonb(rate),
  'policy',to_jsonb(policy),'product_weight_g',item_g,'packaging_weight_g',policy.packaging_weight_g,'total_weight_g',total_g,
  'items',lines,'destination',jsonb_build_object('country',p_country,'province',p_province,'city',p_city,'postal',p_postal));
 RETURN result||jsonb_build_object('rate_ars',rate.rate_ars,'threshold',CASE WHEN policy.free_shipping_enabled AND svc.eligible_for_free_shipping THEN policy.free_shipping_threshold_ars ELSE NULL END,
  'region_id',region.id,'region_name',region.name,'carrier_name',(SELECT name FROM shipping_carriers WHERE id=svc.carrier_id),
  'snapshot',snapshot,'quote_token',md5(snapshot::text),'message',NULL);
END; $$;

-- Snapshots accepted under the same lock as configuration writes, then immutable.
CREATE FUNCTION public.shipping_order_snapshot_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path=public,pg_temp AS $$
DECLARE resolved jsonb; snap jsonb; d jsonb;
BEGIN
 IF TG_OP='DELETE' THEN
  IF OLD.shipping_snapshot IS NOT NULL THEN RAISE EXCEPTION 'Eliminar un pedido con origen conservado requiere revisión'; END IF;
  RETURN OLD;
 ELSIF TG_OP='UPDATE' THEN
  IF NEW.shipping_snapshot IS DISTINCT FROM OLD.shipping_snapshot THEN RAISE EXCEPTION 'El origen y tarifa del pedido requieren revisión; snapshot inmutable'; END IF;
  IF OLD.shipping_snapshot IS NOT NULL AND (NEW.shipping_amount IS DISTINCT FROM OLD.shipping_amount OR NEW.total_amount IS DISTINCT FROM OLD.total_amount
   OR (OLD.checkout_ready AND NEW.checkout_ready IS DISTINCT FROM OLD.checkout_ready)
   OR NEW.subtotal IS DISTINCT FROM OLD.subtotal OR NEW.discount_amount IS DISTINCT FROM OLD.discount_amount
   OR NEW.shipping_zone_key IS DISTINCT FROM OLD.shipping_zone_key OR NEW.shipping_region_name IS DISTINCT FROM OLD.shipping_region_name
   OR NEW.shipping_carrier_name IS DISTINCT FROM OLD.shipping_carrier_name OR NEW.shipping_country IS DISTINCT FROM OLD.shipping_country
   OR NEW.shipping_address_1 IS DISTINCT FROM OLD.shipping_address_1 OR NEW.shipping_city IS DISTINCT FROM OLD.shipping_city
   OR NEW.shipping_state IS DISTINCT FROM OLD.shipping_state OR NEW.shipping_postal_code IS DISTINCT FROM OLD.shipping_postal_code) THEN
   RAISE EXCEPTION 'Cambio de envío o importe requiere revisión; pedido confirmado conservado';
  END IF;
 ELSIF NEW.shipping_snapshot IS NOT NULL THEN
  PERFORM pg_advisory_xact_lock(20261013,904);
  snap:=NEW.shipping_snapshot->'configuration'; d:=snap->'destination';
  resolved:=resolve_manual_shipping(d->>'country',d->>'province',d->>'city',(d->>'postal')::integer,snap->'items',(snap->'service'->>'id')::uuid);
  IF resolved->'snapshot' IS NULL OR resolved->'snapshot' IS DISTINCT FROM snap THEN RAISE EXCEPTION 'La configuración de envío cambió; revisá la cotización'; END IF;
  IF NEW.shipping_snapshot->>'charged_shipping_ars' IS NULL OR (NEW.shipping_snapshot->>'charged_shipping_ars')::numeric IS DISTINCT FROM NEW.shipping_amount
   OR (NEW.shipping_snapshot->>'discounted_products_ars')::numeric IS DISTINCT FROM NEW.total_amount-NEW.shipping_amount THEN RAISE EXCEPTION 'Importes de envío no coinciden'; END IF;
  IF NEW.shipping_amount IS DISTINCT FROM (CASE WHEN resolved->>'threshold' IS NOT NULL AND NEW.total_amount-NEW.shipping_amount>=(resolved->>'threshold')::numeric
   THEN 0::numeric ELSE (resolved->>'rate_ars')::numeric END) THEN RAISE EXCEPTION 'Beneficio o tarifa cambió'; END IF;
  INSERT INTO shipping_order_snapshots(order_id,snapshot) VALUES(NEW.id,NEW.shipping_snapshot);
  -- Existing order SELECT grants must not expose a private dispatch address.
  NEW.shipping_snapshot:=jsonb_build_object('reference',NEW.id,'quote_token',resolved->>'quote_token',
    'charged_shipping_ars',NEW.shipping_amount,'discounted_products_ars',NEW.total_amount-NEW.shipping_amount);
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER shipping_order_snapshot_validation BEFORE INSERT OR UPDATE OR DELETE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.shipping_order_snapshot_guard();
CREATE FUNCTION public.shipping_order_items_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE parent orders;
BEGIN
 SELECT * INTO parent FROM orders WHERE id=CASE WHEN TG_OP='DELETE' THEN OLD.order_id ELSE NEW.order_id END FOR UPDATE;
 IF parent.shipping_snapshot IS NOT NULL AND (TG_OP<>'INSERT' OR parent.checkout_ready) THEN
  RAISE EXCEPTION 'Cambiar productos de un pedido con envío conservado requiere revisión'; END IF;
 IF TG_OP='UPDATE' AND OLD.order_id IS DISTINCT FROM NEW.order_id AND EXISTS(SELECT 1 FROM orders WHERE id=OLD.order_id AND shipping_snapshot IS NOT NULL) THEN
  RAISE EXCEPTION 'Mover productos de un pedido conservado requiere revisión'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF; RETURN NEW;
END; $$;
CREATE TRIGGER shipping_order_items_validation BEFORE INSERT OR UPDATE OR DELETE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.shipping_order_items_guard();

DO $access$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['shipping_dispatch_points','shipping_services','shipping_manual_rates','shipping_item_weights'] LOOP
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
  EXECUTE format('CREATE POLICY shipping_manual_admin ON public.%I FOR ALL TO authenticated USING(public.is_admin(auth.uid())) WITH CHECK(public.is_admin(auth.uid()))',t);
  EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC,anon,authenticated',t);
  EXECUTE format('GRANT SELECT,INSERT,UPDATE ON public.%I TO authenticated,service_role',t);
 END LOOP;
END; $access$;
REVOKE ALL ON FUNCTION public.shipping_manual_guard(),public.shipping_order_snapshot_guard(),public.shipping_order_items_guard(),public.shipping_private_snapshot_guard(),public.shipping_carrier_lock(),public.resolve_manual_shipping(text,text,text,integer,jsonb,uuid),public.manual_shipping_free_available() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_manual_shipping(text,text,text,integer,jsonb,uuid),public.manual_shipping_free_available() TO service_role;

COMMIT;

