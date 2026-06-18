import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../core/services/auth.service';
import { NavigationOverlayService } from '../../../core/services/navigation-overlay.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule, AvatarModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly auth = inject(AuthService);
  protected readonly router = inject(Router);
  private readonly overlay = inject(NavigationOverlayService);

  protected readonly navLinks = [
    { label: 'Converter', path: '/converter', icon: null, requiresAuth: false },
    { label: 'History', path: '/history', icon: null, requiresAuth: true },
    { label: 'Favorites', path: '/favorites', icon: null, requiresAuth: true },
    { label: 'Search', path: '/search', icon: null, requiresAuth: true },
  ] as const;

  protected isActive(path: string): boolean {
    return this.router.url.split('?')[0] === path;
  }

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
