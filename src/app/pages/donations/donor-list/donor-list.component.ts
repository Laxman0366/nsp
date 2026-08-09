import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { apiEndpoints } from '../../../api-endpoints';

interface DonorApiItem {
  donor_name?: string | null;
  donation_amount?: number | string | null;
  donation_date?: string | null;
}

interface DonorRow {
  donorName: string;
  amount: string;
  date: string;
}

@Component({
  selector: 'app-donor-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, TranslateModule],
  templateUrl: './donor-list.component.html',
  styleUrls: ['./donor-list.component.scss']
})
export class DonorListComponent implements OnInit {
  readonly displayedColumns: string[] = ['donorName', 'amount', 'date'];
  donors: DonorRow[] = [];
  isLoading = true;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<unknown>(apiEndpoints.donations).subscribe({
      next: (response) => {
        this.donors = this.toRows(this.extractDonations(response));
        this.isLoading = false;
      },
      error: () => {
        this.donors = [];
        this.isLoading = false;
      },
    });
  }

  private extractDonations(response: unknown): DonorApiItem[] {
    if (Array.isArray(response)) {
      return response as DonorApiItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const payload = response as {
      data?: unknown;
      items?: unknown;
      donations?: unknown;
      donor_list?: unknown;
      donorList?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as DonorApiItem[];
    }

    if (Array.isArray(payload.items)) {
      return payload.items as DonorApiItem[];
    }

    if (Array.isArray(payload.donations)) {
      return payload.donations as DonorApiItem[];
    }

    if (Array.isArray(payload.donor_list)) {
      return payload.donor_list as DonorApiItem[];
    }

    if (Array.isArray(payload.donorList)) {
      return payload.donorList as DonorApiItem[];
    }

    return [];
  }

  private toRows(items: DonorApiItem[]): DonorRow[] {
    return items.map((item) => ({
      donorName: this.getText(item.donor_name, 'N/A'),
      amount: this.getAmount(item.donation_amount),
      date: this.getDate(item.donation_date),
    }));
  }

  private getText(value: string | null | undefined, fallback: string): string {
    if (!value || !value.trim()) {
      return fallback;
    }

    return value.trim();
  }

  private getAmount(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    return String(value);
  }

  private getDate(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(parsed);
  }
}
