import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.html',
})
export class NotFound {
  private location = inject(Location); // Inject Location service

  goBack() {
    this.location.back(); // Navigate to previous page
  }
}
