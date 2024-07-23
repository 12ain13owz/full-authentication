import { Component, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { AUTH } from '../../../../shared/constants/auth.constant';
import { ValidateService } from '../../../../core/services/validate.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material/stepper';
import {
  RegisterVisibility,
  ResetPasswordPayload,
} from '../../../../shared/models/auth.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  readonly validationField = AUTH.validationField;
  readonly patternPassword = AUTH.patternPassword;

  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  private validateService = inject(ValidateService);

  stepper = viewChild<MatStepper>('stepper');
  hidePasswords = signal<RegisterVisibility>({
    password: true,
    confirmPassword: true,
  });

  isLoading = false;
  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  otpForm = this.fb.group({
    otp: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
    ],
  });

  passwordForm = this.fb.nonNullable.group(
    {
      password: [
        '',
        [Validators.required, Validators.pattern(this.patternPassword)],
      ],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: this.validateService.comparePassword.bind(this, [
        'password',
        'confirmPassword',
      ]),
    }
  );

  get email() {
    return this.emailForm.controls['email'];
  }

  get otp() {
    return this.otpForm.controls['otp'];
  }

  get password() {
    return this.passwordForm.controls['password'];
  }

  get confirmPassword() {
    return this.passwordForm.controls['confirmPassword'];
  }

  sendOTP() {
    if (this.email.invalid) return;

    const body = { email: this.email.value };
    this.isLoading = true;
    this.authService
      .forgotPassword(body)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => this.stepper().next());
  }

  resetPassword() {
    if (
      this.email.invalid ||
      this.otp.invalid ||
      this.password.invalid ||
      this.confirmPassword.invalid
    )
      return;

    const body: ResetPasswordPayload = {
      email: this.email.value,
      otp: this.otp.value,
      password: this.password.value,
      confirmPassword: this.confirmPassword.value,
    };

    this.isLoading = true;
    this.authService
      .resetPassword(body)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => this.stepper().next());
  }

  onHidePasswords(field: keyof RegisterVisibility, event: MouseEvent) {
    this.hidePasswords.update((current) => ({
      ...current,
      [field]: !current[field],
    }));
    event.stopPropagation();
  }
}
