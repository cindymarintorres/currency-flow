import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule, AvatarModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  protected readonly auth = inject(AuthService);

  protected readonly navLinks = [
    { label: 'Converter', path: '/converter', icon: null, requiresAuth: false },
    { label: 'History',   path: '/history',   icon: null, requiresAuth: true  },
    { label: 'Favorites', path: '/favorites', icon: null, requiresAuth: true  },
    { label: 'Search',    path: '/search',    icon: null, requiresAuth: true  },
  ] as const;
}