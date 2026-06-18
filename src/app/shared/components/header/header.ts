import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../core/services/auth.service';
import { NavigationOverlayService } from '../../../core/services/navigation-overlay.service';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, AvatarModule, MenubarModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly auth = inject(AuthService);
  protected readonly router = inject(Router);
  private readonly overlay = inject(NavigationOverlayService);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url.split('?')[0]),
      startWith(this.router.url.split('?')[0]),
    ),
    { initialValue: this.router.url.split('?')[0] },
  );

  protected readonly menuItems = computed<MenuItem[]>(() => {
    const url = this.currentUrl();
    const loggedIn = this.auth.isLoggedIn();

    const links = [
      { label: 'Converter', path: '/converter', requiresAuth: false },
      { label: 'History', path: '/history', requiresAuth: true },
      { label: 'Favorites', path: '/favorites', requiresAuth: true },
      { label: 'Search', path: '/search', requiresAuth: true },
    ] as const;

    return links
      .filter((link) => !link.requiresAuth || loggedIn)
      .map((link) => ({
        label: link.label,
        linkClass: url === link.path ? 'nav-item-active' : '',
        command: () => this.navigateTo(link.path),
      }));
  });

  protected navigateTo(path: string): void {
    this.overlay.show();
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 800));
    const navigation = this.router.navigate([path]);
    Promise.all([minDelay, navigation]).then(() => this.overlay.hide());
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/converter']);
  }
}
