import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { apiEndpoints } from '../../../api-endpoints';
import { extractReports, ReportTableRow, toReportRows } from '../report-list.helpers';

@Component({
  selector: 'app-audit-report',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './audit-report.component.html',
  styleUrls: ['./audit-report.component.scss']
})
export class AuditReportComponent implements OnInit {
  rows: ReportTableRow[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<unknown>(apiEndpoints.auditReports).subscribe({
      next: (response) => {
        this.rows = toReportRows(extractReports(response));
      },
      error: () => {
        this.rows = [];
      },
    });
  }
}
