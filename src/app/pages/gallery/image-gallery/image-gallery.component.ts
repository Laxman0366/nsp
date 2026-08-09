import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { apiEndpoints } from '../../../api-endpoints';

interface GalleryPhoto {
  image: string;
  caption: string;
}

interface ImageGalleryApiItem {
  id?: number | string | null;
  title?: string | null;
  description?: string | null;
  image_path?: string | null;
  display_order?: number | string | null;
}

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {
  isLightboxOpen = false;
  activePhotoIndex = 0;
  galleryPhotos: GalleryPhoto[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<unknown>(apiEndpoints.imageGalleries).subscribe({
      next: (response) => {
        this.galleryPhotos = this.extractGalleryPhotos(response);
        this.activePhotoIndex = 0;
      },
      error: () => {
        this.galleryPhotos = [];
        this.activePhotoIndex = 0;
      },
    });
  }

  get activePhoto(): GalleryPhoto {
    return this.galleryPhotos[this.activePhotoIndex] ?? { image: '', caption: '' };
  }

  openLightbox(index: number): void {
    this.activePhotoIndex = index;
    this.isLightboxOpen = true;
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
  }

  showPrev(): void {
    const total = this.galleryPhotos.length;
    if (!total) {
      return;
    }

    this.activePhotoIndex = (this.activePhotoIndex - 1 + total) % total;
  }

  showNext(): void {
    const total = this.galleryPhotos.length;
    if (!total) {
      return;
    }

    this.activePhotoIndex = (this.activePhotoIndex + 1) % total;
  }

  private extractGalleryPhotos(response: unknown): GalleryPhoto[] {
    const items = this.extractApiItems(response);

    return items
      .map((item) => ({
        image: item.image_path ? apiEndpoints.publicAsset(item.image_path) : '',
        caption: item.title || item.description || 'Gallery photo',
      }))
      .filter((item) => item.image || item.caption);
  }

  private extractApiItems(response: unknown): ImageGalleryApiItem[] {
    if (Array.isArray(response)) {
      return response as ImageGalleryApiItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const payload = response as {
      data?: unknown;
      image_gallery?: unknown;
      imageGallery?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as ImageGalleryApiItem[];
    }

    if (Array.isArray(payload.image_gallery)) {
      return payload.image_gallery as ImageGalleryApiItem[];
    }

    if (Array.isArray(payload.imageGallery)) {
      return payload.imageGallery as ImageGalleryApiItem[];
    }

    return [];
  }
}
