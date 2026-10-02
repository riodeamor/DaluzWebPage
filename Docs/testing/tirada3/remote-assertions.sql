-- Run ONLY in pdxgpfnxsewulpieqdrf (daluz-pruebas-tirada3.).
-- Synthetic fixtures are rolled back inside an exception subtransaction.
DO $$
DECLARE
  oid uuid := gen_random_uuid(); pid uuid := gen_random_uuid();
  expected jsonb; effect public.payment_effects%ROWTYPE;
  retry public.payment_effects%ROWTYPE; signature text; r text;
BEGIN
  FOREACH signature IN ARRAY ARRAY[
    'public.confirm_order_payment_once(uuid,jsonb,jsonb)',
    'public.claim_payment_effect(uuid)',
    'public.prepare_payment_email(uuid,uuid,jsonb)',
    'public.begin_payment_email_send(uuid,uuid)',
    'public.finish_payment_effect(uuid,uuid,boolean,text,boolean,text)'
  ] LOOP
    FOREACH r IN ARRAY ARRAY['anon','authenticated'] LOOP
      IF has_function_privilege(r,signature,'EXECUTE') THEN
        RAISE EXCEPTION 'Unexpected public execute: % %',r,signature;
      END IF;
    END LOOP;
    IF NOT has_function_privilege('service_role',signature,'EXECUTE') THEN
      RAISE EXCEPTION 'Missing service_role execute: %',signature;
    END IF;
  END LOOP;
  IF has_table_privilege('anon','public.payment_effects','SELECT')
    OR has_table_privilege('authenticated','public.payment_effects','SELECT')
    OR NOT (SELECT relrowsecurity FROM pg_class WHERE pg_class.oid='public.payment_effects'::regclass) THEN
    RAISE EXCEPTION 'Unsafe queue permissions';
  END IF;
  BEGIN
    INSERT INTO products(id,name,slug,price,status,inventory_quantity,stock_quantity)
      VALUES(pid,'Tirada 3 synthetic',pid::text,500,'active',10,10);
    INSERT INTO orders(id,order_number,email,subtotal,total_amount,status,payment_status,payment_method,transfer_expires_at)
      VALUES(oid,'TEST-'||oid::text,'tirada3@example.invalid',1000,1000,'pending','awaiting_transfer','bank_transfer',now()+interval '72 hours');
    INSERT INTO order_items(order_id,product_id,quantity,unit_price,total_price,product_name)
      VALUES(oid,pid,2,500,1000,'Tirada 3 synthetic');
    SELECT to_jsonb(o) INTO expected FROM orders o WHERE id=oid;
    -- Transaction rollback if inventory audit fails.
    BEGIN
      ALTER TABLE stock_movements ADD CONSTRAINT t3_simulate_failure CHECK(quantity<0) NOT VALID;
      PERFORM confirm_order_payment_once(oid,expected);
      RAISE EXCEPTION 'Audit failure did not abort';
    EXCEPTION WHEN check_violation THEN NULL;
    END;
    IF (SELECT inventory_quantity FROM products WHERE id=pid)<>10
      OR (SELECT payment_status FROM orders WHERE id=oid)<>'awaiting_transfer'
      OR EXISTS(SELECT FROM payment_effects WHERE order_id=oid) THEN
      RAISE EXCEPTION 'Atomic rollback failed';
    END IF;
    BEGIN
      PERFORM confirm_order_payment_once(oid,expected||'{"total_amount":1}'::jsonb);
      RAISE EXCEPTION 'Stale snapshot was accepted';
    EXCEPTION WHEN serialization_failure THEN NULL;
    END;
    IF NOT confirm_order_payment_once(oid,expected) OR confirm_order_payment_once(oid,expected) THEN
      RAISE EXCEPTION 'Confirmation not idempotent';
    END IF;
    IF (SELECT inventory_quantity FROM products WHERE id=pid)<>8
      OR (SELECT stock_quantity FROM products WHERE id=pid)<>8
      OR (SELECT count(*) FROM stock_movements WHERE product_id=pid)<>1
      OR (SELECT count(*) FROM payment_effects WHERE order_id=oid)<>1 THEN
      RAISE EXCEPTION 'Stock or queue duplicated';
    END IF;
    SELECT * INTO effect FROM claim_payment_effect(oid);
    IF effect.id IS NULL OR EXISTS(SELECT FROM claim_payment_effect(oid)) THEN
      RAISE EXCEPTION 'Lease exclusivity failed';
    END IF;
    IF begin_payment_email_send(effect.id,effect.claim_token) THEN
      RAISE EXCEPTION 'Unprepared email was accepted';
    END IF;
    PERFORM prepare_payment_email(effect.id,effect.claim_token,'{"synthetic":"original"}');
    IF NOT begin_payment_email_send(effect.id,effect.claim_token) THEN RAISE EXCEPTION 'Begin failed'; END IF;
    UPDATE payment_effects SET lease_until=now()-interval '1 second' WHERE id=effect.id;
    SELECT * INTO retry FROM claim_payment_effect(oid);
    IF retry.id<>effect.id OR retry.claim_token=effect.claim_token
      OR prepare_payment_email(retry.id,retry.claim_token,'{"synthetic":"changed"}')<>'{"synthetic":"original"}'::jsonb THEN
      RAISE EXCEPTION 'Recovery or immutable payload failed';
    END IF;
    IF finish_payment_effect(effect.id,effect.claim_token,true) THEN RAISE EXCEPTION 'Old lease accepted'; END IF;
    IF NOT finish_payment_effect(retry.id,retry.claim_token,false,'synthetic timeout')
      OR EXISTS(SELECT FROM claim_payment_effect(oid)) THEN RAISE EXCEPTION 'Backoff failed'; END IF;
    UPDATE payment_effects SET available_at=now()-interval '1 second' WHERE id=effect.id;
    SELECT * INTO retry FROM claim_payment_effect(oid);
    IF NOT finish_payment_effect(retry.id,retry.claim_token,true,NULL,false,'synthetic-provider')
      OR EXISTS(SELECT FROM claim_payment_effect(oid)) THEN RAISE EXCEPTION 'Completion failed'; END IF;
    UPDATE payment_effects SET state='pending',first_send_at=now()-interval '24 hours',available_at=now() WHERE id=effect.id;
    IF EXISTS(SELECT FROM claim_payment_effect(oid)) THEN
      RAISE EXCEPTION 'Unsafe retry was claimed';
    END IF;
    IF (SELECT state FROM payment_effects WHERE id=effect.id)<>'manual_review' THEN
      RAISE EXCEPTION 'Unsafe retry window accepted';
    END IF;
    RAISE EXCEPTION USING ERRCODE='ZX001', MESSAGE='All synthetic checks passed; roll back fixtures';
  EXCEPTION WHEN SQLSTATE 'ZX001' THEN NULL;
  END;
  IF EXISTS(SELECT FROM orders WHERE id=oid) OR EXISTS(SELECT FROM products WHERE id=pid) THEN
    RAISE EXCEPTION 'Synthetic fixture cleanup failed';
  END IF;
END $$;
SELECT 'PASS' AS result,
  'Permissions, rollback, stale snapshot, idempotency, stock, lease recovery, immutable payload, backoff, completion, manual review, fixture rollback' AS checks,
  current_database() AS database;
