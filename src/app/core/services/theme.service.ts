import { Injectable, computed, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { persistedSignal } from '../utils/persisted-signal';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly _theme = persistedSignal<Theme>('cf_theme', 'light');

  readonly theme  = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    effect(() => {
      this.doc.documentElement.classList.toggle('dark-mode', this.isDark());
    });
  }

  toggle(): void {
    this._theme.update(t => (t === 'light' ? 'dark' : 'light'));
  }
}