import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MemberService } from '../../../core/services/member-service';
import { Member } from '../../../interface/member';

@Component({
  selector: 'app-member-detail',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './member-detail.html',
})
export class MemberDetail {
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);

  // Convert an Observable (HTTP request) into a Signal
  protected member = toSignal(
    // Call the service to fetch a single member
    // from membercard -> [routerLink]="['/members', member.id]"
    this.memberService.getMember(this.route.snapshot.paramMap.get('id')!),

    {
      // Provide an initial synchronous value
      // This prevents undefined errors before the HTTP response arrives
      initialValue: {} as Member,
    },
  );
}
