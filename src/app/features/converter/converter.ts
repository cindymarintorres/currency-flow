import { Component, inject, signal, computed, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { LoadingService } from '../../core/services/loading.service';
import { ConverterStateService } from '../../core/services/converter-state.service';
import { AuthService } from '../../core/services/auth.service';
import { merge } from 'rxjs';

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
})
export class Converter implements OnInit {
  protected readonly auth = inject(AuthService);
  private historyService = inject(HistoryService);
  private exchangeRateService = inject(ExchangeRateService);
  private messageService = inject(MessageService);
  private readonly loadingService = inject(LoadingService);
  private readonly converterState = inject(ConverterStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetector = inject(ChangeDetectorRef);
  readonly loggedIn = this.auth.isLoggedIn();
  currencies: Currency[] = CURRENCIES;

  // Controles tipados — sin FormBuilder, sin $any()
  fromCurrency = new FormControl<string>(this.converterState.fromCurrency(), {
    nonNullable: true,
    validators: [Validators.required],
  });
  toCurrency = new FormControl<string>(this.converterState.toCurrency(), {
    nonNullable: true,
    validators: [Validators.required],
  });
  amount = new FormControl<number>(this.converterState.amount(), {
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
  marketChange = signal<number>(0.14); // ← mock, luego viene de la API
  readonly isLoading = this.loadingService.isLoading; // ya es Signal<boolean>
  errorMsg = this.exchangeRateService.error;

  rateLabel = computed(() => {
    const rate = this.currentRate();
    if (!rate) return '';
    return `1 ${this.fromCurrency.value} = ${rate.toFixed(4)} ${this.toCurrency.value}`;
  });

  //Saber si el par de conversiones ya ha sido guardado previamente para ver en History
  readonly alreadySaved = computed(() => {
    const result = this.convertedResult();
    const rate = this.currentRate();
    if (!result || !rate) return false;

    return this.historyService
      .history()
      .some(
        (h) =>
          h.fromCurrency === this.fromCurrency.value &&
          h.toCurrency === this.toCurrency.value &&
          h.amount === this.amount.value &&
          h.result === result,
      );
  });

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const from = params.get('from');
    const to = params.get('to');

    if (from) this.fromCurrency.setValue(from);
    if (to) this.toCurrency.setValue(to);
    // Fuerza re-render en zoneless: p-select no reacciona a setValue sin esto
    if (from || to) this.changeDetector.detectChanges();

    // Cambio de monto → solo marca que no está guardado aún
    this.amount.valueChanges.subscribe((amount) => {
      this.converterState.save(this.fromCurrency.value, this.toCurrency.value, amount);
    });

    this.convert();
  }

  onCurrencyChange(): void {
    this.convertedResult.set(null);
    this.currentRate.set(null);
    this.converterState.save(this.fromCurrency.value, this.toCurrency.value, this.amount.value);
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
