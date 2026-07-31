import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface GalleryVideo {
  embedUrl: string;
  safeUrl: SafeResourceUrl;
  caption: string;
}

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './video-gallery.component.html',
  styleUrls: ['./video-gallery.component.scss']
})
export class VideoGalleryComponent {
  isLightboxOpen = false;
  activeVideoIndex = 0;

  readonly galleryVideos: GalleryVideo[];

  constructor(private sanitizer: DomSanitizer) {
    const videos = [
      {
        embedUrl: 'https://www.youtube.com/embed/ysz5S6PUM-U',
        caption: 'Community outreach highlights',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
        caption: 'Learning and child development activities',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
        caption: 'Awareness and field engagement moments',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/oUFJJNQGwhk',
        caption: 'Women participation and support programmes',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/J---aiyznGQ',
        caption: 'Programme event coverage and public interaction',
      },
      {
        embedUrl: 'https://www.youtube.com/embed/A71aqufiNtQ',
        caption: 'Volunteer teamwork and event coordination',
      },
    ];

    this.galleryVideos = videos.map((video) => ({
      ...video,
      safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(video.embedUrl),
    }));
  }

  get activeVideo(): GalleryVideo {
    return this.galleryVideos[this.activeVideoIndex];
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
    this.activeVideoIndex = (this.activeVideoIndex - 1 + total) % total;
  }

  showNext(): void {
    const total = this.galleryVideos.length;
    this.activeVideoIndex = (this.activeVideoIndex + 1) % total;
  }
}
