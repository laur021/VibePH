import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../core/services/member-service';
import { ToastService } from '../../../core/services/toast-service';
import { Member } from '../../../interface/member';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './member-profile.html',
})
export class MemberProfile implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
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

    this.toast.success('Profile updated successfully!');
    this.memberService.isEditMode.set(false);
  }
}
