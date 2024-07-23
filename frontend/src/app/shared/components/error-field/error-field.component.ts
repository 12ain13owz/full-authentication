import { Component, inject, input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroupDirective,
} from '@angular/forms';

@Component({
  selector: 'app-error-field',
  templateUrl: './error-field.component.html',
  styleUrl: './error-field.component.scss',
})
export class ErrorFieldComponent {
  control = input<FormControl | AbstractControl>();
  errorMessage = input<Record<string, unknown>>();
  formDirective = inject(FormGroupDirective);
}
