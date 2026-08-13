import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { BannerComponent } from '../../layouts/full/banner/banner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { apiEndpoints } from '../../api-endpoints';
declare var $: any;
interface StoryItem {
  title: string;
  title_hindi?: string | null;
  title_odia?: string | null;
  summary: string;
  summary_hindi?: string | null;
  summary_odia?: string | null;
  tag: string;
  image: string;
}

interface GalleryItem {
  title: string;
  image: string;
}

interface PartnerLogoItem {
  name: string;
  image: string;
}

interface CarouselItem {
  title: string;
  text: string;
  tag: string;
  image: string;
  button: string;
  link: string;
}

interface NoticeItem {
  id: number;
  title: string;
  title_hindi?: string | null;
  title_odia?: string | null;
  description?: string;
  description_hindi?: string | null;
  description_odia?: string | null;
  link: string;
  date?: string;
  openingDate?: string;
  closingDate?: string;
  pdfLink?: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, MaterialModule, BannerComponent, RouterModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  stories: StoryItem[] = [];

  galleryPhotos: GalleryItem[] = [];
  isGalleryLightboxOpen = false;
  activeGalleryIndex = 0;

  get visibleGalleryPhotos(): GalleryItem[] {
    if (this.galleryPhotos.length <= 9) {
      return this.galleryPhotos;
    }

    return [...this.galleryPhotos.slice(0, 5), ...this.galleryPhotos.slice(-4)];
  }

  get activeGalleryPhoto(): GalleryItem {
    return this.visibleGalleryPhotos[this.activeGalleryIndex] ?? { title: '', image: '' };
  }

  partnerLogos: PartnerLogoItem[] = [];

  readonly carouselItems: CarouselItem[] = [
    {
      title: 'Community health camps',
      text: 'Free clinics and outreach programs bringing medical care directly to remote families.',
      tag: 'Health',
      image: '/assets/images/banners/banner4.jpg',
      button: 'Learn more',
      link: '#',
    },
    {
      title: 'Education support',
      text: 'Scholarships and after-school training that empower children to keep learning.',
      tag: 'Education',
      image: '/assets/images/blog/blog-img1.jpg',
      button: 'Discover',
      link: '#',
    },
    {
      title: 'Environmental restoration',
      text: 'Grassroots projects improving local water sources and community forests.',
      tag: 'Sustainability',
      image: '/assets/images/blog/blog-img2.jpg',
      button: 'See details',
      link: '#',
    },
  ];

  advertisements: NoticeItem[] = [];
  tendersNotice: NoticeItem[] = [];
  newsAndEvents: NoticeItem[] = [];
  private currentLang: 'en' | 'hi' | 'or' = 'en';
  private isViewInitialized = false;
  private isPartnerCarouselInitialized = false;
  private isStoriesCarouselInitialized = false;

  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentLang = this.normalizeLanguage(this.translate.currentLang || this.translate.getDefaultLang() || 'en');

    this.translate.onLangChange.subscribe(({ lang }) => {
      this.currentLang = this.normalizeLanguage(lang);
      this.scheduleStoriesCarouselUpdate();
      this.schedulePartnerCarouselUpdate();
    });

