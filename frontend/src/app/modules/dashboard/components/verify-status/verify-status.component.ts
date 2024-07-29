import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';
import { finalize } from 'rxjs';
import { resentVerificationPayload } from '../../../../shared/models/auth.model';

@Component({
  selector: 'app-verify-status',
  templateUrl: './verify-status.component.html',
  styleUrl: './verify-status.component.scss',
})
export class VerifyStatusComponent {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);

  profile = this.authService.getProfile();
  isLoading = false;

  ngOnInit() {
    if (!this.profile) this.authService.logout();
    if (this.profile.verified) this.router.navigate(['/dashboard']);
  }

  onResendVerification() {
    const body: resentVerificationPayload = { email: this.profile.email };

    this.isLoading = true;
    this.authService
      .resendVerification(body)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => this.toastr.info(res.message));
  }
}
