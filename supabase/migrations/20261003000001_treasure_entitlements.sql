BEGIN;
CREATE TABLE public.treasure_catalog(access_id text PRIMARY KEY,route text UNIQUE NOT NULL,title text NOT NULL,audio_url text CHECK(audio_url IS NULL OR audio_url ~ '^https://'),pdf_url text CHECK(pdf_url IS NULL OR pdf_url ~ '^https://'));
INSERT INTO treasure_catalog(access_id,route,title) VALUES ('tesoro-gral','/tesoro-bienvenida','Bienvenida'),('linea-ecos','/tesoro-ecos','Ecos'),('linea-umbral','/tesoro-umbral','Umbral'),('linea-alma-terra','/tesoro-alma-terra','Alma Terra'),('linea-jade','/tesoro-jade','Jade'),('linea-prisma','/tesoro-prisma','Prisma'),('kit-antena','/tesoro-kit-antena','Kit Antena'),('kit-templo','/tesoro-kit-templo','Kit Templo'),('kit-alquimia','/tesoro-kit-alquimia','Kit Alquimia'),('kit-aura','/tesoro-kit-aura','Kit Aura');
ALTER TABLE products ADD COLUMN treasure_access_ids text[] NOT NULL DEFAULT '{}';
-- Only explicit preexisting access IDs are migrated. No names are interpreted.
UPDATE products SET treasure_access_ids=ARRAY[CASE access_id WHEN 'kit-alkimya' THEN 'kit-alquimia' ELSE access_id END] WHERE access_id IN (SELECT access_id FROM treasure_catalog) OR access_id='kit-alkimya';
CREATE TABLE public.treasure_grants(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,access_id text NOT NULL REFERENCES treasure_catalog(access_id),order_id uuid REFERENCES orders(id) ON DELETE RESTRICT,source_key text NOT NULL,granted_at timestamptz NOT NULL DEFAULT now(),revoked_at timestamptz,UNIQUE(user_id,access_id,source_key));
CREATE INDEX treasure_grants_user ON treasure_grants(user_id,access_id) WHERE revoked_at IS NULL;
ALTER TABLE treasure_grants ENABLE ROW LEVEL SECURITY;ALTER TABLE treasure_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY grants_owner ON treasure_grants FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE POLICY catalog_entitled ON treasure_catalog FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM treasure_grants g WHERE g.user_id=auth.uid() AND g.access_id=treasure_catalog.access_id AND g.revoked_at IS NULL) OR public.is_admin(auth.uid()));
REVOKE ALL ON treasure_grants,treasure_catalog FROM PUBLIC,anon,authenticated;GRANT SELECT ON treasure_grants,treasure_catalog TO authenticated;GRANT ALL ON treasure_grants,treasure_catalog TO service_role;
CREATE FUNCTION public.reconcile_order_treasures(p_order_id uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
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
CREATE FUNCTION public.order_treasure_trigger() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$ BEGIN PERFORM reconcile_order_treasures(NEW.id);RETURN NEW;END;$$;
CREATE TRIGGER order_treasures AFTER INSERT OR UPDATE OF payment_status,status ON orders FOR EACH ROW EXECUTE FUNCTION order_treasure_trigger();
CREATE FUNCTION public.item_treasure_trigger() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$ BEGIN PERFORM reconcile_order_treasures(CASE WHEN TG_OP='DELETE' THEN OLD.order_id ELSE NEW.order_id END);RETURN NULL;END;$$;
CREATE TRIGGER item_treasures AFTER INSERT OR UPDATE OR DELETE ON order_items FOR EACH ROW EXECUTE FUNCTION item_treasure_trigger();
REVOKE ALL ON FUNCTION reconcile_order_treasures(uuid) FROM PUBLIC,anon,authenticated;GRANT EXECUTE ON FUNCTION reconcile_order_treasures(uuid) TO service_role;
-- Legacy granting RPCs cannot be invoked by clients.
REVOKE ALL ON FUNCTION grant_treasure_access(uuid,text,treasure_access_type,text,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION grant_treasures_from_order(uuid,uuid,text[]) FROM PUBLIC,anon,authenticated;
-- Import only grants with audited manual provenance. Purchase grants are rebuilt from approved orders.
INSERT INTO treasure_grants(user_id,access_id,source_key,granted_at) SELECT u.user_id,CASE u.access_id WHEN 'kit-alkimya' THEN 'kit-alquimia' ELSE u.access_id END,'legacy:'||u.id,u.granted_at FROM user_treasures u WHERE source_type<>'purchase' AND (u.access_id IN (SELECT access_id FROM treasure_catalog) OR u.access_id='kit-alkimya');
DO $$ DECLARE o record;BEGIN FOR o IN SELECT id FROM orders WHERE payment_status IN ('paid','partially_refunded') LOOP PERFORM reconcile_order_treasures(o.id);END LOOP;END;$$;
-- Client order writes could otherwise fabricate an approved purchase. Server/Admin flows use service_role.
REVOKE INSERT,UPDATE,DELETE ON orders,order_items FROM anon,authenticated;
CREATE FUNCTION public.validate_product_treasures() RETURNS trigger LANGUAGE plpgsql AS $$BEGIN IF EXISTS(SELECT 1 FROM unnest(NEW.treasure_access_ids) t WHERE NOT EXISTS(SELECT 1 FROM treasure_catalog c WHERE c.access_id=t)) THEN RAISE EXCEPTION 'Tesoro inválido';END IF;RETURN NEW;END;$$;
CREATE TRIGGER validate_product_treasures BEFORE INSERT OR UPDATE OF treasure_access_ids ON products FOR EACH ROW EXECUTE FUNCTION validate_product_treasures();
COMMIT;
