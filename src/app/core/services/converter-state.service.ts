import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConverterStateService {
  readonly fromCurrency = signal<string>('USD');
  readonly toCurrency = signal<string>('EUR');
  readonly amount = signal<number>(1000);

  save(from: string, to: string, amount: number): void {
    this.fromCurrency.set(from);
    this.toCurrency.set(to);
    this.amount.set(amount);
  }
}