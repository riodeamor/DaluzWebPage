import { afterEach, expect, it, vi } from 'vitest';
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
it('does not use the replacement or inherited read token in the rehearsal', async () => {
  vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'fixture'); vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production');
  vi.stubEnv('VERCEL_ENV', 'preview'); vi.stubEnv('VERCEL_GIT_COMMIT_REF', 'codex/entrega-admin-seo-delivered');
  vi.stubEnv('SANITY_API_READ_TOKEN', 'inherited-read-token');
  const { previewClient } = await import('./client');
  expect(previewClient.config().token).toBeUndefined();
});
it('treats the sentinel as anonymous reading even without platform metadata', async () => {
  vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'fixture'); vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production');
  vi.stubEnv('VERCEL_ENV', ''); vi.stubEnv('SANITY_API_READ_TOKEN', 'DISABLED_ADMIN_SEO_REHEARSAL');
  const { previewClient } = await import('./client');
  expect(previewClient.config().token).toBeUndefined();
});
