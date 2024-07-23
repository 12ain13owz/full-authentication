import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  RegisterPayload,
  RegisterVisibility,
} from '../../../../shared/models/auth.model';
import { AUTH } from '../../../../shared/constants/auth.constant';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ValidateService } from '../../../../core/services/validate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  readonly validationField = AUTH.validationField;
  readonly patternPassword = AUTH.patternPassword;

  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  private validateService = inject(ValidateService);

  form = this.initForm();
  isLoading = false;
  isRegistered = false;

  hidePasswords = signal<RegisterVisibility>({
    password: true,
    confirmPassword: true,
  });

  onSubmit() {
    if (this.form.invalid) return;

    const body: RegisterPayload = {
      email: this.email.value,
      password: this.password.value,
      confirmPassword: this.confirmPassword.value,
      firstname: this.firstname.value,
      lastname: this.lastname.value,
      avatar: this.avatar.value,
    };

    this.isLoading = true;
    this.authService
      .register(body)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.isRegistered = true;
        this.toastr.success(res.message);
      });
  }

  onHidePasswords(field: keyof RegisterVisibility, event: MouseEvent) {
    this.hidePasswords.update((current) => ({
      ...current,
      [field]: !current[field],
    }));
    event.stopPropagation();
  }

  onChangeAvatar(avatar: string) {
    this.avatar.setValue(avatar);
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }

  get confirmPassword() {
    return this.form.controls['confirmPassword'];
  }

  get firstname() {
    return this.form.controls['firstname'];
  }

  get lastname() {
    return this.form.controls['lastname'];
  }

  get avatar() {
    return this.form.controls['avatar'];
  }

  private initForm() {
    return this.fb.nonNullable.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.pattern(this.patternPassword)],
        ],
        confirmPassword: [''],
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        avatar: [null],
      },
      {
        validators: this.validateService.comparePassword.bind(this, [
          'password',
          'confirmPassword',
        ]),
      }
    );
  }
}
