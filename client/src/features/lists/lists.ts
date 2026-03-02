import { Component, inject, OnInit, signal } from '@angular/core';
import { LikeService } from '../../core/services/like-service';
import { Member } from '../../interface/member';
import { PaginatedResult } from '../../interface/pagination';
import { Paginator } from '../../shared/paginator/paginator';
import { MemberCard } from '../members/member-card/member-card';

@Component({
  selector: 'app-lists',
  imports: [Paginator, MemberCard],
  templateUrl: './lists.html',
})
export class Lists implements OnInit {
  private likeService = inject(LikeService);
  protected pagination = signal<PaginatedResult<Member> | null>(null);
  protected predicate = 'liked';
  protected pageNumber = 1;
  protected pageSize = 5;

  tabs = [
    { label: 'Liked', value: 'liked' },
    { label: 'Liked me', value: 'likedBy' },
    { label: 'Mutual', value: 'mutual' },
  ];

  ngOnInit(): void {
    this.loadLikes();
  }

  setPredicate(predicate: string) {
    if (this.predicate !== predicate) {
      this.predicate = predicate;
      this.pageNumber = 1;
      this.loadLikes();
    }
  }

  loadLikes() {
    this.likeService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: (result) => {
        this.pagination.set(result);
      },
    });
  }

  protected onPageNumberChange(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.loadLikes();
  }

  protected onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.loadLikes();
  }
}
