import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MemberService } from '../../../core/services/member-service';
import { Member } from '../../../interface/member';
import { MemberCard } from "../member-card/member-card";

@Component({
  selector: 'app-member-list',
  imports: [MemberCard],
  templateUrl: './member-list.html',
})
export class MemberList {
  protected memberService = inject(MemberService);

  // Convert the Observable from getMembers() into a Signal for easier template usage
  //signal() = manual bridge - manual update of state
  //   this.memberService.getMembers().subscribe(data => {
  //   this.members.set(data);
  // });

  //toSignal() = automatic bridge
  protected members = toSignal(this.memberService.getMembers(), { initialValue: [] as Member[] });
}
