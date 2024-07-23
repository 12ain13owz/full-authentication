import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../../../../core/services/profile.service';
import { ValidateService } from '../../../../../core/services/validate.service';
import {
  ChangePasswordPayload,
  PasswordVisibility,
} from '../../../../../shared/models/profile.model';
import { PROFILE } from '../../../../../shared/constants/profile.constant';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  readonly validationField = PROFILE.validationField;
  readonly patternPassword = PROFILE.patternPassword;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private profileService = inject(ProfileService);
  private validateService = inject(ValidateService);

  form = this.initForm();
  isLoading = false;

  hidePasswords = signal<PasswordVisibility>({
    oldPassword: true,
    newPassword: true,
    confirmPassword: true,
  });

  onSubmit() {
    if (this.form.invalid) return;

    const body: ChangePasswordPayload = this.form.getRawValue();
    this.isLoading = true;
    this.profileService
      .changePassword(body)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.toastr.success(res.message);
        this.router.navigateByUrl('/dashboard/profile');
      });
  }

  onHidePasswords(field: keyof PasswordVisibility, event: MouseEvent) {
    this.hidePasswords.update((current) => ({
      ...current,
      [field]: !current[field],
    }));
    event.stopPropagation();
  }

  get oldPassword() {
    return this.form.controls['oldPassword'];
  }

  get newPassword() {
    return this.form.controls['newPassword'];
  }

  get confirmPassword() {
    return this.form.controls['confirmPassword'];
  }

  private initForm() {
    return this.fb.nonNullable.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [Validators.required, Validators.pattern(this.patternPassword)],
        ],
        confirmPassword: [''],
      },
      {
        validators: this.validateService.comparePassword.bind(this, [
          'newPassword',
          'confirmPassword',
        ]),
      }
    );
  }
}
