import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../core/services/member-service';
import { ToastService } from '../../../core/services/toast-service';
import { EditableMember, Member } from '../../../interface/member';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe],
  templateUrl: './member-profile.html',
})
export class MemberProfile implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  protected memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  protected member = signal<Member | undefined>(undefined);
  protected editableMember?: EditableMember;

  ngOnInit(): void {
    // parent because resolver is on MemberDetail route
    this.route.parent?.data.subscribe({
      next: (data) => {
        this.member.set(data['member']);
        this.initializeEditableMember();
      },
    });
  }
  initializeEditableMember(): void {
    this.editableMember = {
      displayName: this.member()?.displayName || '',
      description: this.member()?.description || '',
      city: this.member()?.city || '',
      country: this.member()?.country || '',
    };
  }

  updateProfile() {
    if (!this.member()) return;

    const updatedMember = {
      ...this.member(),
      ...this.editableMember,
    };
    console.log('Updated Member:', updatedMember);
    this.toast.success('Profile updated successfully!');
    this.memberService.isEditMode.set(false);
  }
}
