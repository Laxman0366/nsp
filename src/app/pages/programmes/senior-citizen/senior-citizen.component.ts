import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-senior-citizen',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './senior-citizen.component.html',
  styleUrls: ['./senior-citizen.component.scss']
})
export class SeniorCitizenComponent {}
