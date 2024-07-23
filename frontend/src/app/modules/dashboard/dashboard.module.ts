import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard.routes';
import { DashboardComponent } from './dashboard.component';
import { ToolbarComponent } from './layouts/toolbar/toolbar.component';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { UserComponent } from './components/user/user.component';
import { UpdateComponent } from './components/update/update.component';
import { DeleteComponent } from './components/delete/delete.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import { EditAvatarComponent } from './components/profile/edit-avatar/edit-avatar.component';
import { ChangePasswordComponent } from './components/profile/change-password/change-password.component';
import { VerifyStatusComponent } from './components/verify-status/verify-status.component';
import { UserService } from './services/user.service';
import { UserApiService } from './services/user-api.service';
import { RoleComponent } from './components/role/role.component';
import { DialogDeleteComponent } from './components/delete/dialog-delete/dialog-delete.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ToolbarComponent,
    SidenavComponent,
    UserComponent,
    UpdateComponent,
    RoleComponent,
    DeleteComponent,
    ProfileComponent,
    EditProfileComponent,
    EditAvatarComponent,
    ChangePasswordComponent,
    VerifyStatusComponent,
    DialogDeleteComponent,
  ],
  imports: [SharedModule, DashboardRoutingModule],
  providers: [UserService, UserApiService],
})
export class DashboardModule {}
