import { inject, Injectable } from '@angular/core';
import { ConversionRecord } from '../models/conversion.model';
import { persistedSignal } from '../utils/persisted-signal';
import { AuthService } from './auth.service';
import { filter, pairwise } from 'rxjs';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class HistoryService {

  private static readonly STORAGE_KEY = 'cf_history';
  private readonly auth = inject(AuthService);
  private readonly _history = persistedSignal<ConversionRecord[]>(HistoryService.STORAGE_KEY, []);
  readonly history = this._history.asReadonly();

  constructor() {
    toObservable(this.auth.isLoggedIn).pipe(
      pairwise(),
      filter(([prev, curr]) => prev === true && curr === false),
      takeUntilDestroyed(),
    ).subscribe(() => this.clear());
  }

  add(record: Omit<ConversionRecord, 'id' | 'timestamp'>): void {
    const newRecord: ConversionRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    this._history.update((current) => [newRecord, ...current]);
  }

  remove(id: string): void {
    this._history.update((current) => current.filter((r) => r.id !== id));
  }

  clear(): void {
    this._history.set([]);
  }

}
