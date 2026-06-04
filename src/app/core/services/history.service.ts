import { Injectable, signal, effect } from '@angular/core';
import { ConversionRecord } from '../models/conversion.model';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly STORAGE_KEY = 'cf_history';

  private _history = signal<ConversionRecord[]>(this.loadFromStorage());

  // Solo lectura hacia afuera
  readonly history = this._history.asReadonly();

  constructor() {
    // Cada vez que cambia el historial, persiste en localStorage
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._history()));
    });
  }

  add(record: Omit<ConversionRecord, 'id' | 'timestamp'>): void {
    const newRecord: ConversionRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    this._history.update(current => [newRecord, ...current]);
  }

  remove(id: string): void {
    this._history.update(current => current.filter(r => r.id !== id));
  }

  clear(): void {
    this._history.set([]);
  }

  private loadFromStorage(): ConversionRecord[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}