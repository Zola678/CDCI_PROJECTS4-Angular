import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

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

  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [adminGuard] },
  { path: 'admin/products', component: AdminProductsComponent, canActivate: [adminGuard] },

  /* =========================
     USER ROUTES
  ========================= */

  { path: 'user', component: UserDashboardComponent, canActivate: [authGuard] },
  { path: 'user/products', component: UserProductsComponent, canActivate: [authGuard] },
  { path: 'user/profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'user/settings', component: UserSettingsComponent, canActivate: [authGuard] },

  /* =========================
     FALLBACK
  ========================= */

  { path: '**', redirectTo: '' }
];
