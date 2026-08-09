import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-organization',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './about-organization.component.html',
  styleUrls: ['./about-organization.component.scss']
})
export class AboutOrganizationComponent {}
