import { afterEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
const calls = vi.hoisted(() => ({ service: vi.fn(), log: vi.fn() }));
vi.mock('@/lib/auth/helpers', () => ({ getServiceClient: calls.service }));
vi.mock('@/lib/logger', () => ({ logger: calls.log }));
vi.mock('@/lib/repositories/orders.repository', () => ({ OrdersRepository: class {} }));
vi.mock('@/lib/repositories/payment-effects.repository', () => ({ PaymentEffectsRepository: class {} }));
vi.mock('@/lib/repositories/system.repository', () => ({ SystemRepository: class {} }));
vi.mock('@/lib/services/payment-effects.service', () => ({ PaymentEffectsService: class {} }));
vi.mock('@/lib/services/order-payment.service', () => ({ OrderPaymentService: class {} }));
vi.mock('@/lib/services/webhook.service', () => ({ WebhookService: class {} }));
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });
it('blocks both payment worker routes before accessing the database', async () => {
  vi.stubEnv('CRON_SECRET', 'DISABLED_ADMIN_SEO_REHEARSAL');
  for (const path of ['../app/api/cron/payment-effects/route', '../app/api/cron/payment-effects-retry/route']) {
    const { GET } = await import(path);
    expect((await GET(new NextRequest('http://localhost/api/cron/test', { headers: { authorization: 'Bearer DISABLED_ADMIN_SEO_REHEARSAL' } }))).status).toBe(503);
  }
  expect(calls.service).not.toHaveBeenCalled();
});
it('blocks Mercado Pago before body parsing, database secrets or business processing', async () => {
  vi.stubEnv('MERCADOPAGO_WEBHOOK_SECRET', 'DISABLED_ADMIN_SEO_REHEARSAL');
  const { POST } = await import('../app/api/webhooks/mercadopago/route');
  const request = new NextRequest('http://localhost/api/webhooks/mercadopago', { method: 'POST', body: 'invalid-json' });
  const read = vi.spyOn(request, 'text');
  expect((await POST(request)).status).toBe(503);
  expect(read).not.toHaveBeenCalled(); expect(calls.service).not.toHaveBeenCalled(); expect(calls.log).not.toHaveBeenCalled();
});
