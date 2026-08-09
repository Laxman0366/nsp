import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { apiEndpoints } from 'src/app/api-endpoints';

interface CctvApiItem {
  id?: number | string | null;
  project_name?: string | null;
  project_name_hindi?: string | null;
  project_name_hi?: string | null;
  project_name_odia?: string | null;
  project_name_or?: string | null;
  serial_number?: string | null;
  display_order?: number | string | null;
}

interface CctvTableRow {
  id: string;
  slNo: string;
  projectName: string;
  serialNumber: string;
  displayOrder: string;
}

@Component({
  selector: 'app-access-cctv',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './access-cctv.component.html',
  styleUrls: ['./access-cctv.component.scss'],
})
export class AccessCctvComponent implements OnInit, OnDestroy {
  isLoading = false;
  rows: CctvTableRow[] = [];
  totalRecords = 0;
  private currentLang: 'en' | 'hi' | 'or' = 'en';
  private records: CctvApiItem[] = [];
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentLang = this.normalizeLanguage(this.translate.currentLang || this.translate.getDefaultLang() || 'en');

    this.subscriptions.add(
      this.translate.onLangChange.subscribe(({ lang }) => {
        this.currentLang = this.normalizeLanguage(lang);
        this.rebuildRows();
      })
    );

    this.loadCctvDetails();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadCctvDetails(): void {
    this.isLoading = true;
    this.http.get<unknown>(apiEndpoints.cctvDetails).subscribe({
      next: (response) => {
        this.records = this.extractRecords(response);
        this.rebuildRows();
      },
      error: () => {
        this.records = [];
        this.rows = [];
        this.totalRecords = 0;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private rebuildRows(): void {
    const sortedRecords = [...this.records].sort((left, right) => {
      const leftOrder = this.toNumber(left.display_order);
      const rightOrder = this.toNumber(right.display_order);
      return leftOrder - rightOrder;
    });

    this.rows = sortedRecords.map((record, index) => ({
      id: String(record.id ?? index),
      slNo: String(index + 1).padStart(2, '0'),
      projectName: this.getLocalizedProjectName(record),
      serialNumber: record.serial_number || '-',
      displayOrder:
        record.display_order === null || record.display_order === undefined
          ? '-'
          : String(record.display_order),
    }));
    this.totalRecords = this.rows.length;
  }

  private getLocalizedProjectName(record: CctvApiItem): string {
    if (this.currentLang === 'hi') {
      return record.project_name_hindi || record.project_name_hi || record.project_name || '-';
    }

    if (this.currentLang === 'or') {
      return record.project_name_odia || record.project_name_or || record.project_name || '-';
    }

    return record.project_name || record.project_name_hindi || record.project_name_odia || '-';
  }

  private extractRecords(response: unknown): CctvApiItem[] {
    if (Array.isArray(response)) {
      return response as CctvApiItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const payload = response as {
      data?: unknown;
      cctv_details?: unknown;
      cctvDetails?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as CctvApiItem[];
    }

    if (Array.isArray(payload.cctv_details)) {
      return payload.cctv_details as CctvApiItem[];
    }

    if (Array.isArray(payload.cctvDetails)) {
      return payload.cctvDetails as CctvApiItem[];
    }

    return [];
  }

  private normalizeLanguage(language: string): 'en' | 'hi' | 'or' {
    if (language === 'hi') {
      return 'hi';
    }

    if (language === 'or' || language === 'od') {
      return 'or';
    }

    return 'en';
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
  }
}
