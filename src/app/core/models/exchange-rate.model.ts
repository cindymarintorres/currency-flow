export interface ExchangeRateResponse {
  result: string;
  base_code: string;
  conversion_rates: Record<string, number>;
  time_last_update_unix: number;
}

export interface CacheEntry {
  data: ExchangeRateResponse;
  timestamp: number;
}