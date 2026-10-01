import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
const mocks = vi.hoisted(() => ({ service: vi.fn(), mail: vi.fn(), from: vi.fn(), maybe: vi.fn() }));
vi.mock('@/lib/auth/helpers', () => ({ getServiceClient: mocks.service }));
vi.mock('@/lib/email/notifications', () => ({ EmailNotificationService: { sendBankTransferExpired: mocks.mail } }));
import { GET } from './route';
beforeEach(() => {
  vi.clearAllMocks(); vi.stubEnv('CRON_SECRET','test');
  mocks.service.mockReturnValue({ from: mocks.from });
  const read = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), lt: vi.fn().mockResolvedValue({ data: [{ id:'order', order_number:'DL-test' }], error:null }) };
  const write = { update: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), lt: vi.fn().mockReturnThis(), select: vi.fn().mockReturnThis(), maybeSingle: mocks.maybe };
  mocks.from.mockReturnValueOnce(read).mockReturnValue(write);
});
describe('vencimiento de transferencias', () => {
  it('no envía cancelación si otra operación ya procesó el pedido', async () => {
    mocks.maybe.mockResolvedValue({ data:null, error:null });
    const response = await GET(new NextRequest('http://localhost/api/cron/expire-transfers',{headers:{authorization:'Bearer test'}}));
    expect((await response.json()).cancelled).toBe(0); expect(mocks.mail).not.toHaveBeenCalled();
  });
  it('notifica únicamente un pedido efectivamente cancelado', async () => {
    mocks.maybe.mockResolvedValue({ data:{id:'order'},error:null });
    const response = await GET(new NextRequest('http://localhost/api/cron/expire-transfers',{headers:{authorization:'Bearer test'}}));
    expect((await response.json()).cancelled).toBe(1); expect(mocks.mail).toHaveBeenCalledTimes(1);
  });
  it('rechaza accesos sin autorización antes de consultar pedidos', async () => {
    expect((await GET(new NextRequest('http://localhost/api/cron/expire-transfers'))).status).toBe(401);
    expect(mocks.service).not.toHaveBeenCalled();
  });
});
