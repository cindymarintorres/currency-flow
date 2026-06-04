import { Pipe, PipeTransform, NgZone, inject, OnDestroy } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false  // impure para que se actualice automáticamente
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private ngZone = inject(NgZone);
  private timer: ReturnType<typeof setTimeout> | null = null;

  transform(value: number | null): string {
    if (!value) return '—';

    this.removeTimer();

    const now     = Date.now();
    const seconds = Math.floor((now - value) / 1000);

    if (seconds < 60) {
      this.scheduleUpdate(1000);
      return 'justo ahora';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      this.scheduleUpdate(60_000);
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      this.scheduleUpdate(3_600_000);
      return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
    }

    const years = Math.floor(months / 12);
    return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
  }

  private scheduleUpdate(ms: number): void {
    this.ngZone.runOutsideAngular(() => {
      this.timer = setTimeout(() => {
        this.ngZone.run(() => {});
      }, ms);
    });
  }

  private removeTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  ngOnDestroy(): void {
    this.removeTimer();
  }
}