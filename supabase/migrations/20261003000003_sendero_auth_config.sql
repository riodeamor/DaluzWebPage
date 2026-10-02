BEGIN;
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
