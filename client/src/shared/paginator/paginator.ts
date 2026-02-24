import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.html',
})
export class Paginator {
  // Two-way bindable state
  readonly pageNumber = model(1);
  readonly pageSize = model(10);

  // One-way configuration inputs
  readonly totalCount = input(0);
  totalPages = input(0);
  readonly pageSizeOptions = input<number[]>([5, 10, 20, 50]);

  protected readonly lastItemIndex = computed(() =>
    Math.min(this.pageNumber() * this.pageSize(), this.totalCount()),
  );

  protected readonly firstItemIndex = computed(() =>
    this.totalCount() === 0 ? 0 : (this.pageNumber() - 1) * this.pageSize() + 1,
  );

  // Navigation methods
  protected goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageNumber.set(page);
    }
  }

  protected changePageSize(size: number): void {
    this.pageSize.set(size);
    this.pageNumber.set(1); // reset page when size changes
  }

  protected next(): void {
    this.goToPage(this.pageNumber() + 1);
  }

  protected previous(): void {
    this.goToPage(this.pageNumber() - 1);
  }
}
