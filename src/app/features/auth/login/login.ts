import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { NavigationOverlayService } from '../../../core/services/navigation-overlay.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly overlay = inject(NavigationOverlayService);
  protected readonly loginError = signal(false);

  protected readonly form = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  // Referencias directas a los controles — evita getters o lógica en el template
  protected readonly emailCtrl = this.form.controls.email;
  protected readonly passwordCtrl = this.form.controls.password;

  constructor() {
    // Si el usuario ya está autenticado, redirige inmediatamente
    effect(() => {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/converter']);
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loginError.set(false);
    this.overlay.show();

    const { email, password } = this.form.getRawValue();

    setTimeout(() => {
      const success = this.authService.login(email, password);

      if (success) {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/converter';
        this.router.navigateByUrl(returnUrl).then(() => this.overlay.hide());
      } else {
        this.overlay.hide();
        this.loginError.set(true);
      }
    }, 800);
  }
}
