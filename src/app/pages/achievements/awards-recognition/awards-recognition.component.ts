import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-awards-recognition',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './awards-recognition.component.html',
  styleUrls: ['./awards-recognition.component.scss']
})
export class AwardsRecognitionComponent {}
