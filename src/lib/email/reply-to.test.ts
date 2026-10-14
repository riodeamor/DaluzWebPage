import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mail = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('resend', () => ({ Resend: class { emails = { send: mail.send }; } }));
beforeEach(() => {
  vi.resetModules();
  mail.send.mockReset().mockResolvedValue({ data: { id: 'fixture-mail' }, error: null });
  vi.stubEnv('RESEND_API_KEY', 'fixture-key');
  vi.stubEnv('RESEND_FROM_EMAIL', 'noreply@daluzconsciente.com');
  vi.stubEnv('SUPPORT_ADMIN_EMAIL', 'daluzalkimya@gmail.com');
  vi.stubEnv('RESEND_REPLY_TO_EMAIL', '');
});
afterEach(() => vi.unstubAllEnvs());

it('uses the WNPower mailbox by default and preserves the sender', async () => {
  const { sendEmail } = await import('./client');
  await sendEmail({ to: 'fixture@example.com', subject: 'Fixture', html: '<p>Fixture</p>' });
  expect(mail.send).toHaveBeenCalledWith(expect.objectContaining({
    from: 'noreply@daluzconsciente.com', reply_to: 'alkimya@daluzconsciente.com',
  }));
});

it('supports a configured reply address', async () => {
  vi.stubEnv('RESEND_REPLY_TO_EMAIL', '  configured@example.com  ');
  const { emailConfig } = await import('./client');
  expect(emailConfig.replyTo).toBe('configured@example.com');
});

it('preserves explicit reply addresses on previously prepared messages', async () => {
  const { sendEmail } = await import('./client');
  await sendEmail({ to: 'fixture@example.com', subject: 'Prepared', html: '<p>Original</p>', replyTo: 'old@example.com' });
  expect(mail.send).toHaveBeenCalledWith(expect.objectContaining({ reply_to: 'old@example.com' }));
});

const ticket = { id: 'fixture', ticket_number: 'TEST-1', subject: 'Fixture', description: 'Fixture', status: 'open', priority: 'normal', customer_name: 'Fixture', customer_email: 'fixture@example.com' };

it('routes all new customer support replies to the configured mailbox', async () => {
  vi.stubEnv('RESEND_REPLY_TO_EMAIL', 'configured@example.com');
  const support = await import('./templates/support');
  await support.sendTicketCreatedEmail(ticket);
  await support.sendNewResponseEmail(ticket, { message: 'Fixture', created_at: '2026-10-13T12:00:00Z', is_from_customer: false });
  await support.sendStatusChangeEmail(ticket, 'open', 'closed');
  expect(mail.send).toHaveBeenCalledTimes(3);
  for (const [message] of mail.send.mock.calls) {
    expect(message).toMatchObject({ to: ticket.customer_email, reply_to: 'configured@example.com' });
  }
});

it('keeps Gmail as the admin recipient and the customer as its reply address', async () => {
  const { sendAdminNewTicketNotification } = await import('./templates/support');
  await sendAdminNewTicketNotification(ticket);
  expect(mail.send).toHaveBeenCalledWith(expect.objectContaining({
    to: 'daluzalkimya@gmail.com', reply_to: ticket.customer_email,
  }));
});
