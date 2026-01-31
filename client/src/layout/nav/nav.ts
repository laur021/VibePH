import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AccountService } from '../../core/services/account-service';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
})
export class Nav {
  protected accountService = inject(AccountService);
  private toast = inject(ToastService);
  protected router = inject(Router);
  protected creds: any = {};

  login() {
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.toast.success('Login successful!');
        this.creds = {};
      },
      error: (error) => {
        this.toast.error(error.error.errors);
      },
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    console.log('Logged out');
  }
}
