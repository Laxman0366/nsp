import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { apiEndpoints } from '../../../api-endpoints';
import { extractReports, ReportTableRow, toReportRows } from '../report-list.helpers';

@Component({
  selector: 'app-annual-report',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './annual-report.component.html',
  styleUrls: ['./annual-report.component.scss']
})
export class AnnualReportComponent implements OnInit {
  rows: ReportTableRow[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<unknown>(apiEndpoints.annualReports).subscribe({
      next: (response) => {
        this.rows = toReportRows(extractReports(response));
      },
      error: () => {
        this.rows = [];
      },
    });
  }
}
