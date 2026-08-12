import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../../material.module';
import { apiEndpoints } from '../../api-endpoints';

interface NoticeRow {
  id: number;
  title: string;
  title_hindi?: string | null;
  title_odia?: string | null;
  description?: string;
  description_hindi?: string | null;
  description_odia?: string | null;
  displayDate: string;
  downloadUrl: string;
}

@Component({
  selector: 'app-notice-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.scss'],
})
export class NoticeListComponent implements OnInit {
  notices: NoticeRow[] = [];
  pageTitle = 'Notices';
  isLoading = true;
  private currentLang: 'en' | 'hi' | 'or' = 'en';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly translate: TranslateService
  ) {
    this.currentLang = this.normalizeLanguage(this.translate.currentLang || this.translate.getDefaultLang() || 'en');
    this.translate.onLangChange.subscribe(({ lang }) => {
      this.currentLang = this.normalizeLanguage(lang);
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const type = params.get('type') || 'advertisements';
      this.loadNotices(type);
    });
  }

  private loadNotices(type: string): void {
    this.isLoading = true;

    const apiUrl = this.getApiUrl(type);
    this.http.get<unknown>(apiUrl).subscribe({
      next: (response) => {
        this.notices = this.mapRows(type, response);
        this.pageTitle = this.getPageTitle(type);
        this.isLoading = false;
      },
      error: () => {
        this.notices = [];
        this.pageTitle = this.getPageTitle(type);
        this.isLoading = false;
      },
    });
  }

  private getApiUrl(type: string): string {
    switch (type) {
      case 'advertisements':
        return apiEndpoints.advertisements;
      case 'tender-notices':
        return apiEndpoints.tenderNotices;
      case 'news-events':
        return apiEndpoints.newsEvents;
      default:
        return apiEndpoints.advertisements;
    }
  }

  private getPageTitle(type: string): string {
    switch (type) {
      case 'advertisements':
        return 'Advertisements';
      case 'tender-notices':
        return 'Tender Notices';
      case 'news-events':
        return 'News & Events';
      default:
        return 'Notices';
    }
  }

  private mapRows(type: string, response: unknown): NoticeRow[] {
    const payload = this.extractResponseArray(response);

    return payload.map((item: Record<string, unknown>, index: number) => {
      const title = this.getStringValue(item, ['title', 'name']);
      const titleHindi = this.getStringValue(item, ['title_hindi', 'title_hi', 'titleHindi']);
      const titleOdia = this.getStringValue(item, ['title_odia', 'title_or', 'titleOdia']);
      const description = this.getStringValue(item, ['description', 'details', 'summary']);
      const descriptionHindi = this.getStringValue(item, ['description_hindi', 'details_hindi', 'summary_hindi', 'descriptionHi']);
      const descriptionOdia = this.getStringValue(item, ['description_odia', 'details_odia', 'summary_odia', 'descriptionOr']);
      const displayDate = this.resolveDisplayDate(type, item);
      const filePath = this.getStringValue(item, ['detail_file_path', 'file_path', 'pdf_path', 'download_url', 'file_url', 'file']);

      return {
        id: Number(this.getValue(item, 'id', index + 1)),
        title: this.getLocalizedText(title, titleHindi, titleOdia, 'Untitled item'),
        title_hindi: titleHindi || null,
        title_odia: titleOdia || null,
        description: this.getLocalizedText(description, descriptionHindi, descriptionOdia, ''),
        description_hindi: descriptionHindi || null,
        description_odia: descriptionOdia || null,
        displayDate,
        downloadUrl: filePath ? apiEndpoints.publicAsset(filePath) : '',
      };
    });
  }

  private resolveDisplayDate(type: string, item: Record<string, unknown>): string {
    if (type === 'advertisements' || type === 'tender-notices') {
      const openingDate = this.getStringValue(item, ['opening_date', 'openingDate', 'open_date']);
      const closingDate = this.getStringValue(item, ['closing_date', 'closingDate', 'close_date']);
      const dates = [openingDate, closingDate].filter(Boolean);
      return dates.join(' to ');
    }

    const dateValue = this.getStringValue(item, ['date', 'posted_at', 'published_at', 'created_at', 'updated_at', 'opening_date', 'closing_date', 'date_time']);
    return dateValue || '';
  }

  private extractResponseArray(response: unknown): Array<Record<string, unknown>> {
    if (Array.isArray(response)) {
      return response as Array<Record<string, unknown>>;
    }

    if (response && typeof response === 'object') {
      const payload:any = response as Record<string, unknown>;
      if (Array.isArray(payload.data)) {
        return payload.data as Array<Record<string, unknown>>;
      }

      if (Array.isArray(payload.items)) {
        return payload.items as Array<Record<string, unknown>>;
      }
    }

    return [];
  }

  private getStringValue(item: Record<string, unknown>, keys: string[]): string {
    for (const key of keys) {
      const value = item[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }

    return '';
  }

  private getValue(item: Record<string, unknown>, key: string, fallback: unknown): unknown {
    return item[key] ?? fallback;
  }

  getNoticeTitle(notice: NoticeRow): string {
    return this.getLocalizedText(notice.title, notice.title_hindi, notice.title_odia, 'Untitled item');
  }

  getNoticeDescription(notice: NoticeRow): string {
    return this.getLocalizedText(notice.description, notice.description_hindi, notice.description_odia, '');
  }

  private getLocalizedText(
    english?: string | null,
    hindi?: string | null,
    odia?: string | null,
    fallback?: string | null
  ): string {
    const valueForCurrentLanguage =
      this.currentLang === 'hi'
        ? hindi || english || odia
        : this.currentLang === 'or'
          ? odia || english || hindi
          : english || hindi || odia;

    if (valueForCurrentLanguage && valueForCurrentLanguage.trim()) {
      return valueForCurrentLanguage;
    }

    return fallback && fallback.trim() ? fallback : '';
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
}
