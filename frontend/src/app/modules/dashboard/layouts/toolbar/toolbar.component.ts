import { Component, inject, output } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  readonly IMAGE_URL = environment.IMAGE_URL;
  private authService = inject(AuthService);

  profile$ = this.authService.profile$;
  toggleSidenavEvent = output<void>();

  toggleSidenav() {
    this.toggleSidenavEvent.emit();
  }

  onLogout() {
    this.authService.logout().subscribe();
  }
}
