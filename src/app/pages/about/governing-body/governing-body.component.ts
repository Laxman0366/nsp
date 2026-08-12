import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { apiEndpoints } from '../../../api-endpoints';

interface GoverningBodyMember {
  id: number;
  name: string;
  name_hindi?: string | null;
  name_odia?: string | null;
  position: string;
  qualification?: string | null;
  message: string;
  message_hindi?: string | null;
  message_odia?: string | null;
  image: string;
  displayOrder?: number;
}

@Component({
  selector: 'app-governing-body',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './governing-body.component.html',
  styleUrls: ['./governing-body.component.scss']
})
export class GoverningBodyComponent implements OnInit {
  members: GoverningBodyMember[] = [];
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
    this.http.get<unknown>(apiEndpoints.governingBodies).subscribe({
      next: (response) => {
        this.members = this.mapMembers(response);
      },
      error: () => {
        this.members = [];
      },
    });
  }

  getMemberName(member: GoverningBodyMember): string {
    return this.getLocalizedText(member.name, member.name_hindi, member.name_odia, 'Member');
  }

  getMemberMessage(member: GoverningBodyMember): string {
    return this.getLocalizedText(member.message, member.message_hindi, member.message_odia, '');
  }

  getMemberRole(member: GoverningBodyMember): string {
    const roleKey = this.getRoleTranslationKey(member.position);
    return this.translate.instant(roleKey);
  }

  trackMember(index: number, member: GoverningBodyMember): number {
    return member.id ?? index;
  }

  private mapMembers(response: unknown): GoverningBodyMember[] {
    const payload = this.extractResponseArray(response);

    return payload
      .map((item: Record<string, unknown>, index: number) => {
        const name = this.getStringValue(item, ['name', 'member_name']);
        const nameHindi = this.getStringValue(item, ['name_hindi', 'member_name_hindi']);
        const nameOdia = this.getStringValue(item, ['name_odia', 'member_name_odia']);
        const position = this.getStringValue(item, ['position', 'role']);
        const qualification = this.getStringValue(item, ['qualification', 'degree', 'education']);
        const message = this.getStringValue(item, ['message', 'description', 'summary']);
        const messageHindi = this.getStringValue(item, ['message_hindi', 'description_hindi', 'summary_hindi']);
        const messageOdia = this.getStringValue(item, ['message_odia', 'description_odia', 'summary_odia']);
        const imagePath = this.getStringValue(item, ['image_path', 'image', 'photo', 'profile_image', 'file_path', 'file']);
        const displayOrder = this.getNumericValue(item, ['display_order', 'displayOrder', 'order']);

        const image = imagePath ? apiEndpoints.publicAsset(imagePath) : '/assets/images/profile/default-profile.png';

        return {
          id: Number(this.getValue(item, 'id', index + 1)),
          name: this.getLocalizedText(name, nameHindi, nameOdia, `Member ${index + 1}`),
          name_hindi: nameHindi || null,
          name_odia: nameOdia || null,
          position: position || 'Member',
          qualification: qualification || '',
          message: this.getLocalizedText(message, messageHindi, messageOdia, ''),
          message_hindi: messageHindi || null,
          message_odia: messageOdia || null,
          image,
          displayOrder,
        };
      })
      .filter((member) => member.image || member.name)
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

      if (Array.isArray(payload['governing_body'])) {
        return payload['governing_body'] as Array<Record<string, unknown>>;
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

  private getRoleTranslationKey(position: string): string {
    const normalized = position?.trim();

    switch (normalized) {
      case 'Chairman':
        return 'role.chairman';
      case 'Vice Chairman':
        return 'role.viceChairman';
      case 'Secretary':
        return 'role.secretary';
      case 'Joint Secretary':
        return 'role.jointSecretary';
      default:
        return 'role.member';
    }
  }
}
