import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-legal-status',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './legal-status.component.html',
  styleUrls: ['./legal-status.component.scss']
})
export class LegalStatusComponent {}