    this.loadNoticeItems();
    this.loadPartnerLogos();
    this.loadGalleryPhotos();
    this.loadStories();
  }

  private loadStories(): void {
    this.http.get<unknown>(apiEndpoints.successStories).subscribe({
      next: (response) => {
        this.stories = this.mapStories(response);
        this.scheduleStoriesCarouselUpdate();
      },
      error: () => {
        this.stories = [];
      },
    });
  }

  private loadGalleryPhotos(): void {
    this.http.get<unknown>(apiEndpoints.imageGalleries).subscribe({
      next: (response) => {
        this.galleryPhotos = this.mapGalleryPhotos(response);
      },
      error: () => {
        this.galleryPhotos = [];
      },
    });
  }

  private loadPartnerLogos(): void {
    this.http.get<unknown>(apiEndpoints.partners).subscribe({
      next: (response) => {
        this.partnerLogos = this.mapPartnerLogos(response);
        this.schedulePartnerCarouselUpdate();
      },
      error: () => {
        this.partnerLogos = [];
      },
    });
  }

  private scheduleStoriesCarouselUpdate(): void {
    setTimeout(() => {
      this.initializeOrRefreshStoriesCarousel();
    }, 500);
  }

  private schedulePartnerCarouselUpdate(): void {
    setTimeout(() => {
      this.initializeOrRefreshPartnerCarousel();
    }, 500);
  }

  private loadNoticeItems(): void {
    this.http.get<unknown>(apiEndpoints.advertisements).subscribe({
      next: (response) => {
        this.advertisements = this.mapNoticeItems(response, 'advertisement');
      },
      error: () => {
        this.advertisements = [];
      },
    });

    this.http.get<unknown>(apiEndpoints.tenderNotices).subscribe({
      next: (response) => {
        this.tendersNotice = this.mapNoticeItems(response, 'tender');
      },
      error: () => {
        this.tendersNotice = [];
      },
    });

    this.http.get<unknown>(apiEndpoints.newsEvents).subscribe({
      next: (response) => {
        this.newsAndEvents = this.mapNewsAndEvents(response);
      },
      error: () => {
        this.newsAndEvents = [];
      },
    });
  }

  private mapNoticeItems(response: unknown, kind: 'advertisement' | 'tender'): NoticeItem[] {
    const payload = this.extractResponseArray(response);

    return payload.map((item: Record<string, unknown>, index: number) => {
      const title = this.getStringValue(item, ['title', 'name']);
      const titleHindi = this.getStringValue(item, ['title_hindi', 'title_hi', 'titleHindi']);
      const titleOdia = this.getStringValue(item, ['title_odia', 'title_or', 'titleOdia']);
      const description = this.getStringValue(item, ['description', 'details', 'summary']);
      const descriptionHindi = this.getStringValue(item, ['description_hindi', 'details_hindi', 'summary_hindi', 'descriptionHi']);
      const descriptionOdia = this.getStringValue(item, ['description_odia', 'details_odia', 'summary_odia', 'descriptionOr']);
      const openingDate = this.getStringValue(item, ['opening_date', 'openingDate', 'open_date']);
      const closingDate = this.getStringValue(item, ['closing_date', 'closingDate', 'close_date']);
      const filePath = this.getStringValue(item, ['detail_file_path', 'file_path', 'pdf_path', 'download_url', 'file_url', 'file']);

      return {
        id: Number(this.getValue(item, 'id', index + 1)),
        title: this.getLocalizedText(title, titleHindi, titleOdia, `Untitled ${kind === 'advertisement' ? 'advertisement' : 'tender notice'}`),
        title_hindi: titleHindi || null,
        title_odia: titleOdia || null,
        description: this.getLocalizedText(description, descriptionHindi, descriptionOdia, ''),
        description_hindi: descriptionHindi || null,
        description_odia: descriptionOdia || null,
        link: filePath ? apiEndpoints.publicAsset(filePath) : '#',
        openingDate: this.normalizeDateValue(openingDate),
        closingDate: this.normalizeDateValue(closingDate),
        pdfLink: filePath ? apiEndpoints.publicAsset(filePath) : '',
      };
    });
  }

  private mapNewsAndEvents(response: unknown): NoticeItem[] {
    const payload = this.extractResponseArray(response);

    return payload.map((item: Record<string, unknown>, index: number) => {
      const title = this.getStringValue(item, ['title', 'name']);
      const titleHindi = this.getStringValue(item, ['title_hindi', 'title_hi', 'titleHindi']);
      const titleOdia = this.getStringValue(item, ['title_odia', 'title_or', 'titleOdia']);
      const description = this.getStringValue(item, ['description', 'details', 'summary']);
      const descriptionHindi = this.getStringValue(item, ['description_hindi', 'details_hindi', 'summary_hindi', 'descriptionHi']);
      const descriptionOdia = this.getStringValue(item, ['description_odia', 'details_odia', 'summary_odia', 'descriptionOr']);
      const date = this.getStringValue(item, ['date', 'posted_at', 'published_at', 'created_at', 'updated_at', 'opening_date', 'closing_date', 'date_time']);
      const filePath = this.getStringValue(item, ['detail_file_path', 'file_path', 'pdf_path', 'download_url', 'file_url', 'file']);

      return {
        id: Number(this.getValue(item, 'id', index + 1)),
        title: this.getLocalizedText(title, titleHindi, titleOdia, 'Untitled news item'),
        title_hindi: titleHindi || null,
        title_odia: titleOdia || null,
        description: this.getLocalizedText(description, descriptionHindi, descriptionOdia, ''),
        description_hindi: descriptionHindi || null,
        description_odia: descriptionOdia || null,
        link: filePath ? apiEndpoints.publicAsset(filePath) : '#',
        date: this.normalizeDateValue(date),
        pdfLink: filePath ? apiEndpoints.publicAsset(filePath) : '',
      };
    });
  }

  private mapPartnerLogos(response: unknown): PartnerLogoItem[] {
    const payload = this.extractResponseArray(response);

    return payload
      .map((item: Record<string, unknown>, index: number) => {
        const name = this.getStringValue(item, ['name', 'title', 'partner_name']);
        const imagePath = this.getStringValue(item, ['logo', 'logo_path', 'image', 'image_path', 'photo', 'file', 'file_path']);
        const image = imagePath ? apiEndpoints.publicAsset(imagePath) : '';

        if (!image) {
          return null;
        }

        return {
          name: name || `Partner ${index + 1}`,
          image,
        };
      })
      .filter((item): item is PartnerLogoItem => item !== null);
  }

  private mapGalleryPhotos(response: unknown): GalleryItem[] {
    const payload = this.extractResponseArray(response);

    return payload
      .map((item: Record<string, unknown>, index: number) => {
        const title = this.getStringValue(item, ['title', 'name', 'caption', 'description']);
        const imagePath = this.getStringValue(item, ['image', 'image_path', 'photo', 'file', 'file_path', 'detail_file_path']);
        const image = imagePath ? apiEndpoints.publicAsset(imagePath) : '';

        if (!image) {
          return null;
        }

        return {
          title: title || `Gallery image ${index + 1}`,
          image,
        };
      })
      .filter((item): item is GalleryItem => item !== null);
  }

  private mapStories(response: unknown): StoryItem[] {
    const payload = this.extractResponseArray(response);

    return payload
      .map((item: Record<string, unknown>, index: number): StoryItem | null => {
        const title = this.getStringValue(item, ['title', 'name']);
        const titleHindi = this.getStringValue(item, ['title_hindi', 'title_hi', 'titleHindi']);
        const titleOdia = this.getStringValue(item, ['title_odia', 'title_or', 'titleOdia']);
        const summary = this.getStringValue(item, ['summary', 'description', 'details', 'content']);
        const summaryHindi = this.getStringValue(item, ['summary_hindi', 'summary_hi', 'summaryHindi', 'description_hindi', 'details_hindi']);
        const summaryOdia = this.getStringValue(item, ['summary_odia', 'summary_or', 'summaryOdia', 'description_odia', 'details_odia']);
        const tag = this.getStringValue(item, ['tag', 'category', 'type']);
        const imagePath = this.getStringValue(item, ['image', 'image_path', 'photo', 'file', 'file_path', 'detail_file_path']);
        const image = imagePath ? apiEndpoints.publicAsset(imagePath) : '';

        if (!image) {
          return null;
        }

        return {
          title: this.getLocalizedText(title, titleHindi, titleOdia, `Story ${index + 1}`),
          title_hindi: titleHindi || null,
          title_odia: titleOdia || null,
          summary: this.getLocalizedText(summary, summaryHindi, summaryOdia, ''),
          summary_hindi: summaryHindi || null,
          summary_odia: summaryOdia || null,
          tag: tag || 'Story',
          image,
        };
      })
      .filter((item): item is StoryItem => item !== null);
  }

  private extractResponseArray(response: unknown): Array<Record<string, unknown>> {
    if (Array.isArray(response)) {
      return response as Array<Record<string, unknown>>;
    }

    if (response && typeof response === 'object') {
      const payload: any = response as Record<string, unknown>;
      if (Array.isArray(payload.data)) {
        return payload.data as Array<Record<string, unknown>>;
      }

      if (Array.isArray(payload.items)) {
        return payload.items as Array<Record<string, unknown>>;
      }
    }

    return [];
  }

  getStoryTitle(story: StoryItem): string {
    return this.getLocalizedText(story.title, story.title_hindi, story.title_odia, 'Story');
  }

  getStorySummary(story: StoryItem): string {
    return this.getLocalizedText(story.summary, story.summary_hindi, story.summary_odia, '');
  }

  getNoticeTitle(item: NoticeItem): string {
    return this.getLocalizedText(item.title, item.title_hindi, item.title_odia, 'Untitled item');
  }

  getNoticeDescription(item: NoticeItem): string {
    return this.getLocalizedText(item.description, item.description_hindi, item.description_odia, '');
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

  openGalleryLightbox(index: number): void {
    this.activeGalleryIndex = index;
    this.isGalleryLightboxOpen = true;
  }

  closeGalleryLightbox(): void {
    this.isGalleryLightboxOpen = false;
  }

  showPrevGalleryPhoto(): void {
    const total = this.visibleGalleryPhotos.length;
    if (!total) {
      return;
    }

    this.activeGalleryIndex = (this.activeGalleryIndex - 1 + total) % total;
  }

  showNextGalleryPhoto(): void {
    const total = this.visibleGalleryPhotos.length;
    if (!total) {
      return;
    }

    this.activeGalleryIndex = (this.activeGalleryIndex + 1) % total;
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
    const value = item[key];
    return value ?? fallback;
  }

  private normalizeDateValue(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toISOString();
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.scheduleStoriesCarouselUpdate();
    this.schedulePartnerCarouselUpdate();
  }

  private initializeOrRefreshStoriesCarousel(): void {
    if (!this.isViewInitialized || !this.stories.length) {
      return;
    }

    const carousel = $(".stories-carousel");
    if (!carousel.length) {
      return;
    }

    if (!this.isStoriesCarouselInitialized) {
      carousel.owlCarousel({
        loop: true,
        margin: 14,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 2800,
        autoplayHoverPause: true,
        responsive: {
          0: {
            items: 1
          },
          700: {
            items: 2
          },
          1024: {
            items: 4
          }
        }
      });

      this.isStoriesCarouselInitialized = true;
      return;
    }

    carousel.trigger('refresh.owl.carousel');
  }

  private initializeOrRefreshPartnerCarousel(): void {
    if (!this.isViewInitialized || !this.partnerLogos.length) {
      return;
    }

    const carousel = $(".partners-logos-carousel");
    if (!carousel.length) {
      return;
    }

    if (!this.isPartnerCarouselInitialized) {
      carousel.owlCarousel({
        loop: true,
        margin: 16,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 2200,
        autoplayHoverPause: true,
        responsive: {
          0: {
            items: 2
          },
          576: {
            items: 3
          },
          768: {
            items: 4
          },
          1024: {
            items: 6
          }
        }
      });

      this.isPartnerCarouselInitialized = true;
      return;
    }

    carousel.trigger('refresh.owl.carousel');
  }
}
