import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

interface GalleryPhoto {
  image: string;
  caption: string;
}

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent {
  isLightboxOpen = false;
  activePhotoIndex = 0;

  readonly galleryPhotos: GalleryPhoto[] = [
    {
      image: '/assets/images/banners/banner4.jpg',
      caption: 'Community outreach and public engagement',
    },
    {
      image: '/assets/images/blog/blog-img1.jpg',
      caption: 'Children taking part in guided learning sessions',
    },
    {
      image: '/assets/images/blog/blog-img2.jpg',
      caption: 'Programme interactions focused on participation and support',
    },
    {
      image: '/assets/images/blog/blog-img3.jpg',
      caption: 'Volunteer coordination and event support moments',
    },
    {
      image: '/assets/images/banners/banner1.jpg',
      caption: 'Awareness activities with community involvement',
    },
    {
      image: '/assets/images/banners/banner2.jpg',
      caption: 'Field engagement across programme locations',
    },
    {
      image: '/assets/images/banners/banner3.jpg',
      caption: 'Women-focused support and participation activities',
    },
    {
      image: '/assets/images/products/dash-prd-1.jpg',
      caption: 'Livelihood and skill-oriented programme moments',
    },
    {
      image: '/assets/images/products/dash-prd-2.jpg',
      caption: 'Local meetings and planning interactions',
    },
    {
      image: '/assets/images/products/dash-prd-3.jpg',
      caption: 'Event coordination and team participation',
    },
    {
      image: '/assets/images/products/dash-prd-4.jpg',
      caption: 'Awareness sessions and public engagement snapshots',
    },
  ];

  get activePhoto(): GalleryPhoto {
    return this.galleryPhotos[this.activePhotoIndex];
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
    this.activePhotoIndex = (this.activePhotoIndex - 1 + total) % total;
  }

  showNext(): void {
    const total = this.galleryPhotos.length;
    this.activePhotoIndex = (this.activePhotoIndex + 1) % total;
  }
}
