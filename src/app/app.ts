import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule],
  template: `
    <nav style="display:flex; gap:1rem; padding:1rem; border-bottom:1px solid #eee">
      <a routerLink="/converter" routerLinkActive="active">Converter</a>
      <a routerLink="/history" routerLinkActive="active">History</a>
      <a routerLink="/favorites" routerLinkActive="active">Favorites</a>
      <a routerLink="/search" routerLinkActive="active">Search</a>
      <a routerLink="/login" routerLinkActive="active">Login</a>
    </nav>
    <main style="padding:2rem">
      <router-outlet />
    </main>
  `
})
export class App {}