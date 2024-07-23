import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { USER } from '../../../../shared/constants/user.constant';
import { UserService } from '../../services/user.service';
import { User } from '../../../../shared/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class UpdateComponent {
  readonly validationField = USER.validationField;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toastrService = inject(ToastrService);
  private userService = inject(UserService);

  searchForm = this.initSearchForm();
  userForm = this.initUserForm();
  isLoading$ = this.userService.isLoading$;
  user: User;

  onSearch() {
    if (this.searchForm.invalid || this.email.value.length === 0) return;

    this.user = null;
    this.userService.getUserByEmail(this.email.value).subscribe((user) => {
      if (!user) {
        this.toastrService.warning('User not found');
        return;
      }

      this.user = user;
      this.userForm.patchValue({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        active: user.active,
        remark: user.remark,
      });
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const { id, ...body } = this.userForm.value;
    this.userService.update(id, body).subscribe((res) => {
      this.toastrService.success(res.message);
      this.router.navigate(['/dashboard/user']);
    });
  }

  onReset() {
    this.userForm.patchValue({
      id: this.user?.id,
      firstname: this.user?.firstname,
      lastname: this.user?.lastname,
      active: this.user?.active,
      remark: this.user?.remark,
    });
  }

  get email() {
    return this.searchForm.controls['email'];
  }

  get firstname() {
    return this.userForm.controls['firstname'];
  }

  get lastname() {
    return this.userForm.controls['lastname'];
  }

  get active() {
    return this.userForm.controls['active'];
  }

  get remark() {
    return this.userForm.controls['remark'];
  }

  private initSearchForm() {
    return this.fb.group({ email: ['', [Validators.email]] });
  }

  private initUserForm() {
    return this.fb.group({
      id: [-1, Validators.required],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      active: [true, [Validators.required]],
      remark: [null],
    });
  }
}
