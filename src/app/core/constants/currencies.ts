export const SUPPORTED_CURRENCIES = [
  'AED', 'ARS', 'AUD', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'COP',
  'CZK', 'DKK', 'EGP', 'EUR', 'GBP', 'HKD', 'HUF', 'IDR', 'ILS',
  'INR', 'JPY', 'KRW', 'MXN', 'MYR', 'NOK', 'NZD', 'PHP', 'PLN',
  'RON', 'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'UAH',
  'USD', 'VND', 'ZAR',
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];