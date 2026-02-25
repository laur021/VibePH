import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberList {
  private readonly memberService = inject(MemberService);
  protected readonly isFilterOpen = signal(false);
  protected readonly memberParams = signal(this.createInitialParams());
  private readonly updatedParams = signal(this.createInitialParams());

  private readonly initialPaginatedResult: PaginatedResult<Member> = {
    items: [],
    metadata: {
      currentPage: 1,
      pageSize: 5,
      totalCount: 0,
      totalPages: 0,
    },
  };

  constructor() {
    const restoredParams = this.getStoredParams();
    if (restoredParams) {
      this.memberParams.set(restoredParams);
      this.updatedParams.set({ ...restoredParams });
    }
  }

  protected readonly paginatedMembers = toSignal(
    toObservable(this.memberParams).pipe(
      switchMap((params) => this.memberService.getMembers(params)),
    ),
    { initialValue: this.initialPaginatedResult },
  );

  private getStoredParams(): MemberParams | null {
    const rawFilters = localStorage.getItem('filters');
    if (!rawFilters) return null;

    try {
      const parsed = JSON.parse(rawFilters) as Partial<MemberParams>;
      const params = this.createInitialParams();
      params.pageNumber = parsed.pageNumber ?? params.pageNumber;
      params.pageSize = parsed.pageSize ?? params.pageSize;
      params.gender = parsed.gender ?? params.gender;
      params.minAge = parsed.minAge ?? params.minAge;
      params.maxAge = parsed.maxAge ?? params.maxAge;
      params.orderBy = parsed.orderBy ?? params.orderBy;
      return params;
    } catch {
      return null;
    }
  }

  private createInitialParams(): MemberParams {
    const params = new MemberParams();
    params.pageSize = 5;
    params.orderBy = 'lastActive';
    return params;
  }

  protected openModal(): void {
    this.isFilterOpen.set(true);
  }

  protected closeModal(): void {
    this.isFilterOpen.set(false);
  }

  protected onFilterChange(data: MemberParams): void {
    const nextParams = {
      ...data,
      pageSize: this.memberParams().pageSize,
      pageNumber: 1,
    } as MemberParams;

    this.memberParams.set({ ...nextParams });
    this.updatedParams.set({ ...nextParams });

    this.closeModal();
  }

  protected onPageNumberChange(pageNumber: number): void {
    this.memberParams.update((params) => ({
      ...params,
      pageNumber,
    }));
  }

  protected onPageSizeChange(pageSize: number): void {
    this.memberParams.update((params) => ({
      ...params,
      pageSize,
      pageNumber: 1,
    }));
  }

  protected resetFilters(): void {
    const nextParams = this.createInitialParams();
    nextParams.pageSize = this.memberParams().pageSize;
    this.memberParams.set(nextParams);
    this.updatedParams.set({ ...nextParams });
  }

  protected readonly displayMessage = computed(() => {
    const defaultParams = new MemberParams(); // baseline defaults
    const filters: string[] = [];
    const selectedParams = this.updatedParams();

    // Gender
    if (selectedParams.gender) {
      filters.push(`${selectedParams.gender}s`); // males/females
    } else {
      filters.push('males & females'); // default
    }

    // Age range (only if changed from defaults)
    if (
      selectedParams.minAge !== defaultParams.minAge ||
      selectedParams.maxAge !== defaultParams.maxAge
    ) {
      filters.push(`ages ${selectedParams.minAge}-${selectedParams.maxAge}`);
    }

    // Sorting
    filters.push(selectedParams.orderBy === 'lastActive' ? 'recently active' : 'newest members');

    return filters.length > 0 ? `Selected: ${filters.join('  |  ')}` : 'All members';
  });
}
