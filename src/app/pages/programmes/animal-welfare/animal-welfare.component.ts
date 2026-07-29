import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-animal-welfare',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './animal-welfare.component.html',
  styleUrls: ['./animal-welfare.component.scss']
})
export class AnimalWelfareComponent {}
