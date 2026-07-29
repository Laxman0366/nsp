import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-capacity-building',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './capacity-building.component.html',
  styleUrls: ['./capacity-building.component.scss']
})
export class CapacityBuildingComponent {}
