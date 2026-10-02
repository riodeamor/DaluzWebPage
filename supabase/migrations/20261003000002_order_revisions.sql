BEGIN;
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
COMMIT;
