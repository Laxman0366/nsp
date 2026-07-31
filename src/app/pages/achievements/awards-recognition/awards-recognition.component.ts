import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

interface AwardItem {
  image: string;
  caption: string;
}

@Component({
  selector: 'app-awards-recognition',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './awards-recognition.component.html',
  styleUrls: ['./awards-recognition.component.scss']
})
export class AwardsRecognitionComponent {
  isLightboxOpen = false;
  activeAwardIndex = 0;

  readonly awardItems: AwardItem[] = [
    {
      image: '/assets/images/banners/banner3.jpeg',
      caption: 'State-level recognition for community development initiatives',
    },
    {
      image: '/assets/images/banners/banner4.jpg',
      caption: 'District honour for impact in education and social outreach',
    },
  ];

  get activeAward(): AwardItem {
    return this.awardItems[this.activeAwardIndex];
  }

  openLightbox(index: number): void {
    this.activeAwardIndex = index;
    this.isLightboxOpen = true;
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
  }

  showPrev(): void {
    const total = this.awardItems.length;
    this.activeAwardIndex = (this.activeAwardIndex - 1 + total) % total;
  }

  showNext(): void {
    const total = this.awardItems.length;
    this.activeAwardIndex = (this.activeAwardIndex + 1) % total;
  }
}
