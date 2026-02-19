import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  protected memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  protected member = signal<Member | undefined>(undefined);
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    displayName: [''],
    description: [''],
    city: [''],
    country: [''],
  });

  ngOnInit(): void {
    this.route.parent?.data.subscribe({
      next: (data) => {
        const member = data['member'] as Member;

        this.member.set(member);

        this.form.patchValue({
          displayName: member.displayName ?? '',
          description: member.description ?? '',
          city: member.city ?? '',
          country: member.country ?? '',
        });
      },
    });
  }

  updateProfile(): void {
    const member = this.member();
    if (!member) return;

    if (this.form.invalid) return;

    const updatedMember = {
      ...member,
      ...this.form.getRawValue(), // use form values
    };

    this.memberService.updateMember(updatedMember).subscribe({
      next: (res) => {
        this.member.set(updatedMember); // keep UI in sync
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
