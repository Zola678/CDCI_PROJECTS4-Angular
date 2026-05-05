import { Routes } from '@angular/router';

/* =========================
   PAGES
========================= */
import { HomeComponent } from './pages/home/home.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

/* =========================
   ADMIN
========================= */
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';

/* =========================
   USER
========================= */
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { UserProductsComponent } from './user/user-products/user-products.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserSettingsComponent } from './user/user-settings/user-settings.component';

export const routes: Routes = [

  /* =========================
     PUBLIC ROUTES
  ========================= */

  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  /* =========================
     ADMIN ROUTES
  ========================= */

  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'admin/products', component: AdminProductsComponent },

  /* =========================
     USER ROUTES
  ========================= */

  { path: 'user', component: UserDashboardComponent },
  { path: 'user/products', component: UserProductsComponent },
  { path: 'user/profile', component: UserProfileComponent },
  { path: 'user/settings', component: UserSettingsComponent },

  /* =========================
     FALLBACK
  ========================= */

  { path: '**', redirectTo: '' }
];
