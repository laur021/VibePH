import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../interface/member';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe],
  templateUrl: './member-profile.html',
})
export class MemberProfile implements OnInit {
  private route = inject(ActivatedRoute);
  protected member = signal<Member | undefined>(undefined);

  ngOnInit(): void {
    // parent because resolver is on MemberDetail route
    this.route.parent?.data.subscribe({
      next: (data) => {
        // resolved data is under the 'member' key
        this.member.set(data['member']);
      },
    });
  }
}
