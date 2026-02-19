import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { MemberService } from '../../../core/services/member-service';
import { ToastService } from '../../../core/services/toast-service';
import { Member } from '../../../interface/member';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './member-profile.html',
  host: {
    '(window:beforeunload)': 'onBeforeUnload($event)',
  },
})
export class MemberProfile implements OnInit {
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.form.dirty) {
      event.preventDefault();
    }
  }
  protected accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  private toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    displayName: [''],
    description: [''],
    city: [''],
    country: [''],
  });

  ngOnInit(): void {
    this.form.patchValue({
      displayName: this.memberService.member()?.displayName ?? '',
      description: this.memberService.member()?.description ?? '',
      city: this.memberService.member()?.city ?? '',
      country: this.memberService.member()?.country ?? '',
    });
  }

  updateProfile(): void {
    if (!this.memberService.member()) return;

    if (this.form.invalid) return;

    const updatedMember = {
      ...this.memberService.member(),
      ...this.form.getRawValue(), // use form values
    };

    this.memberService.updateMember(updatedMember).subscribe({
      next: (res) => {
        const currentUser = this.accountService.currentUser();

        //update the current user
        if (currentUser && updatedMember.displayName !== currentUser.displayName) {
          this.accountService.setCurrentUser({
            ...currentUser,
            displayName: updatedMember.displayName,
          });
        }

        this.memberService.member.set(updatedMember as Member); // keep UI in sync
        this.toast.success(res.message);
        this.memberService.isEditMode.set(false);
        this.form.markAsPristine();
      },
      error: (res) => {
        this.toast.error(res.message);
      },
    });
  }
}
