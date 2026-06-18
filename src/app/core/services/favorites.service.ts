import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { FavoritePair } from '../models/favorite-pair.model';
import { persistedSignal } from '../utils/persisted-signal';
import { AuthService } from './auth.service';
import { filter, pairwise } from 'rxjs';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private static readonly STORAGE_KEY = 'cf_favorites';
  private readonly auth = inject(AuthService);
  private readonly _favorites = persistedSignal<FavoritePair[]>(FavoritesService.STORAGE_KEY, []);
  readonly favorites = this._favorites.asReadonly();
  readonly count: Signal<number> = computed(() => this._favorites().length);

  constructor() {
    toObservable(this.auth.isLoggedIn)
      .pipe(
        pairwise(),
        filter(([prev, curr]) => prev === true && curr === false),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.clear());
  }

  isFavorite(base: string, target: string): boolean {
    return this._favorites().some((f) => f.base === base && f.target === target);
  }

  add(base: string, target: string): void {
    if (this.isFavorite(base, target)) return;
    const updated = [...this._favorites(), { base, target }];
    this._favorites.set(updated);
  }

  remove(base: string, target: string): void {
    const updated = this._favorites().filter((f) => !(f.base === base && f.target === target));
    this._favorites.set(updated);
  }

  toggle(base: string, target: string): void {
    this.isFavorite(base, target) ? this.remove(base, target) : this.add(base, target);
  }

  clear(): void {
    this._favorites.set([]);
  }
}
