import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account-service';
import { RegisterCreds } from '../../../interface/user';
import { TextInput } from '../../../shared/text-input/text-input';

type Step = 1 | 2;

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  readonly showForm = output<boolean>();
  private router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private accountService = inject(AccountService);

  // ---- Holds backend validation errors ----
  protected validationErrors = signal<string[]>([]);

  // ---- Step State (Signal) ----
  protected readonly currentStep = signal<Step>(1);

  // ---- Derived State ----
  protected readonly isStepOne = computed(() => this.currentStep() === 1);
  protected readonly isStepTwo = computed(() => this.currentStep() === 2);

  // ---- Max Date (18+ restriction) ----
  protected readonly maxDate = this.calculateMaxDate();

  // ---- Unified Form ----
  protected readonly registerForm = this.fb.nonNullable.group({
    credentials: this.fb.nonNullable.group(
      {
        email: ['', [Validators.required, Validators.email]],
        displayName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator() },
    ),
    profile: this.fb.nonNullable.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    }),
  });

  // ---- Convenience Getters ----
  protected get credentialsForm() {
    return this.registerForm.controls.credentials;
  }

  protected get profileForm() {
    return this.registerForm.controls.profile;
  }

  // ---- Navigation ----
  protected nextStep(): void {
    if (this.credentialsForm.invalid) return;
    this.currentStep.set(2);
  }

  protected prevStep(): void {
    this.currentStep.set(1);
  }

  // ---- Submit ----
  protected register(): void {
    if (this.registerForm.invalid) return;

    this.validationErrors.set([]);

    const { credentials, profile } = this.registerForm.getRawValue();

    const formData: RegisterCreds = {
      ...credentials,
      ...profile,
    };

    this.accountService.register(formData).subscribe({
      next: () => this.router.navigateByUrl('/members'),
      error: (error: unknown) => {
        if (Array.isArray(error)) {
          this.validationErrors.set(error);
        } else {
          this.validationErrors.set(['Registration failed.']);
        }
      },
    });
  }

  protected handleShowForm(): void {
    this.showForm.emit(false);
  }

  // ---- Validators ----
  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirm = group.get('confirmPassword')?.value;

      return password === confirm ? null : { passwordMismatch: true };
    };
  }

  private calculateMaxDate(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }
}
