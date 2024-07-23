import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../../../../core/services/profile.service';
import { Profile } from '../../../../../shared/models/profile.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { finalize, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PROFILE } from '../../../../../shared/constants/profile.constant';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent {
  readonly validationField = PROFILE.validationField;

  private subscription: Subscription;
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  profile: Profile;

  form = this.initForm();
  isLoading = false;

  ngOnInit() {
    this.subscription = this.authService.profile$.subscribe((profile) => {
      this.profile = profile;
      this.form.patchValue(profile);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if (this.form.invalid) return;

    const body: Partial<Profile> = this.form.value;
    this.isLoading = true;
    this.profileService
      .updateProfile(body)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.toastr.success(res.message);
        this.router.navigateByUrl('/dashboard/profile');
      });
  }

  onReset() {
    this.form.patchValue(this.profile);
  }

  get firstname() {
    return this.form.controls['firstname'];
  }

  get lastname() {
    return this.form.controls['lastname'];
  }

  get remark() {
    return this.form.controls['remark'];
  }

  initForm() {
    return this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      remark: [null],
    });
  }
}
