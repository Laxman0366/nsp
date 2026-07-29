import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-mental-health',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './mental-health.component.html',
  styleUrls: ['./mental-health.component.scss']
})
export class MentalHealthComponent {}
