import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { apiEndpoints } from '../../../api-endpoints';

interface AwardItem {
  image: string;
  caption: string;
}

interface AwardsRecognitionApiItem {
  id?: number | string | null;
  title?: string | null;
  description?: string | null;
  image_path?: string | null;
  display_order?: number | string | null;
}

@Component({
  selector: 'app-awards-recognition',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './awards-recognition.component.html',
  styleUrls: ['./awards-recognition.component.scss']
})
export class AwardsRecognitionComponent implements OnInit {
  isLightboxOpen = false;
  activeAwardIndex = 0;
  awardItems: AwardItem[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<unknown>(apiEndpoints.awardsRecognitions).subscribe({
      next: (response) => {
        this.awardItems = this.extractAwardItems(response);
        this.activeAwardIndex = 0;
      },
      error: () => {
        this.awardItems = [];
        this.activeAwardIndex = 0;
      },
    });
  }

  get activeAward(): AwardItem {
    return this.awardItems[this.activeAwardIndex] ?? { image: '', caption: '' };
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
    if (!total) {
      return;
    }

    this.activeAwardIndex = (this.activeAwardIndex - 1 + total) % total;
  }

  showNext(): void {
    const total = this.awardItems.length;
    if (!total) {
      return;
    }

    this.activeAwardIndex = (this.activeAwardIndex + 1) % total;
  }

  private extractAwardItems(response: unknown): AwardItem[] {
    const items = this.extractApiItems(response);

    return items
      .map((item) => ({
        image: item.image_path ? apiEndpoints.publicAsset(item.image_path) : '',
        caption: item.title || item.description || 'Award recognition',
      }))
      .filter((item) => item.image || item.caption);
  }

  private extractApiItems(response: unknown): AwardsRecognitionApiItem[] {
    if (Array.isArray(response)) {
      return response as AwardsRecognitionApiItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const payload = response as {
      data?: unknown;
      awards_recognitions?: unknown;
      awardsRecognitions?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as AwardsRecognitionApiItem[];
    }

    if (Array.isArray(payload.awards_recognitions)) {
      return payload.awards_recognitions as AwardsRecognitionApiItem[];
    }

    if (Array.isArray(payload.awardsRecognitions)) {
      return payload.awardsRecognitions as AwardsRecognitionApiItem[];
    }

    return [];
  }
}
