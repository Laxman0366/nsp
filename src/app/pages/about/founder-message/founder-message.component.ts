import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-founder-message',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './founder-message.component.html',
  styleUrls: ['./founder-message.component.scss']
})
export class FounderMessageComponent {}
