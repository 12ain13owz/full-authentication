import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly IMAGE_URL = environment.IMAGE_URL;
  private authService = inject(AuthService);

  profile$ = this.authService.profile$;
}
