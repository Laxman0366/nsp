import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-brief-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './brief-profile.component.html',
  styleUrls: ['./brief-profile.component.scss']
})
export class BriefProfileComponent {}
