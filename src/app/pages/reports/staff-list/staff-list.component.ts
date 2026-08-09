import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { apiEndpoints } from '../../../api-endpoints';
import { extractReports, ReportTableRow, toReportRows } from '../report-list.helpers';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  rows: ReportTableRow[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<unknown>(apiEndpoints.staffLists).subscribe({
      next: (response) => {
        this.rows = toReportRows(extractReports(response));
      },
      error: () => {
        this.rows = [];
      },
    });
  }
}
