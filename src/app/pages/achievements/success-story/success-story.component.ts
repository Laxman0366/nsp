import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { apiEndpoints } from '../../../api-endpoints';

interface SuccessStoryItem {
  id?: number | string | null;
  title?: string | null;
  title_hindi?: string | null;
  title_hi?: string | null;
  title_odia?: string | null;
  title_or?: string | null;
  beneficiary_name?: string | null;
  beneficiary_name_hindi?: string | null;
  beneficiary_name_hi?: string | null;
  beneficiary_name_odia?: string | null;
  beneficiary_name_or?: string | null;
  sub_title?: string | null;
  sub_title_hindi?: string | null;
  sub_title_odia?: string | null;
  details?: string | null;
  details_hindi?: string | null;
  details_hi?: string | null;
  details_odia?: string | null;
  details_or?: string | null;
  description?: string | null;
  description_hindi?: string | null;
  description_odia?: string | null;
  image_path?: string | null;
  display_order?: number | string | null;
}

interface SuccessStoryView {
  id: string;
  title: string;
  subTitle: string;
  description: SafeHtml | null;
  imageUrl: string;
  altText: string;
}

@Component({
  selector: 'app-success-story',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './success-story.component.html',
  styleUrls: ['./success-story.component.scss']
})
export class SuccessStoryComponent implements OnInit, OnDestroy, AfterViewChecked {
  stories: SuccessStoryView[] = [];

  @ViewChildren('storyText') private storyTextRefs?: QueryList<ElementRef<HTMLElement>>;

  private readonly expandedStoryIds = new Set<string>();
  private readonly overflowingStoryIds = new Set<string>();
  private records: SuccessStoryItem[] = [];
  private currentLang: 'en' | 'hi' | 'or' = 'en';
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService,
    private readonly sanitizer: DomSanitizer,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentLang = this.normalizeLanguage(
      this.translate.currentLang || this.translate.getDefaultLang() || 'en'
    );

    this.subscriptions.add(
      this.translate.onLangChange.subscribe(({ lang }) => {
        this.currentLang = this.normalizeLanguage(lang);
        this.rebuildStories();
      })
    );

    this.http.get<unknown>(apiEndpoints.successStories).subscribe({
      next: (response) => {
        this.records = this.extractStories(response);
        this.rebuildStories();
      },
      error: () => {
        this.records = [];
        this.rebuildStories();
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Compare content height with the clamp height so the measurement stays valid while expanded or animating.
  ngAfterViewChecked(): void {
    let hasChanged = false;

    this.storyTextRefs?.forEach((ref) => {
      const element = ref.nativeElement;
      const storyId = element.dataset['storyId'] || '';
      const isOverflowing = element.scrollHeight > this.getClampHeight(element) + 1;

      if (isOverflowing && !this.overflowingStoryIds.has(storyId)) {
        this.overflowingStoryIds.add(storyId);
        hasChanged = true;
      } else if (!isOverflowing && this.overflowingStoryIds.has(storyId)) {
        this.overflowingStoryIds.delete(storyId);
        hasChanged = true;
      }
    });

    if (hasChanged) {
      this.changeDetector.detectChanges();
    }
  }

  private getClampHeight(element: HTMLElement): number {
    const styles = window.getComputedStyle(element);
    const lineHeight = parseFloat(styles.lineHeight);
    const fallbackLineHeight = parseFloat(styles.fontSize) * 1.7 || 24;
    const visibleLines = parseFloat(styles.getPropertyValue('--story-visible-lines')) || 8;

    return (Number.isFinite(lineHeight) ? lineHeight : fallbackLineHeight) * visibleLines;
  }

  isExpanded(storyId: string): boolean {
    return this.expandedStoryIds.has(storyId);
  }

  isToggleVisible(storyId: string): boolean {
    return this.overflowingStoryIds.has(storyId) || this.expandedStoryIds.has(storyId);
  }

  toggleStory(storyId: string): void {
    if (this.expandedStoryIds.has(storyId)) {
      this.expandedStoryIds.delete(storyId);
      return;
    }

    this.expandedStoryIds.add(storyId);
  }

  trackByStoryId(index: number, story: SuccessStoryView): string {
    return story.id || String(index);
  }

  private rebuildStories(): void {
    this.stories = this.records.map((record, index) => {
      const title = this.getLocalizedText(
        record.title,
        record.title_hindi || record.title_hi,
        record.title_odia || record.title_or
      );

      const description = this.getLocalizedText(
        record.details || record.description,
        record.details_hindi || record.details_hi || record.description_hindi,
        record.details_odia || record.details_or || record.description_odia
      );

      return {
        id: String(record.id ?? index),
        title,
        subTitle: this.getLocalizedText(
          record.beneficiary_name || record.sub_title,
          record.beneficiary_name_hindi || record.beneficiary_name_hi || record.sub_title_hindi,
          record.beneficiary_name_odia || record.beneficiary_name_or || record.sub_title_odia
        ),
        description: description ? this.sanitizer.bypassSecurityTrustHtml(description) : null,
        imageUrl: record.image_path ? apiEndpoints.publicAsset(record.image_path) : '',
        altText: title || 'Success story',
      };
    });
  }

  private getLocalizedText(
    english?: string | null,
    hindi?: string | null,
    odia?: string | null
  ): string {
    const englishText = (english || '').trim();
    const hindiText = (hindi || '').trim();
    const odiaText = (odia || '').trim();

    if (this.currentLang === 'hi') {
      return hindiText || englishText || odiaText;
    }

    if (this.currentLang === 'or') {
      return odiaText || englishText || hindiText;
    }

    return englishText || hindiText || odiaText;
  }

  private normalizeLanguage(lang: string): 'en' | 'hi' | 'or' {
    return lang === 'hi' || lang === 'or' ? lang : 'en';
  }

  private extractStories(response: unknown): SuccessStoryItem[] {
    if (Array.isArray(response)) {
      return response as SuccessStoryItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const payload = response as {
      data?: unknown;
      success_stories?: unknown;
      successStories?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as SuccessStoryItem[];
    }

    if (Array.isArray(payload.success_stories)) {
      return payload.success_stories as SuccessStoryItem[];
    }

    if (Array.isArray(payload.successStories)) {
      return payload.successStories as SuccessStoryItem[];
    }

    return [];
  }
}
