import { Component, inject, input } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { resentVerificationPayload } from '../../../../../shared/models/auth.model';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrl: './register-success.component.scss',
})
export class RegisterSuccessComponent {
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);

  email = input<string>(null);
  isLoading = false;

  onResendVerification() {
    if (!this.email()) return;

    const body: resentVerificationPayload = { email: this.email() };
    this.isLoading = true;
    this.authService
      .resendVerification(body)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => this.toastr.info(res.message));
  }
}
