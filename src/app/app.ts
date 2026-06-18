import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { NavigationOverlayService } from './core/services/navigation-overlay.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, Header, Footer,ProgressSpinnerModule],
  templateUrl: './app.html',
})
export class App {
  protected readonly overlay = inject(NavigationOverlayService);
}
