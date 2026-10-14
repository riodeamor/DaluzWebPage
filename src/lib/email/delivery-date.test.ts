import { afterEach, expect, it, vi } from 'vitest';
import { formatDeliveryDate } from './delivery-date';
afterEach(() => vi.useRealTimers());
it.each([
  ['2026-10-14T02:23:00.000Z', '13 de octubre de 2026'],
  ['2026-10-14T02:59:59.999Z', '13 de octubre de 2026'],
  ['2026-10-14T03:00:00.000Z', '14 de octubre de 2026'],
  ['2027-01-01T02:59:59.999Z', '31 de diciembre de 2026'],
  ['2026-10-13T23:59:59-03:00', '13 de octubre de 2026'],
])('formats %s using the Argentina calendar', (timestamp, expected) => {
  expect(formatDeliveryDate(timestamp)).toBe(expected);
});
it('uses Argentina time for the fallback and does not replace a stored delivery date', () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-14T02:59:59.999Z'));
  expect(formatDeliveryDate()).toBe('13 de octubre de 2026');
  expect(formatDeliveryDate('2026-10-12T12:00:00Z')).toBe('12 de octubre de 2026');
  vi.setSystemTime(new Date('2026-10-14T03:00:00Z'));
  expect(formatDeliveryDate(null)).toBe('14 de octubre de 2026');
});
