import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavigationOverlayService {
  private readonly _isVisible = signal(false);
  readonly isVisible = this._isVisible.asReadonly();

  show(): void {
    this._isVisible.set(true);
  }

  hide(): void {
    this._isVisible.set(false);
  }

  async navigateWithOverlay(navigationFn: () => Promise<unknown>): Promise<void> {
    this.show();
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 800));
    await Promise.all([minDelay, navigationFn()]);
    this.hide();
  }
}
