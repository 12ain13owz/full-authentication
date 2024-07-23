import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidateService {
  constructor() {}

  comparePassword(field: string[], form: FormGroup): ValidationErrors | null {
    const password = form.controls[field[0]];
    const confirmPassword = form.controls[field[1]];

    if (password.value === '' && confirmPassword.value === '') {
      confirmPassword.setErrors({ required: true });
      return { required: true };
    }

    if (password.value === confirmPassword.value) {
      confirmPassword.setErrors(null);
      return null;
    }

    confirmPassword.setErrors({ mismatch: true });
    return { mismatch: true };
  }
}
