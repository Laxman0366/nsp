import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { apiEndpoints } from '../../../api-endpoints';

@Component({
  selector: 'app-banner',
  imports: [],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent implements OnInit {
  slides: Array<{ id: number; src: string; title: string; subtitle: string; altText: string }> = [];
  activeIndex = 0;
  autoPlayTimer: any;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  ngOnDestroy(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
  }

  nextSlide(): void {
    if (!this.slides.length) {
      return;
    }

    this.activeIndex = (this.activeIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    if (!this.slides.length) {
      return;
    }

    this.activeIndex = (this.activeIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.activeIndex = index;
  }

  private startAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }

    if (this.slides.length <= 1) {
      return;
    }

    this.autoPlayTimer = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  private loadBanners(): void {
    this.http.get<unknown>(apiEndpoints.banners).subscribe({
      next: (response) => {
        const banners = this.extractBanners(response)
          .filter((banner) => banner.image_path)
          .filter((banner) => {
            if (banner.is_active === null || banner.is_active === undefined) {
              return true;
            }

            return this.toBoolean(banner.is_active);
          })
          .sort((a, b) => this.toNumber(a.display_order) - this.toNumber(b.display_order));

        this.slides = banners.map((banner, index) => ({
          id: banner.id ?? index,
          src: apiEndpoints.publicAsset(banner.image_path || ''),
          title: banner.title || '',
          subtitle: banner.sub_title || '',
          altText: banner.alt_text || banner.title || `Banner ${index + 1}`,
        }));

        this.activeIndex = 0;
        this.startAutoPlay();
      },
      error: () => {
        this.slides = [];
        this.activeIndex = 0;
      },
    });
  }

  private extractBanners(response: unknown): BannerApiItem[] {
    if (Array.isArray(response)) {
      return response as BannerApiItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const payload = response as {
      data?: unknown;
      banners?: unknown;
      banner_management?: unknown;
      bannerManagement?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as BannerApiItem[];
    }

    if (Array.isArray(payload.banners)) {
      return payload.banners as BannerApiItem[];
    }

    if (Array.isArray(payload.banner_management)) {
      return payload.banner_management as BannerApiItem[];
    }

    if (Array.isArray(payload.bannerManagement)) {
      return payload.bannerManagement as BannerApiItem[];
    }

    return [];
  }

  private toBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'number') {
      return value === 1;
    }

    if (typeof value === 'string') {
      return value === '1' || value.toLowerCase() === 'true';
    }

    return false;
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
  }
}

interface BannerApiItem {
  id?: number;
  title?: string;
  sub_title?: string;
  alt_text?: string;
  image_path?: string | null;
  display_order?: number | string | null;
  is_active?: boolean | number | string | null;
}
