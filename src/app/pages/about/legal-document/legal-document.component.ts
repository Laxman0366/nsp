import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-legal-document',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './legal-document.component.html',
  styleUrls: ['./legal-document.component.scss']
})
export class LegalDocumentComponent {}
