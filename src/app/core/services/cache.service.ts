import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private static readonly CACHE_TTL = environment.cacheTimeMs; // 1 hora

  // Map interno — tipado como unknown, se castea en get()
  private readonly store = new Map<string, CacheEntry<unknown>>();

  get<T>(
    key: string,
    source$: Observable<T>,
    ttlMs = CacheService.CACHE_TTL
  ): Observable<T> {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;

    if (entry && Date.now() < entry.expiresAt) {
      return of(entry.value);
    }

    return source$.pipe(
      tap(value => this.set(key, value, ttlMs))
    );
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  private set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }
}