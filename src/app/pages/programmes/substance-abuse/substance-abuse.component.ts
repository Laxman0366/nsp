import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-substance-abuse',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './substance-abuse.component.html',
  styleUrls: ['./substance-abuse.component.scss']
})
export class SubstanceAbuseComponent {}
