import { afterEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ send: vi.fn(), usage: vi.fn() }));
vi.mock('./client', () => ({ sendEmail: mocks.send, SUPPORT_ADMIN_EMAIL: 'fixture@example.invalid', emailConfig: {} }));
vi.mock('./template-loader', () => ({
  loadEmailTemplate: async () => ({ id: 'fixture', subject: 'Fixture', content: '<p>{{delivery_date}}</p>' }),
  incrementTemplateUsage: mocks.usage,
}));
vi.mock('../mercadopago', () => ({ ARGENTINA_PAYMENT_LABELS: {} }));
vi.mock('@/utils/supabase/server', () => ({ createServiceRoleClient: vi.fn() }));
afterEach(() => { vi.useRealTimers(); vi.clearAllMocks(); });
it('renders Argentina date into HTML and text without a real send', async () => {
  mocks.send.mockResolvedValue({ success: true });
  const { EmailNotificationService } = await import('./notifications');
  const order = { order_number: 'FIXTURE', email: 'fixture@example.invalid', delivered_at: '2026-10-14T02:23:00Z' };
  expect(await EmailNotificationService.sendDeliveryConfirmation(order as never)).toEqual({ success: true });
  expect(mocks.send).toHaveBeenCalledOnce();
  expect(mocks.send).toHaveBeenCalledWith(expect.objectContaining({
    html: '<p>13 de octubre de 2026</p>', text: '13 de octubre de 2026',
  }));
  expect(order.delivered_at).toBe('2026-10-14T02:23:00Z');
});
