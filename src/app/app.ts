import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, Header, Footer],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header />
      <main class="flex-1 p-8">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class App {}
