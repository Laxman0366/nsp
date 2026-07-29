import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-education-hrw',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './education-hrw.component.html',
  styleUrls: ['./education-hrw.component.scss']
})
export class EducationHRWComponent {}
