import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../../interface/error';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerError {
  protected error?: ApiError;
  protected showDetails = false;

  private readonly router = inject(Router);

  constructor() {
    // ✅ Angular 21 way — signal-based router API
    const navigation = this.router.currentNavigation();
    this.error = navigation?.extras?.state?.['error'] as ApiError | undefined;
  }

  protected detailsToggle(): void {
    this.showDetails = !this.showDetails;
  }
}
