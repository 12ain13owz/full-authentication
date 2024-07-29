import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { authGuard } from '../../core/guards/auth.guard';
import { profileResolver } from '../../core/resolvers/profile.resolver';
import { UserComponent } from './components/user/user.component';
import { UpdateComponent } from './components/update/update.component';
import { DeleteComponent } from './components/delete/delete.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import { EditAvatarComponent } from './components/profile/edit-avatar/edit-avatar.component';
import { ChangePasswordComponent } from './components/profile/change-password/change-password.component';
import { VerifyStatusComponent } from './components/verify-status/verify-status.component';
import { RoleComponent } from './components/role/role.component';
import { DeviceComponent } from './components/device/device.component';

export const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    resolve: [profileResolver],
    children: [
      { path: 'user', component: UserComponent },
      { path: 'update', component: UpdateComponent },
      { path: 'role', component: RoleComponent },
      { path: 'delete', component: DeleteComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/edit', component: EditProfileComponent },
      { path: 'device', component: DeviceComponent },
      { path: 'avatar', component: EditAvatarComponent },
      { path: 'change-password', component: ChangePasswordComponent },
    ],
  },
  {
    path: 'verify-status',
    component: VerifyStatusComponent,
    resolve: [profileResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
