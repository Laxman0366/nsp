import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { apiEndpoints } from '../../../api-endpoints';
import { extractReports, ReportTableRow, toReportRows } from '../../reports/report-list.helpers';

@Component({
  selector: 'app-legal-document',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './legal-document.component.html',
  styleUrls: ['./legal-document.component.scss']
})
export class LegalDocumentComponent implements OnInit {
  rows: ReportTableRow[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<unknown>(apiEndpoints.legalDocuments).subscribe({
      next: (response) => {
        this.rows = toReportRows(extractReports(response));
      },
      error: () => {
        this.rows = [];
      },
    });
  }
}
