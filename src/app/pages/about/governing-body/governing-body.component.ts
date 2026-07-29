import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-governing-body',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './governing-body.component.html',
  styleUrls: ['./governing-body.component.scss']
})
export class GoverningBodyComponent {}
