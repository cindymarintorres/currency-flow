import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'converter',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },
  {
    path: 'converter',
    loadComponent: () =>
      import('./features/converter/converter')
        .then(m => m.Converter)
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./features/history/history')
        .then(m => m.History),
    canActivate: [authGuard]
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites')
        .then(m => m.Favorites),
    canActivate: [authGuard]
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search')
        .then(m => m.Search)
  },
  {
    path: '**',
    redirectTo: 'converter'
  }
];