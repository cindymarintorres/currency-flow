export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string; // emoji flag
  tag?: string; // 'REFERENCE CURRENCY', 'POPULAR CHOICE', etc.
  rate?: number | null;  // null = USD base (es la referencia)
}

export interface CurrencyPair {
  from: string;
  to: string;
}

export interface CurrencyOption {
  label: string;
  value: string;
}
