import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-water-sanitation',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './water-sanitation.component.html',
  styleUrls: ['./water-sanitation.component.scss']
})
export class WaterSanitationComponent {}
