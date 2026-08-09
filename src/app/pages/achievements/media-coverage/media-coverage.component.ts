import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { apiEndpoints } from '../../../api-endpoints';

interface MediaItem {
  image: string;
  caption: string;
}

interface MediaCoverageApiItem {
  id?: number | string | null;
  title?: string | null;
  description?: string | null;
  image_path?: string | null;
  display_order?: number | string | null;
}

@Component({
  selector: 'app-media-coverage',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './media-coverage.component.html',
  styleUrls: ['./media-coverage.component.scss']
})
export class MediaCoverageComponent implements OnInit {
  isLightboxOpen = false;
  activeMediaIndex = 0;
  mediaItems: MediaItem[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<unknown>(apiEndpoints.mediaCoverages).subscribe({
      next: (response) => {
        this.mediaItems = this.extractMediaItems(response);
        this.activeMediaIndex = 0;
      },
      error: () => {
        this.mediaItems = [];
        this.activeMediaIndex = 0;
      },
    });
  }

  get activeMedia(): MediaItem {
    return this.mediaItems[this.activeMediaIndex] ?? { image: '', caption: '' };
  }

  openLightbox(index: number): void {
    this.activeMediaIndex = index;
    this.isLightboxOpen = true;
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
  }

  showPrev(): void {
    const total = this.mediaItems.length;
    if (!total) {
      return;
    }

    this.activeMediaIndex = (this.activeMediaIndex - 1 + total) % total;
  }

  showNext(): void {
    const total = this.mediaItems.length;
    if (!total) {
      return;
    }

    this.activeMediaIndex = (this.activeMediaIndex + 1) % total;
  }

  private extractMediaItems(response: unknown): MediaItem[] {
    const items = this.extractApiItems(response);

    return items
      .map((item) => ({
        image: item.image_path ? apiEndpoints.publicAsset(item.image_path) : '',
        caption: item.title || item.description || 'Media coverage',
      }))
      .filter((item) => item.image || item.caption);
  }

  private extractApiItems(response: unknown): MediaCoverageApiItem[] {
    if (Array.isArray(response)) {
      return response as MediaCoverageApiItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const payload = response as {
      data?: unknown;
      media_coverages?: unknown;
      mediaCoverages?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as MediaCoverageApiItem[];
    }

    if (Array.isArray(payload.media_coverages)) {
      return payload.media_coverages as MediaCoverageApiItem[];
    }

    if (Array.isArray(payload.mediaCoverages)) {
      return payload.mediaCoverages as MediaCoverageApiItem[];
    }

    return [];
  }
}
