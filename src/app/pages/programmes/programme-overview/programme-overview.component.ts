import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-programme-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './programme-overview.component.html',
  styleUrls: ['./programme-overview.component.scss']
})
export class ProgrammeOverviewComponent {}
