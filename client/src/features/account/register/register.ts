import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { TextInput } from '../../../shared/text-input/text-input';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe, TextInput],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  readonly showForm = output<boolean>();
  private readonly fb = inject(FormBuilder);

  protected readonly registerForm = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordsMatchValidator() },
  );

  register(): void {
    if (this.registerForm.invalid) return;

    const creds = this.registerForm.getRawValue();
    console.log(creds);
  }

  handleShowForm(): void {
    this.showForm.emit(false);
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirm = group.get('confirmPassword')?.value;

      return password === confirm ? null : { passwordMismatch: true };
    };
  }
}
