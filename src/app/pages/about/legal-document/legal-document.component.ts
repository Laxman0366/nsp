import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-legal-document',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './legal-document.component.html',
  styleUrls: ['./legal-document.component.scss']
})
export class LegalDocumentComponent {}
