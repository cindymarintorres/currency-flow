import { Currency } from '../models/currency.model';

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar',       symbol: '$',  flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro',            symbol: '€',  flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound',   symbol: '£',  flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen',    symbol: '¥',  flag: '🇯🇵' },
  { code: 'COP', name: 'Colombian Peso',  symbol: '$',  flag: '🇨🇴' },
  { code: 'MXN', name: 'Mexican Peso',    symbol: '$',  flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real',  symbol: 'R$', flag: '🇧🇷' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$',  flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc',     symbol: 'Fr', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan',    symbol: '¥',  flag: '🇨🇳' },
  { code: 'ARS', name: 'Argentine Peso',  symbol: '$',  flag: '🇦🇷' },
];