import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-career-opportunities',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './career-opportunities.component.html',
  styleUrls: ['./career-opportunities.component.scss']
})
export class CareerOpportunitiesComponent {}
