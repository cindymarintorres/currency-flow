export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string; // emoji flag
}

export interface CurrencyPair {
  from: string;
  to: string;
}