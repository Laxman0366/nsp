import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { apiEndpoints } from '../../../api-endpoints';

interface GeneralBodyMember {
  id: number;
  name: string;
  name_hindi?: string | null;
  name_odia?: string | null;
  position?: string | null;
  image: string;
  displayOrder?: number;
}

@Component({
  selector: 'app-general-body',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './general-body.component.html',
  styleUrls: ['./general-body.component.scss']
})
export class GeneralBodyComponent implements OnInit {
  members: GeneralBodyMember[] = [];
  private currentLang: 'en' | 'hi' | 'or' = 'en';

  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService
  ) {
    this.currentLang = this.normalizeLanguage(this.translate.currentLang || this.translate.getDefaultLang() || 'en');
    this.translate.onLangChange.subscribe(({ lang }) => {
      this.currentLang = this.normalizeLanguage(lang);
    });
  }

  ngOnInit(): void {
    this.http.get<unknown>(apiEndpoints.generalBodies).subscribe({
      next: (response) => {
        this.members = this.mapMembers(response);
      },
      error: () => {
        this.members = [];
      },
    });
  }

  getMemberName(member: GeneralBodyMember): string {
    return this.getLocalizedText(member.name, member.name_hindi, member.name_odia, 'Member');
  }

  getMemberPosition(member: GeneralBodyMember): string {
    const fallback = member.position || 'Member';
    return this.translate.instant(`role.${this.getRoleKey(fallback)}`) || fallback;
  }

  trackMember(index: number, member: GeneralBodyMember): number {
    return member.id ?? index;
  }

  private mapMembers(response: unknown): GeneralBodyMember[] {
    const payload = this.extractResponseArray(response);

    return payload
      .map((item: Record<string, unknown>, index: number) => {
        const name = this.getStringValue(item, ['name', 'member_name']);
        const nameHindi = this.getStringValue(item, ['name_hindi', 'member_name_hindi']);
        const nameOdia = this.getStringValue(item, ['name_odia', 'member_name_odia']);
        const position = this.getStringValue(item, ['position', 'role']);
        const imagePath = this.getStringValue(item, ['image_path', 'image', 'photo', 'profile_image', 'file_path', 'file']);
        const displayOrder = this.getNumericValue(item, ['display_order', 'displayOrder', 'order']);

        return {
          id: Number(this.getValue(item, 'id', index + 1)),
          name: this.getLocalizedText(name, nameHindi, nameOdia, `Member ${index + 1}`),
          name_hindi: nameHindi || null,
          name_odia: nameOdia || null,
          position: position || 'Member',
          image: imagePath ? apiEndpoints.publicAsset(imagePath) : '/assets/images/profile/default-profile.png',
          displayOrder,
        };
      })
      .filter((member) => member.name || member.image)
      .sort((a, b) => (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER));
  }

  private extractResponseArray(response: unknown): Array<Record<string, unknown>> {
    if (Array.isArray(response)) {
      return response as Array<Record<string, unknown>>;
    }

    if (response && typeof response === 'object') {
      const payload = response as Record<string, unknown>;
      if (Array.isArray(payload['data'])) {
        return payload['data'] as Array<Record<string, unknown>>;
      }

      if (Array.isArray(payload['items'])) {
        return payload['items'] as Array<Record<string, unknown>>;
      }

      if (Array.isArray(payload['general_bodies'])) {
        return payload['general_bodies'] as Array<Record<string, unknown>>;
      }
    }

    return [];
  }

  private getValue(item: Record<string, unknown>, key: string, fallback: unknown): unknown {
    return item[key] ?? fallback;
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

  private getNumericValue(item: Record<string, unknown>, keys: string[]): number {
    for (const key of keys) {
      const value = item[key];
      if (value === undefined || value === null || value === '') {
        continue;
      }

      const numericValue = Number(value);
      if (!Number.isNaN(numericValue)) {
        return numericValue;
      }
    }

    return Number.MAX_SAFE_INTEGER;
  }

  private getLocalizedText(
    english?: string | null,
    hindi?: string | null,
    odia?: string | null,
    fallback?: string | null
  ): string {
    const valueForCurrentLanguage =
      this.currentLang === 'hi'
        ? hindi || english || odia
        : this.currentLang === 'or'
          ? odia || english || hindi
          : english || hindi || odia;

    if (valueForCurrentLanguage && valueForCurrentLanguage.trim()) {
      return valueForCurrentLanguage;
    }

    return fallback && fallback.trim() ? fallback : '';
  }

  private normalizeLanguage(language: string): 'en' | 'hi' | 'or' {
    if (language === 'hi') {
      return 'hi';
    }

    if (language === 'or' || language === 'od') {
      return 'or';
    }

    return 'en';
  }

  private getRoleKey(position: string): string {
    const normalized = position?.trim();

    switch (normalized) {
      case 'Chairman':
        return 'chairman';
      case 'Vice Chairman':
        return 'viceChairman';
      case 'Secretary':
        return 'secretary';
      case 'Joint Secretary':
        return 'jointSecretary';
      default:
        return 'member';
    }
  }
}
