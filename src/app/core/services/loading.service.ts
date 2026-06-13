import { Injectable, Signal, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly _count = signal(0);

  readonly isLoading: Signal<boolean> = computed(() => this._count() > 0);

  increment(): void {
    this._count.update(count => count + 1);
  }

  decrement(): void {
    this._count.update(count => Math.max(0, count - 1));
  }
}