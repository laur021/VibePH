import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../interface/member';
import { RouterLink } from "@angular/router";
import { AgePipe } from "../../../core/pipes/age-pipe";
import { LikeService } from '../../../core/services/like-service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.html',
})
export class MemberCard {
  public member = input.required<Member>();
  private likeService = inject(LikeService);
  protected hasLiked = computed(() => this.likeService.likeIds().includes(this.member().id));
}
