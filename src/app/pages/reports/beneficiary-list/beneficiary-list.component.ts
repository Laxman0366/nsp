import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { apiEndpoints } from '../../../api-endpoints';
import { BeneficiaryTableRow, extractReports, toBeneficiaryRows } from '../report-list.helpers';

@Component({
  selector: 'app-beneficiary-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './beneficiary-list.component.html',
  styleUrls: ['./beneficiary-list.component.scss']
})
export class BeneficiaryListComponent implements OnInit {
  rows: BeneficiaryTableRow[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<unknown>(apiEndpoints.beneficiaryLists).subscribe({
      next: (response) => {
        this.rows = toBeneficiaryRows(extractReports(response));
      },
      error: () => {
        this.rows = [];
      },
    });
  }
}
