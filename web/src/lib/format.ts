/**
 * The realm runs on dracmas, not euros. The symbol is U+20AF (drachma sign),
 * which is far better supported than the medieval drachma glyph (U+26C3).
 */
export const CURRENCY = {
  symbol: '₯',
  code: 'DRC',
} as const;

export function formatMoney(value: string | number, locale: string): string {
  const amount = typeof value === 'string' ? Number(value) : value;

  const formatted = new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `${formatted}\u00A0${CURRENCY.symbol}`;
}

export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB').format(value);
}
