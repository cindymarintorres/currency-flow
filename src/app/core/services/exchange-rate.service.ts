import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExchangeRateResponse, CacheEntry } from '../models/exchange-rate.model';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private http = inject(HttpClient);

  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = environment.cacheTimeMs; // 1 hora

  isLoading = signal(false);
  error = signal<string | null>(null);

  getRates(baseCurrency: string): Observable<ExchangeRateResponse> {
    const cached = this.cache.get(baseCurrency);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.CACHE_TTL) {
      return of(cached.data);
    }

    const url = `${environment.exchangeRateApiUrl}/${environment.exchangeRateApiKey}/latest/${baseCurrency}`;

    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<ExchangeRateResponse>(url).pipe(
      tap({
        next: (data) => {
          this.cache.set(baseCurrency, { data, timestamp: now });
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('No se pudo obtener el tipo de cambio.');
          this.isLoading.set(false);
        }
      })
    );
  }

  getRate(base: string, target: string): Observable<number | null> {
    return new Observable(observer => {
      this.getRates(base).subscribe({
        next: (data) => {
          const rate = data.conversion_rates[target] ?? null;
          observer.next(rate);
          observer.complete();
        },
        error: () => {
          observer.next(null);
          observer.complete();
        }
      });
    });
  }

  clearCache(): void {
    this.cache.clear();
  }
}