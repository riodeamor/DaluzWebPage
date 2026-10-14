export function formatDeliveryDate(deliveredAt?: string | null): string {
  return new Date(deliveredAt || Date.now()).toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Cordoba',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
