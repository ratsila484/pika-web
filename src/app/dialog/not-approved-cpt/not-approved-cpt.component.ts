import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-not-approved-cpt',
  standalone: false,
  templateUrl: './not-approved-cpt.component.html',
  styleUrl: './not-approved-cpt.component.scss',
})
export class NotApprovedCptComponent {
  title = '';
  message = '';
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.title = data.title;
    this.message = data.message;
  }
}
