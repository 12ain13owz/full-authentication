import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../../../../core/services/profile.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { Avatar } from '../../../../../shared/models/profile.model';

@Component({
  selector: 'app-edit-avatar',
  templateUrl: './edit-avatar.component.html',
  styleUrl: './edit-avatar.component.scss',
})
export class EditAvatarComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private profileService = inject(ProfileService);

  form = this.fb.group({ avatar: ['', Validators.required] });
  isLoading = false;

  get avatar() {
    return this.form.controls['avatar'];
  }

  onSubmit() {
    if (this.form.invalid) return;

    const body: Avatar = { avatar: this.avatar.value };
    this.isLoading = true;
    this.profileService
      .changeAvatar(body)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => this.router.navigateByUrl('/dashboard/profile'));
  }

  onChangeAvatar(avatar: string) {
    console.log(avatar);
    this.avatar.setValue(avatar);
  }
}
