import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonModule, AvatarModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly navLinks = [
    { label: 'Converter', path: '/converter', icon: null },
    { label: 'History', path: '/history', icon: null },
    { label: 'Favorites', path: '/favorites', icon: null },
    { label: 'Search', path: '/search', icon: 'pi pi-search' },
  ] as const;
}