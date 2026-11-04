export function formatCurrency(value: string | number, locale: string): string {
  const amount = typeof value === 'string' ? Number(value) : value;

  return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB').format(value);
}
