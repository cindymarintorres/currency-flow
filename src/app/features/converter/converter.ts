import { Component, inject, signal, computed, effect, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';

import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { HistoryService } from '../../core/services/history.service';
//import { FavoritesService } from '../../core/services/favorites.service';
import { Currency } from '../../core/models/currency.model';
import { CURRENCIES } from '../../core/data/currencies.data';
import { DecimalPipe } from '@angular/common';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    InputNumberModule,
    ButtonModule,
    SkeletonModule,
    ToastModule,
    CurrencyFormatPipe,
    TimeAgoPipe,
  ],
  providers: [MessageService],
  templateUrl: './converter.html',
  styleUrl: './converter.scss',
})
export class ConverterComponent implements OnInit {
  private historyService = inject(HistoryService);
  private exchangeRateService = inject(ExchangeRateService);
  private messageService = inject(MessageService);

  currencies: Currency[] = CURRENCIES;

  // Controles tipados — sin FormBuilder, sin $any()
  fromCurrency = new FormControl<string>('USD', {
    nonNullable: true,
    validators: [Validators.required],
  });
  toCurrency = new FormControl<string>('EUR', {
    nonNullable: true,
    validators: [Validators.required],
  });
  amount = new FormControl<number>(1000, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(0.01)],
  });

  form = new FormGroup({
    fromCurrency: this.fromCurrency,
    toCurrency: this.toCurrency,
    amount: this.amount,
  });

  // Signals
  convertedResult = signal<number | null>(null);
  currentRate = signal<number | null>(null);
  lastUpdated = signal<number | null>(null);

  isLoading = this.exchangeRateService.isLoading;
  errorMsg = this.exchangeRateService.error;

  rateLabel = computed(() => {
    const rate = this.currentRate();
    if (!rate) return '';
    return `1 ${this.fromCurrency.value} = ${rate.toFixed(4)} ${this.toCurrency.value}`;
  });

  ngOnInit(): void {
    this.convert();
  }

  convert(): void {
    if (this.form.invalid) return;

    const from = this.fromCurrency.value;
    const to = this.toCurrency.value;
    const amount = this.amount.value;

    this.exchangeRateService.getRates(from).subscribe({
      next: (data) => {
        const rate = data.conversion_rates[to];
        if (rate) {
          this.currentRate.set(rate);
          this.convertedResult.set(amount * rate);
          this.lastUpdated.set(data.time_last_update_unix * 1000);
        }
      },
    });
  }

  swap(): void {
    const from = this.fromCurrency.value;
    const to = this.toCurrency.value;
    this.fromCurrency.setValue(to);
    this.toCurrency.setValue(from);
    this.convert();
  }

  // Actualiza saveToHistory():
  saveToHistory(): void {
    if (!this.convertedResult() || !this.currentRate()) return;

    this.historyService.add({
      fromCurrency: this.fromCurrency.value,
      toCurrency: this.toCurrency.value,
      amount: this.amount.value,
      result: this.convertedResult()!,
      rate: this.currentRate()!,
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Guardado',
      detail: 'Conversión añadida al historial',
    });
  }

  getCurrencySymbol(code: string): string {
    return this.currencies.find((c) => c.code === code)?.symbol ?? code;
  }

  getCurrencyFlag(code: string): string {
    return this.currencies.find((c) => c.code === code)?.flag ?? '🏳️';
  }
}
