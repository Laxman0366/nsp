import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-vocational-training',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './vocational-training.component.html',
  styleUrls: ['./vocational-training.component.scss']
})
export class VocationalTrainingComponent {}
