import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly STORAGE_KEY = 'cf_token';
  private readonly _token = signal<string | null>(localStorage.getItem(AuthService.STORAGE_KEY));

  readonly isLoggedIn = computed(() => !!this._token());

  readonly currentUser = computed<User | null>(() => {
    const token = this._token();
    if (!token) return null;
    return this.decodePayload(token);
  });

  login(email: string, password: string): boolean {
    const { mockCredentials, mockToken } = environment;

    if (email !== mockCredentials.email || password !== mockCredentials.password) {
      return false;
    }

    localStorage.setItem(AuthService.STORAGE_KEY, mockToken);
    this._token.set(mockToken);
    return true;
  }

  logout(): void {
    localStorage.removeItem(AuthService.STORAGE_KEY);
    this._token.set(null);
  }

  private decodePayload(token: string): User | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}
