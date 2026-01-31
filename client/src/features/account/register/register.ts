import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { RegisterCreds } from '../../../types/user';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
})
export class Register {
  showForm = output<boolean>();
  protected creds = {} as RegisterCreds;

  protected accountService = inject(AccountService);

  register() {
    if (this.creds) {
      this.accountService.register(this.creds).subscribe({
        next: (user) => {
          alert('User registered successfully:');
          this.handleShowForm();
        },
        error: (error) => {
          alert('Registration failed:');
        },
      });
    } else {
      console.error('No credentials provided');
    }
  }

  handleShowForm() {
    this.showForm.emit(false);
  }
}
