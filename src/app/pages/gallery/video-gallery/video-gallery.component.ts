import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { apiEndpoints } from '../../../api-endpoints';

interface GalleryVideo {
  embedUrl: string;
  safeUrl: SafeResourceUrl;
  caption: string;
  isDirectVideo: boolean;
}

interface VideoGalleryApiItem {
  id?: number | string | null;
  title?: string | null;
  description?: string | null;
  video_url?: string | null;
  video_path?: string | null;
  embed_url?: string | null;
  display_order?: number | string | null;
}

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './video-gallery.component.html',
  styleUrls: ['./video-gallery.component.scss']
})
export class VideoGalleryComponent implements OnInit {
  isLightboxOpen = false;
  activeVideoIndex = 0;
  galleryVideos: GalleryVideo[] = [];

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get<unknown>(apiEndpoints.videoGalleries).subscribe({
      next: (response) => {
        this.galleryVideos = this.extractGalleryVideos(response);
        this.activeVideoIndex = 0;
      },
      error: () => {
        this.galleryVideos = [];
        this.activeVideoIndex = 0;
      },
    });
  }

  get activeVideo(): GalleryVideo {
    return this.galleryVideos[this.activeVideoIndex] ?? {
      embedUrl: '',
      safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(''),
      caption: '',
      isDirectVideo: false,
    };
  }

  openLightbox(index: number): void {
    this.activeVideoIndex = index;
    this.isLightboxOpen = true;
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
  }

  showPrev(): void {
    const total = this.galleryVideos.length;
    if (!total) {
      return;
    }

    this.activeVideoIndex = (this.activeVideoIndex - 1 + total) % total;
  }

  showNext(): void {
    const total = this.galleryVideos.length;
    if (!total) {
      return;
    }

    this.activeVideoIndex = (this.activeVideoIndex + 1) % total;
  }

  private extractGalleryVideos(response: unknown): GalleryVideo[] {
    const items = this.extractApiItems(response);

    return items
      .map((item) => {
        const directVideoPath = item.video_path || '';
        const embedUrl = item.embed_url || item.video_url || directVideoPath || '';
        const isDirectVideo = !!directVideoPath;
        const resolvedUrl = this.resolveMediaUrl(isDirectVideo ? directVideoPath : embedUrl);

        return {
          embedUrl: resolvedUrl,
          safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(resolvedUrl),
          caption: item.title || item.description || 'Video gallery',
          isDirectVideo,
        };
      })
      .filter((item) => item.embedUrl);
  }

  private resolveMediaUrl(path: string): string {
    if (!path) {
      return '';
    }

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    return apiEndpoints.publicAsset(path);
  }

  private extractApiItems(response: unknown): VideoGalleryApiItem[] {
    if (Array.isArray(response)) {
      return response as VideoGalleryApiItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const payload = response as {
      data?: unknown;
      video_gallery?: unknown;
      videoGallery?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as VideoGalleryApiItem[];
    }

    if (Array.isArray(payload.video_gallery)) {
      return payload.video_gallery as VideoGalleryApiItem[];
    }

    if (Array.isArray(payload.videoGallery)) {
      return payload.videoGallery as VideoGalleryApiItem[];
    }

    return [];
  }
}
