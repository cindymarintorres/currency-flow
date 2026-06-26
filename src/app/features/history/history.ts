import { Component, inject, signal, computed, effect, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HistoryService } from '../../core/services/history.service';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { CURRENCIES } from '../../core/data/currencies.data';

// ── Helpers puros — sin dependencia de instancia ─────────────────────
function getCurrencyFlag(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.flag ?? '🏳️';
}

function clampPage(page: number, max: number): number {
  return Math.max(1, Math.min(page, max));
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    ToastModule,
    CurrencyFormatPipe,
    TimeAgoPipe,
  ],
  providers: [MessageService],
  templateUrl: './history.html'
})
export class History {
  // ── Dependencias ─────────────────────────────────────────────────────
  private readonly historyService = inject(HistoryService);
  private readonly messageService = inject(MessageService);

  // ── Constantes de clase ──────────────────────────────────────────────
  private static readonly PAGE_SIZE = 10;

  // ── Estado del componente ────────────────────────────────────────────
  readonly searchQuery = signal('');
  readonly filterCurrency = signal('ALL');
  readonly currentPage = signal(1);

  // ── Opciones estáticas (CURRENCIES no cambia en runtime) ─────────────
  readonly currencyOptions = [
    { label: 'All Currencies', value: 'ALL' },
    ...CURRENCIES.map((currency) => ({ label: `${currency.flag} ${currency.code}`, value: currency.code })),
  ];

  // ── Computed: derivados del estado ───────────────────────────────────
  readonly filteredHistory = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const currency = this.filterCurrency();
    const history = this.historyService.history();

    return history.filter((record) => {
      const matchesSearch =
        !query ||
        record.fromCurrency.toLowerCase().includes(query) ||
        record.toCurrency.toLowerCase().includes(query) ||
        record.id.toLowerCase().includes(query);

      const matchesCurrency =
        currency === 'ALL' || record.fromCurrency === currency || record.toCurrency === currency;

      return matchesSearch && matchesCurrency;
    });
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.filteredHistory().length / History.PAGE_SIZE),
  );

  readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  readonly paginatedHistory = computed(() => {
    const safePage = clampPage(this.currentPage(), this.totalPages() || 1);
    const start = (safePage - 1) * History.PAGE_SIZE;
    return this.filteredHistory().slice(start, start + History.PAGE_SIZE);
  });

  readonly hasHistory = computed(() => this.historyService.history().length > 0);
  readonly totalCount = computed(() => this.filteredHistory().length);
  readonly visibleCount = computed(() => this.paginatedHistory().length);

  // ── Efectos reactivos ────────────────────────────────────────────────
  constructor() {
    // Resetear página al cambiar cualquier filtro (SRP: efecto aislado)
    effect(() => {
      this.searchQuery();
      this.filterCurrency();
      untracked(() => this.currentPage.set(1));
    });
  }

  // ── Acciones públicas ────────────────────────────────────────────────
  clearFilters(): void {
    this.searchQuery.set('');
    this.filterCurrency.set('ALL');
    this.currentPage.set(1);
  }

  remove(id: string): void {
    this.historyService.remove(id);
    this.adjustPageAfterRemoval();
    this.messageService.add({
      severity: 'info',
      summary: 'Eliminado',
      detail: 'Conversión eliminada',
    });
  }

  clearAll(): void {
    this.historyService.clear();
    this.currentPage.set(1);
    this.messageService.add({
      severity: 'warn',
      summary: 'Historial borrado',
      detail: 'Se eliminaron todas las conversiones',
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(clampPage(page, this.totalPages()));
  }

  // Expone el helper puro al template
  readonly getCurrencyFlag = getCurrencyFlag;

  rowIndex(index: number): number {
    return (this.currentPage() - 1) * History.PAGE_SIZE + index + 1;
  }

  // ── Helpers privados ─────────────────────────────────────────────────
  private adjustPageAfterRemoval(): void {
    const remainingItems = this.filteredHistory().length - 1;
    const maxPage = Math.ceil(remainingItems / History.PAGE_SIZE) || 1;

    if (this.currentPage() > maxPage) {
      this.currentPage.set(maxPage);
    }
  }
}
