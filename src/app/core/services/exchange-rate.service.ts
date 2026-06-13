import { Injectable, Signal, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExchangeRateResponse } from '../models/exchange-rate.model';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private http = inject(HttpClient);

  private static readonly CACHE_TTL = environment.cacheTimeMs; // 1 hora
  private static readonly API_BASE = environment.exchangeRateApiUrl;
  private static readonly API_KEY = environment.exchangeRateApiKey;
  private readonly cacheService = inject(CacheService);

  private readonly _error = signal<string | null>(null);
  readonly error: Signal<string | null> = this._error.asReadonly();

  getRates(baseCurrency: string): Observable<ExchangeRateResponse> {
    const upperBase = baseCurrency.toUpperCase();
    const cacheKey = `exchange_rates_${upperBase}`;
    const url = `${ExchangeRateService.API_BASE}/${ExchangeRateService.API_KEY}/latest/${upperBase}`;

    return this.cacheService
      .get(
        cacheKey,
        this.http.get<ExchangeRateResponse>(url),
        ExchangeRateService.CACHE_TTL,
      )
      .pipe(
        catchError((err) => {
          this._error.set(err.message ?? 'Failed to fetch exchange rates');
          return throwError(() => err);
        }),
      );
  }

  getRate(base: string, target: string): Observable<number | null> {
    return new Observable((observer) => {
      this.getRates(base).subscribe({
        next: (data) => {
          const rate = data.conversion_rates[target] ?? null;
          observer.next(rate);
          observer.complete();
        },
        error: () => {
          observer.next(null);
          observer.complete();
        },
      });
    });
  }
}
