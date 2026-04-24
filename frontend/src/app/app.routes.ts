import { Routes } from '@angular/router';

export const routes: Routes = [

  // 🏠 WELCOME (entrada do sistema)
  {
    path: '',
    loadComponent: () =>
      import('./welcome/welcome').then(m => m.Welcome)
  },

  // 🔐 LOGIN
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then(m => m.Login)
  },

  // 🧾 REGISTER
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register').then(m => m.Register)
  },

  // 📊 DASHBOARD
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard/dashboard').then(m => m.Dashboard)
  },

  // fallback
  {
    path: '**',
    redirectTo: ''
  }

];
