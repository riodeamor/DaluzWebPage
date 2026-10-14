import { afterEach, expect, it, vi } from 'vitest';
import { assertRehearsalSupabase, businessIntegrationDisabled, DISABLED_IN_REHEARSAL, isDeliveryRehearsal } from './preview-isolation';
afterEach(() => vi.unstubAllEnvs());
function setup() {
  vi.stubEnv('VERCEL_ENV', 'preview');
  vi.stubEnv('VERCEL_GIT_COMMIT_REF', 'codex/entrega-admin-seo-delivered');
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://pdxgpfnxsewulpieqdrf.supabase.co');
  for (const [key, role] of [['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon'], ['SUPABASE_SERVICE_ROLE_KEY', 'service_role']]) {
    vi.stubEnv(key, 'fixture.' + btoa(JSON.stringify({ ref: 'pdxgpfnxsewulpieqdrf', role })) + '.fixture');
  }
}
it('allows only matching test URL and roles in the rehearsal', () => {
  setup(); expect(() => assertRehearsalSupabase()).not.toThrow();
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://xdvemkyvgnfnibntfbwq.supabase.co');
  expect(() => assertRehearsalSupabase()).toThrow('isolated');
});
it('rejects wrong project credentials and malformed tokens', () => {
  setup();
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'fixture.' + btoa(JSON.stringify({ ref: 'production', role: 'service_role' })) + '.fixture');
  expect(() => assertRehearsalSupabase()).toThrow('credentials');
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'invalid');
  expect(() => assertRehearsalSupabase()).toThrow('credentials');
});
it('blocks business integrations even with inherited or valid-looking secrets', () => {
  setup(); expect(businessIntegrationDisabled('inherited-business-secret')).toBe(true);
});
it('treats the sentinel as disabled even if platform metadata is missing', () => {
  vi.stubEnv('VERCEL_ENV', '');
  expect(businessIntegrationDisabled(DISABLED_IN_REHEARSAL)).toBe(true);
});
it('preserves production and other branches with their original configuration', () => {
  setup(); vi.stubEnv('VERCEL_ENV', 'production');
  expect(isDeliveryRehearsal()).toBe(false); expect(businessIntegrationDisabled('original')).toBe(false);
  vi.stubEnv('VERCEL_ENV', 'preview'); vi.stubEnv('VERCEL_GIT_COMMIT_REF', 'other');
  expect(isDeliveryRehearsal()).toBe(false);
});
