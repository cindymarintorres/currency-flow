import { Injectable, inject, signal } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, pairwise } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ConverterStateService {
  private static readonly DEFAULT_FROM = 'USD';
  private static readonly DEFAULT_TO = 'EUR';
  private static readonly DEFAULT_AMOUNT = 1000;

  readonly fromCurrency = signal<string>(ConverterStateService.DEFAULT_FROM);
  readonly toCurrency = signal<string>(ConverterStateService.DEFAULT_TO);
  readonly amount = signal<number>(ConverterStateService.DEFAULT_AMOUNT);

  constructor() {
    const auth = inject(AuthService);

    // Mismo patrón que FavoritesService: solo reacciona a la transición true → false
    toObservable(auth.isLoggedIn)
      .pipe(
        pairwise(),
        filter(([prev, curr]) => prev === true && curr === false),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.reset());
  }

  save(from: string, to: string, amount: number): void {
    this.fromCurrency.set(from);
    this.toCurrency.set(to);
    this.amount.set(amount);
  }

  reset(): void {
    this.fromCurrency.set(ConverterStateService.DEFAULT_FROM);
    this.toCurrency.set(ConverterStateService.DEFAULT_TO);
    this.amount.set(ConverterStateService.DEFAULT_AMOUNT);
  }
}