import { Component, ElementRef, model, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemberParams } from '../../../interface/member';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
})
export class FilterModal {
  @ViewChild('filterModal') modalRef!: ElementRef<HTMLDialogElement>;
  closeModal = output();
  submitData = output<MemberParams>();
  memberParams = model(new MemberParams());

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams.set(JSON.parse(filters));
    }
  }

  open() {
    this.modalRef.nativeElement.showModal();
  }

  close() {
    this.modalRef.nativeElement.close();
    this.closeModal.emit();
  }

  submit() {
    this.submitData.emit(this.memberParams());
    this.close();
  }

  onGenderChange(gender: string) {
    this.memberParams.update((params) => ({ ...params, gender: gender || undefined }));
  }

  onMinAgeModelChange(minAge: number) {
    const safeMinAge = Number.isFinite(minAge) ? minAge : 18;
    this.memberParams.update((params) => ({ ...params, minAge: safeMinAge }));
  }

  onMaxAgeModelChange(maxAge: number) {
    const safeMaxAge = Number.isFinite(maxAge) ? maxAge : this.memberParams().minAge;
    this.memberParams.update((params) => ({ ...params, maxAge: safeMaxAge }));
  }

  onOrderByChange(orderBy: string) {
    this.memberParams.update((params) => ({ ...params, orderBy }));
  }

  onMinAgeChange() {
    if (this.memberParams().minAge < 18) {
      this.memberParams.update((params) => ({ ...params, minAge: 18 }));
    }
  }

  onMaxAgeChange() {
    if (this.memberParams().maxAge < this.memberParams().minAge) {
      this.memberParams.update((params) => ({ ...params, maxAge: params.minAge }));
    }
  }
}
