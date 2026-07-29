import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-general-body',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './general-body.component.html',
  styleUrls: ['./general-body.component.scss']
})
export class GeneralBodyComponent {}
