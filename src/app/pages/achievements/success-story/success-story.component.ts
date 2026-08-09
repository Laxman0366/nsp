import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { apiEndpoints } from '../../../api-endpoints';

interface SuccessStoryItem {
  id?: number | string | null;
  title?: string | null;
  sub_title?: string | null;
  description?: string | null;
  image_path?: string | null;
  display_order?: number | string | null;
}

@Component({
  selector: 'app-success-story',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './success-story.component.html',
  styleUrls: ['./success-story.component.scss']
})
export class SuccessStoryComponent implements OnInit {
  stories: SuccessStoryItem[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<unknown>(apiEndpoints.successStories).subscribe({
      next: (response) => {
        this.stories = this.extractStories(response);
      },
      error: () => {
        this.stories = [];
      },
    });
  }

  private extractStories(response: unknown): SuccessStoryItem[] {
    if (Array.isArray(response)) {
      return response as SuccessStoryItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const payload = response as {
      data?: unknown;
      success_stories?: unknown;
      successStories?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as SuccessStoryItem[];
    }

    if (Array.isArray(payload.success_stories)) {
      return payload.success_stories as SuccessStoryItem[];
    }

    if (Array.isArray(payload.successStories)) {
      return payload.successStories as SuccessStoryItem[];
    }

    return [];
  }

  getStoryImage(story: SuccessStoryItem): string {
    return story.image_path ? apiEndpoints.publicAsset(story.image_path) : '';
  }

  trackByStoryId(index: number, story: SuccessStoryItem): number | string | null | undefined {
    return story.id ?? index;
  }
}
