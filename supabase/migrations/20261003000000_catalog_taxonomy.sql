BEGIN;
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
COMMIT;
