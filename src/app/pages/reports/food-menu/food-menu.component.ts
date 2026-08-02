import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { apiEndpoints } from '../../../api-endpoints';
import { extractReports, ReportTableRow, toReportRows } from '../report-list.helpers';

@Component({
  selector: 'app-food-menu',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './food-menu.component.html',
  styleUrls: ['./food-menu.component.scss']
})
export class FoodMenuComponent implements OnInit {
  rows: ReportTableRow[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<unknown>(apiEndpoints.foodMenus).subscribe({
      next: (response) => {
        this.rows = toReportRows(extractReports(response));
      },
      error: () => {
        this.rows = [];
      },
    });
  }
}
