import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AUTH } from '../../../../shared/constants/auth.constant';
import { AuthService } from '../../../../core/services/auth.service';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginPayload } from '../../../../shared/models/auth.model';
import { ThemeService } from '../../../../core/services/theme.service';
import { environment } from '../../../../../environments/environment';

declare global {
  interface Window {
    turnstile: any;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly validationField = AUTH.validationField;
  readonly siteKey = environment.SITE_KEY;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  form = this.initForm();
  isLoading = false;
  returnUrl = '/dashboard';
  hide = signal(true);
  theme = computed(() => this.themeService.currentTheme());
  turnstileContainer = viewChild<ElementRef>('turnstileContainer');
  turnstileToken = '';

  ngOnInit() {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  ngAfterViewInit(): void {
    this.renderTurnstile();
  }

  onHide(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  renderTurnstile() {
    window.turnstile.render(this.turnstileContainer().nativeElement, {
      sitekey: this.siteKey,
      callback: (token: string) => (this.turnstileToken = token),
      theme: this.theme(),
    });
  }

  onLogin() {
    console.log(this.turnstileToken);
    if (this.form.invalid) return;
    if (this.turnstileToken.length <= 0) return;

    const body: LoginPayload = {
      email: this.email.value,
      password: this.password.value,
      token: this.turnstileToken,
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
