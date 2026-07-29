import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-womens-welfare',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './womens-welfare.component.html',
  styleUrls: ['./womens-welfare.component.scss']
})
export class WomensWelfareComponent {}
