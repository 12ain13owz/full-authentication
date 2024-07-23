import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { User } from '../../../../shared/models/user.model';
import { Role } from '../../../../shared/models/role.model';
import { RoleService } from '../../../../core/services/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss',
})
export class RoleComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toastrService = inject(ToastrService);
  private userService = inject(UserService);
  private roleService = inject(RoleService);

  searchForm = this.initSearchForm();
  rolesForm = this.initRolesForm();
  isLoading$ = this.userService.isLoading$;
  user: User;
  roleOptions: Role[];

  ngOnInit(): void {
    this.loadRoleOptions();
  }

  onSearch() {
    if (this.searchForm.invalid || this.email.value.length === 0) return;

    this.user = null;
    this.userService.getUserByEmail(this.email.value).subscribe((user) => {
      if (!user) {
        this.toastrService.warning('User not found');
        return;
      }

      this.user = user;
      this.roleOptions.forEach((role) => {
        this.roles.push(this.fb.control(user.Roles.includes(role.name)));
      });
    });
  }

  loadRoleOptions() {
    this.roleService
      .getRoles()
      .subscribe((roles) => (this.roleOptions = roles));
  }

  onSubmit() {
    const selectedRoles = this.roleOptions
      .filter((role, index) => this.roles.at(index).value)
      .map((role) => role.name);

    const id = this.user.id;
    const body = { Roles: selectedRoles };
    this.userService.updateUserRoles(id, body).subscribe((res) => {
      this.toastrService.success(res.message);
      this.router.navigate(['/dashboard/user']);
    });
  }

  onReset() {
    this.rolesForm.patchValue({ roles: this.user.Roles });
  }

  get email() {
    return this.searchForm.controls['email'];
  }

  get roles() {
    return this.rolesForm.controls['roles'] as FormArray;
  }

  private initSearchForm() {
    return this.fb.group({ email: ['', [Validators.email]] });
  }

  private initRolesForm() {
    return this.fb.group({ roles: this.fb.array([]) });
  }
}
