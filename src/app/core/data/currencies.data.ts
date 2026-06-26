import { Currency } from '../models/currency.model';

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', tag: 'REFERENCE CURRENCY' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', tag: 'POPULAR CHOICE' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', tag: 'POPULAR CHOICE' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴', tag: 'LATAM REGION' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', tag: 'LATAM REGION' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', tag: 'LATAM REGION' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', flag: '🇦🇷' },
];
