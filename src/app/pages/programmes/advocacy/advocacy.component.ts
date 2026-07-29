import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-advocacy',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './advocacy.component.html',
  styleUrls: ['./advocacy.component.scss']
})
export class AdvocacyComponent {}
