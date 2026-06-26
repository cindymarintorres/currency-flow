import { Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { CURRENCIES } from '../../core/data/currencies.data';
import { Currency } from '../../core/models/currency.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SkeletonModule,
    TagModule,
    DecimalPipe
  ],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search {
  private readonly router           = inject(Router);
  private readonly exchangeRateService = inject(ExchangeRateService);

  protected readonly searchControl = new FormControl<string>('', { nonNullable: true });

  // Bridge RxJS → Signal con el query (inicia vacío)
  protected readonly query = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
    ),
    { initialValue: '' },
  );

  // Rates cacheadas (base USD). undefined = todavía cargando
  private readonly rates = toSignal(
    this.exchangeRateService.getRates('USD'),
  );

  protected readonly isLoading = computed(() => this.rates() === undefined);

  protected readonly results = computed<Currency[]>(() => {
    const query        = this.query().toLowerCase().trim();
    const ratesMap = this.rates()?.conversion_rates;

    return CURRENCIES
      .filter(currency =>
        currency.code.toLowerCase().includes(query) ||
        currency.name.toLowerCase().includes(query),
      )
      .map(currency => ({
        ...currency,  // ← incluye symbol y todos los campos obligatorios
        rate: currency.code === 'USD' ? null : (ratesMap?.[currency.code] ?? null),
      }));
  });

  protected selectCurrency(code: string): void {
    this.router.navigate(['/converter'], { queryParams: { to: code } });
  }
}