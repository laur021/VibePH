import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberParams } from '../../../interface/member';

@Component({
  selector: 'app-filter-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './filter-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterModal {
  private readonly fb = inject(FormBuilder);

  readonly memberParams = input.required<MemberParams>();
  readonly closeModal = output<void>();
  readonly submitData = output<MemberParams>();

  readonly form = this.fb.nonNullable.group({
    gender: 'male',
    minAge: [18, [Validators.min(18)]],
    maxAge: [100, [Validators.min(18)]],
    orderBy: 'lastActive',
  });

  constructor() {
    effect(() => {
      const params = this.memberParams();
      this.form.patchValue(
        {
          gender: params.gender === 'male' || params.gender === 'female' ? params.gender : '',
          minAge: params.minAge,
          maxAge: params.maxAge,
          orderBy: params.orderBy === 'created' ? 'created' : 'lastActive',
        },
        { emitEvent: false },
      );
    });
  }

  readonly isAgeInvalid = computed(() => {
    const { minAge, maxAge } = this.form.getRawValue();
    return maxAge < minAge;
  });

  close(): void {
    this.closeModal.emit();
  }

  submit(): void {
    if (this.form.invalid || this.isAgeInvalid()) return;

    const formValue = this.form.getRawValue();
    const nextParams = new MemberParams();
    nextParams.pageNumber = 1;
    nextParams.pageSize = this.memberParams().pageSize;
    nextParams.gender = formValue.gender || undefined;
    nextParams.minAge = formValue.minAge;
    nextParams.maxAge = formValue.maxAge;
    nextParams.orderBy = formValue.orderBy;

    this.submitData.emit(nextParams);
    this.close();
  }

  resetGender(): void {
    this.form.patchValue({ gender: '' });
  }
}
