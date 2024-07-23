import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AUTH } from '../../../../shared/constants/auth.constant';
import { AuthService } from '../../../../core/services/auth.service';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginPayload } from '../../../../shared/models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly validationField = AUTH.validationField;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  form = this.initForm();
  isLoading = false;
  returnUrl = '/dashboard';
  hide = signal(true);

  ngOnInit() {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onHide(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onLogin() {
    if (this.form.invalid) return;

    const body: LoginPayload = {
      email: this.email.value,
      password: this.password.value,
    };

    this.isLoading = true;
    this.authService
      .login(body)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => this.router.navigateByUrl(this.returnUrl));
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }

  private initForm() {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
}
