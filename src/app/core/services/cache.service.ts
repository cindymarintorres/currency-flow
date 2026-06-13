import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private static readonly DEFAULT_TTL_SECONDS = 3600;

  // Map interno — tipado como unknown, se castea en get()
  private readonly store = new Map<string, CacheEntry<unknown>>();

  get<T>(
    key: string,
    source$: Observable<T>,
    ttlSeconds = CacheService.DEFAULT_TTL_SECONDS
  ): Observable<T> {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;

    if (entry && Date.now() < entry.expiresAt) {
      return of(entry.value);
    }

    return source$.pipe(
      tap(value => this.set(key, value, ttlSeconds))
    );
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  private set<T>(key: string, value: T, ttlSeconds: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1_000,
    });
  }
}