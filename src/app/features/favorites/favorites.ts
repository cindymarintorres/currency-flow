import { Component, Signal, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { SUPPORTED_CURRENCIES } from '../../core/constants/currencies';
import { FavoritePair } from '../../core/models/favorite-pair.model';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { CurrencyOption } from '../../core/models/currency.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    ProgressSpinnerModule,
    SelectModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  private readonly favoritesService = inject(FavoritesService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  // ── Dialog form controls ────────────────────────────────────────────────
  // Typed + nullable: el usuario puede no haber seleccionado nada aún
  readonly baseControl = new FormControl<string | null>(null);
  readonly targetControl = new FormControl<string | null>(null);

  // toSignal: bridge RxJS → Signal para usar el valor en computed()
  // Patrón clave: valueChanges es un Observable; toSignal lo vuelve reactivo
  readonly selectedBaseSignal: Signal<string | null> = toSignal(this.baseControl.valueChanges, {
    initialValue: null,
  });

  // ── Internal writable state ─────────────────────────────────────────────
  private readonly _rates = signal<Map<string, number | null>>(new Map());
  private readonly _loading = signal<boolean>(false);
  private readonly _dialogVisible = signal<boolean>(false);

  // ── Public readonly state (consumido por el template) ───────────────────
  readonly favorites: Signal<FavoritePair[]> = this.favoritesService.favorites;
  readonly rates: Signal<Map<string, number | null>> = this._rates.asReadonly();
  readonly loading: Signal<boolean> = this._loading.asReadonly();
  readonly dialogVisible: Signal<boolean> = this._dialogVisible.asReadonly();
  readonly isEmpty = computed(() => this.favorites().length === 0);

  readonly allCurrencyOptions = computed<CurrencyOption[]>(() =>
    SUPPORTED_CURRENCIES.map((c) => ({ label: c, value: c })),
  );

  // El segundo select filtra la base ya elegida: computed reacciona a selectedBaseSignal
  readonly targetCurrencyOptions = computed<CurrencyOption[]>(() => {
    const base = this.selectedBaseSignal();
    return SUPPORTED_CURRENCIES.filter((c) => c !== base).map((c) => ({ label: c, value: c }));
  });

  constructor() {
    // effect() + untracked(): el único read trackeado es favorites().
    // La mutación (_rates, _loading) ocurre dentro de untracked para
    // no crear una dependencia circular.
    effect(() => {
      const pairs = this.favorites();
      untracked(() => this.loadRatesForPairs(pairs));
    });
  }

  // ── Template handlers ───────────────────────────────────────────────────

  openAddDialog(): void {
    this.baseControl.setValue(null);
    this.targetControl.setValue(null);
    this._dialogVisible.set(true);
  }

  closeDialog(): void {
    this._dialogVisible.set(false);
  }

  // p-dialog emite visibleChange cuando el usuario cierra con la X o clic fuera
  onDialogVisibleChange(visible: boolean): void {
    if (!visible) this._dialogVisible.set(false);
  }

  confirmAdd(): void {
    const base = this.baseControl.value;
    const target = this.targetControl.value;

    if (!base || !target) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Selecciona ambas divisas',
      });
      return;
    }
    if (this.favoritesService.isFavorite(base, target)) {
      this.messageService.add({
        severity: 'info',
        summary: 'Ya existe',
        detail: `El par ${base} → ${target} ya está en favoritos`,
      });
      return;
    }

    this.favoritesService.add(base, target);
    this.messageService.add({
      severity: 'success',
      summary: 'Agregado',
      detail: `${base} → ${target} guardado`,
    });
    this.closeDialog();
  }

  removeFavorite(pair: FavoritePair): void {
    this.favoritesService.remove(pair.base, pair.target);
    this.messageService.add({
      severity: 'info',
      summary: 'Eliminado',
      detail: `${pair.base} → ${pair.target} eliminado`,
    });
  }

  navigateToConverter(pair: FavoritePair): void {
    this.router.navigate(['/converter'], {
      queryParams: { from: pair.base, to: pair.target },
    });
  }

  getRate(base: string, target: string): number | null {
    return this._rates().get(`${base}-${target}`) ?? null;
  }

  formatRate(rate: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    }).format(rate);
  }

  //Una llamada por base única
  private async loadRatesForPairs(pairs: FavoritePair[]): Promise<void> {
    if (pairs.length === 0) {
      this._rates.set(new Map());
      return;
    }

    this._loading.set(true);

    try {
      // Agrupa los targets por base: { USD: ['EUR', 'GBP'], EUR: ['JPY'] }
      const byBase = pairs.reduce<Record<string, string[]>>((acc, { base, target }) => {
        (acc[base] ??= []).push(target);
        return acc;
      }, {});

      // Una sola llamada por base única → ExchangeRateService cachea el resultado
      const allEntries = await Promise.all(
        Object.entries(byBase).map(async ([base, targets]) => {
          const response = await firstValueFrom(this.exchangeRateService.getRates(base));
          return targets.map(
            (target) =>
              [`${base}-${target}`, response.conversion_rates[target] ?? null] as [
                string,
                number | null,
              ],
          );
        }),
      );

      this._rates.set(new Map(allEntries.flat()));
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar las tasas de cambio',
      });
    } finally {
      this._loading.set(false);
    }
  }
}
