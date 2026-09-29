-- Additive, optional catalog field. Apply before enabling the updated admin.
-- No product titles, prices, payment benefits or existing descriptions change.
ALTER TABLE public.products ADD COLUMN info_frontal text;
ALTER TABLE public.products ADD CONSTRAINT products_info_frontal_length
  CHECK (info_frontal IS NULL OR char_length(info_frontal) <= 65);
COMMENT ON COLUMN public.products.info_frontal IS
  'Texto breve de portada: activos y tipo de piel. Maximo 65 caracteres.';
