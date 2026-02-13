import { Component, input } from '@angular/core';
import { Member } from '../../../interface/member';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-member-card',
  imports: [RouterLink],
  templateUrl: './member-card.html',
})
export class MemberCard {
  public member = input.required<Member>();
}
