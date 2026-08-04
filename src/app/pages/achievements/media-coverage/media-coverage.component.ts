import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

interface MediaItem {
  image: string;
  caption: string;
}

@Component({
  selector: 'app-media-coverage',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './media-coverage.component.html',
  styleUrls: ['./media-coverage.component.scss']
})
export class MediaCoverageComponent {
  isLightboxOpen = false;
  activeMediaIndex = 0;

  readonly mediaItems: MediaItem[] = [
    {
      image: '/assets/images/banners/banner1.jpg',
      caption: 'District newspaper highlights women empowerment camp',
    },
    {
      image: '/assets/images/banners/banner2.jpg',
      caption: 'Regional channel covers NSP education support drive',
    },
    {
      image: '/assets/images/banners/banner3.jpg',
      caption: 'Feature story on rural health awareness initiative',
    },
    {
      image: '/assets/images/banners/banner4.jpg',
      caption: 'Local media reports community training participation',
    },
    {
      image: '/assets/images/blog/blog-img1.jpg',
      caption: 'Press note on scholarship outreach success',
    },
    {
      image: '/assets/images/blog/blog-img2.jpg',
      caption: 'Coverage of volunteer-led engagement programme',
    },
    {
      image: '/assets/images/blog/blog-img3.jpg',
      caption: 'Article on youth skill development stories',
    },
    {
      image: '/assets/images/products/dash-prd-1.jpg',
      caption: 'Magazine feature on livelihood improvement outcomes',
    },
    {
      image: '/assets/images/products/dash-prd-2.jpg',
      caption: 'Editorial mentions NSP field-level impact',
    },
  ];

  get activeMedia(): MediaItem {
    return this.mediaItems[this.activeMediaIndex];
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
    this.activeMediaIndex = (this.activeMediaIndex - 1 + total) % total;
  }

  showNext(): void {
    const total = this.mediaItems.length;
    this.activeMediaIndex = (this.activeMediaIndex + 1) % total;
  }
}
