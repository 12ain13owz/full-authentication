import { Routes } from '@angular/router';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { VerifyEmailComponent } from './core/components/verify-email/verify-email.component';
import { verifyEmailResolver } from './core/resolvers/verify-email.resolver';

export const routes: Routes = [
  {
    path: 'verify-email/:token',
    component: VerifyEmailComponent,
    resolve: { message: verifyEmailResolver },
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },

  { path: 'error', component: ServerErrorComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
