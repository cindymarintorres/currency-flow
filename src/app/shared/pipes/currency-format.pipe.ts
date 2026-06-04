import { Pipe, PipeTransform, inject, LOCALE_ID } from '@angular/core';
import { formatCurrency } from '@angular/common';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  private locale = inject(LOCALE_ID);

  transform(
    value: number | null,
    currencyCode: string = 'USD',
  ): string {
    if (value === null || value === undefined) return '—';

    try {
      // Intl.NumberFormat es nativo del browser, sin deprecaciones
      return new Intl.NumberFormat(this.locale, {
        style:                 'currency',
        currency:              currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${value.toFixed(2)} ${currencyCode}`;
    }
  }
}