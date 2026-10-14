export const DISABLED_IN_REHEARSAL = 'DISABLED_ADMIN_SEO_REHEARSAL';

export function isDeliveryRehearsal() {
  return process.env.VERCEL_ENV === 'preview' &&
    process.env.VERCEL_GIT_COMMIT_REF === 'codex/entrega-admin-seo-delivered';
}

export function businessIntegrationDisabled(secret?: string) {
  return isDeliveryRehearsal() || secret === DISABLED_IN_REHEARSAL;
}

// Fail closed before authentication or application queries in the hosted rehearsal.
export function assertRehearsalSupabase() {
  if (!isDeliveryRehearsal()) return;
  const ref = 'pdxgpfnxsewulpieqdrf';
  if (process.env.NEXT_PUBLIC_SUPABASE_URL !== `https://${ref}.supabase.co`) {
    throw new Error('Rehearsal requires the isolated Supabase project');
  }
  for (const [key, role] of [
    ['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon'],
    ['SUPABASE_SERVICE_ROLE_KEY', 'service_role'],
  ]) {
    try {
      const token = process.env[key] || '';
      const claims = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (claims.ref !== ref || claims.role !== role) throw new Error('Invalid claims');
    } catch {
      throw new Error('Rehearsal requires matching isolated Supabase credentials');
    }
  }
}
