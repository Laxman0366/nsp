import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { apiEndpoints } from '../../../api-endpoints';

interface ProgrammeOverviewApiItem {
  id?: number | string | null;
  programme_name?: string | null;
  Programme_name?: string | null;
  programmeName?: string | null;
  project_name?: string | null;
  Project_name?: string | null;
  projectName?: string | null;
  starting_year?: number | string | null;
  supported_by?: string | null;
  status?: string | null;
  strength?: number | string | null;
  beneficiaries_covered?: number | string | null;
}

export interface ProgrammeOverviewRow {
  slNo: string;
  programmeName: string;
  projectName: string;
  startingYear: string;
  supportedBy: string;
  status: string;
  strength: string;
  beneficiariesCovered: string;
}

interface ProgrammeOverviewResponse {
  data?: unknown;
  programme_overview?: unknown;
  programme_overviews?: unknown;
}

@Component({
  selector: 'app-programme-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './programme-overview.component.html',
  styleUrls: ['./programme-overview.component.scss']
})
export class ProgrammeOverviewComponent implements OnInit {
  rows: ProgrammeOverviewRow[] = [];
  isLoading = false;
  loadError = false;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadError = false;

    this.http.get<unknown>(apiEndpoints.programmeOverviews).subscribe({
      next: (response) => {
        this.rows = this.toRows(this.extractItems(response));
        this.isLoading = false;
      },
      error: () => {
        this.rows = [];
        this.loadError = true;
        this.isLoading = false;
      },
    });
  }

  private extractItems(response: unknown): ProgrammeOverviewApiItem[] {
    if (Array.isArray(response)) {
      return response as ProgrammeOverviewApiItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const payload = response as ProgrammeOverviewResponse;
    const items = payload.data || payload.programme_overview || payload.programme_overviews;
    return Array.isArray(items) ? items as ProgrammeOverviewApiItem[] : [];
  }

  private toRows(items: ProgrammeOverviewApiItem[]): ProgrammeOverviewRow[] {
    return items.map((item, index) => ({
      slNo: String(index + 1).padStart(2, '0'),
      programmeName: item.programme_name || item.Programme_name || item.programmeName || '-',
      projectName: item.project_name || item.Project_name || item.projectName || '-',
      startingYear: this.displayValue(item.starting_year),
      supportedBy: item.supported_by || '-',
      status: item.status || '-',
      strength: this.displayValue(item.strength),
      beneficiariesCovered: this.displayValue(item.beneficiaries_covered),
    }));
  }

  private displayValue(value: number | string | null | undefined): string {
    return value === null || value === undefined || value === '' ? '-' : String(value);
  }
}
