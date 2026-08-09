import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { BannerComponent } from '../../layouts/full/banner/banner.component';
import { TranslateModule } from '@ngx-translate/core';
import { apiEndpoints } from '../../api-endpoints';
declare var $: any;
interface StoryItem {
  title: string;
  summary: string;
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
  description?: string;
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
  readonly stories: StoryItem[] = [
    {
      title: 'Designing calm for busy teams',
      summary:
        'A closer look at how thoughtful layouts reduce friction and keep work feeling clear.',
      tag: 'Product',
      image: '/assets/images/blog/blog-img1.jpg',
    },
    {
      title: 'Why storytelling still matters',
      summary:
        'The simple habits that help ideas land with more confidence and less noise.',
      tag: 'Culture',
      image: '/assets/images/blog/blog-img2.jpg',
    },
    {
      title: 'Launching with momentum',
      summary:
        'Practical ways to turn small wins into an experience people want to share.',
      tag: 'Growth',
      image: '/assets/images/blog/blog-img3.jpg',
    },
    {
      title: 'Why storytelling still matters',
      summary:
        'The simple habits that help ideas land with more confidence and less noise.',
      tag: 'Culture',
      image: '/assets/images/blog/blog-img2.jpg',
    },
    {
      title: 'Launching with momentum',
      summary:
        'Practical ways to turn small wins into an experience people want to share.',
      tag: 'Growth',
      image: '/assets/images/blog/blog-img3.jpg',
    }
  ];

  readonly galleryPhotos: GalleryItem[] = [
    {
      title: 'Community workshop in progress',
      image: '/assets/images/blog/blog-img1.jpg',
    },
    {
      title: 'Children in learning session',
      image: '/assets/images/blog/blog-img2.jpg',
    },
    {
      title: 'Women livelihood training',
      image: '/assets/images/blog/blog-img3.jpg',
    },
    {
      title: 'Health camp outreach',
      image: '/assets/images/banners/banner1.jpg',
    },
    {
      title: 'Village development meeting',
      image: '/assets/images/banners/banner2.jpg',
    },
    {
      title: 'Field volunteers at work',
      image: '/assets/images/banners/banner4.jpg',
    },
  ];

  readonly partnerLogos: PartnerLogoItem[] = [
    {
      name: 'NSP Main Logo',
      image: '/assets/images/logos/nsp_logo.jpeg',
    },
    {
      name: 'NSP Secondary Logo',
      image: '/assets/images/logos/nsp_logo2.jpeg',
    },
    {
      name: 'Brandmark',
      image: '/assets/images/logos/logo.svg',
    },
    {
      name: 'Icon Mark',
      image: '/assets/images/logos/logo-icon.svg',
    },
    {
      name: 'Adminmart',
      image: '/assets/images/logos/logo-adminmart.svg',
    },
    {
      name: 'NSP Main Logo Alternate',
      image: '/assets/images/logos/nsp_logo.jpeg',
    },
    {
      name: 'NSP Secondary Logo Alternate',
      image: '/assets/images/logos/nsp_logo2.jpeg',
    },
    {
      name: 'Brandmark Alternate',
      image: '/assets/images/logos/logo.svg',
    },
  ];

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

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadNoticeItems();
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
      const description = this.getStringValue(item, ['description', 'details', 'summary']);
      const openingDate = this.getStringValue(item, ['opening_date', 'openingDate', 'open_date']);
      const closingDate = this.getStringValue(item, ['closing_date', 'closingDate', 'close_date']);
      const filePath = this.getStringValue(item, ['detail_file_path', 'file_path', 'pdf_path', 'download_url', 'file_url', 'file']);

      return {
        id: Number(this.getValue(item, 'id', index + 1)),
        title: title || `Untitled ${kind === 'advertisement' ? 'advertisement' : 'tender notice'}`,
        description,
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
      const description = this.getStringValue(item, ['description', 'details', 'summary']);
      const date = this.getStringValue(item, ['date', 'posted_at', 'published_at', 'created_at', 'updated_at', 'opening_date', 'closing_date', 'date_time']);
      const filePath = this.getStringValue(item, ['detail_file_path', 'file_path', 'pdf_path', 'download_url', 'file_url', 'file']);

      return {
        id: Number(this.getValue(item, 'id', index + 1)),
        title: title || 'Untitled news item',
        description,
        link: filePath ? apiEndpoints.publicAsset(filePath) : '#',
        date: this.normalizeDateValue(date),
        pdfLink: filePath ? apiEndpoints.publicAsset(filePath) : '',
      };
    });
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
    $(document).ready(function () {
      $(".stories-carousel").owlCarousel({
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

      $(".partners-logos-carousel").owlCarousel({
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
    });
  }
}
