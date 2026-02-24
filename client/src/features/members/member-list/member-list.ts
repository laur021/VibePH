import { Component, inject, signal, ViewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MemberService } from '../../../core/services/member-service';
import { Member, MemberParams } from '../../../interface/member';
import { PaginatedResult } from '../../../interface/pagination';
import { Paginator } from '../../../shared/paginator/paginator';
import { FilterModal } from '../filter-modal/filter-modal';
import { MemberCard } from '../member-card/member-card';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
})
export class MemberList {
  @ViewChild('filterModal') modal?: FilterModal;
  private readonly memberService = inject(MemberService);
  protected readonly memberParams = signal(this.createInitialParams());

  private readonly initialPaginatedResult: PaginatedResult<Member> = {
    items: [],
    metadata: {
      currentPage: 1,
      pageSize: 5,
      totalCount: 0,
      totalPages: 0,
    },
  };

  protected readonly paginatedMembers = toSignal(
    toObservable(this.memberParams).pipe(
      switchMap((memberParams) => this.memberService.getMembers(memberParams)),
    ),
    { initialValue: this.initialPaginatedResult },
  );

  private createInitialParams(): MemberParams {
    const params = new MemberParams();
    params.pageSize = 5;
    return params;
  }

  protected onPageNumberChange(pageNumber: number): void {
    this.memberParams.update((params) => ({ ...params, pageNumber }));
  }

  protected onPageSizeChange(pageSize: number): void {
    this.memberParams.update((params) => ({ ...params, pageSize, pageNumber: 1 }));
  }

  protected resetFilters(): void {
    const nextParams = new MemberParams();
    nextParams.pageSize = this.memberParams().pageSize;
    this.memberParams.set(nextParams);
  }

  protected openModal(): void {
    this.modal?.open();
  }

  protected onClose(): void {}

  protected onFilterChange(data: MemberParams): void {
    this.memberParams.update((params) => ({
      ...params,
      ...data,
      pageSize: params.pageSize,
      pageNumber: 1,
    }));
  }
}
