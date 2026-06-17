import { Injectable } from '@angular/core';
import { ConversionRecord } from '../models/conversion.model';
import { persistedSignal } from '../utils/persisted-signal';

@Injectable({ providedIn: 'root' })
export class HistoryService {

  private readonly _history = persistedSignal<ConversionRecord[]>('cf_history', []);
  readonly history = this._history.asReadonly();

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
