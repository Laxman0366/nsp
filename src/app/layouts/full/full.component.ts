import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { apiEndpoints } from 'src/app/api-endpoints';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-full',
  imports: [RouterModule, MaterialModule, CommonModule, TranslateModule],
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FullComponent implements OnInit {
  openDropdown: string | null = null;
  programmeMenuItems: ProgrammeMenuItem[] = [];
  isProgrammeMenuLoading = false;
  topBarEmail = 'nspodisha@gmail.com';
  topBarPhone = '9437524416';
  topBarAddress = 'AT-Benagaon(Dayavihar), P.O-Gadasahi,P.S-Kanas, Dist-Puri, Odisha-752017';
  private officeAddressEnglish = this.topBarAddress;
  private officeAddressHindi = '';
  private officeAddressOdia = '';

  currentLang = 'en';

  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use(this.currentLang);
  }

  ngOnInit(): void {
    this.loadOrganizationDetails();
    this.loadProgrammeMenuItems();
  }

  toggleDropdown(menu: string) {
    this.openDropdown = this.openDropdown === menu ? null : menu;
  }

  switchLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    this.updateLocalizedAddress();
  }

  private loadProgrammeMenuItems(): void {
    this.isProgrammeMenuLoading = true;
    this.http.get<unknown>(apiEndpoints.programmeMasters).subscribe({
      next: (response) => {
        this.programmeMenuItems = this.extractProgrammeMenuItems(response);
      },
      error: () => {
        this.programmeMenuItems = [];
      },
      complete: () => {
        this.isProgrammeMenuLoading = false;
      },
    });
  }

  private loadOrganizationDetails(): void {
    this.http.get<unknown>(apiEndpoints.organizationDetailById(1)).subscribe({
      next: (response) => {
        const details = this.extractOrganizationDetails(response);
        if (!details) {
          return;
        }

        this.topBarEmail =
          this.getOrganizationFieldValue(details.email, details.email_id, details.emailId) || this.topBarEmail;
        this.topBarPhone =
          this.getOrganizationFieldValue(details.phone_number, details.phoneNumber, details.phone) || this.topBarPhone;
        this.officeAddressEnglish =
          this.getOrganizationFieldValue(
            details.office_address,
            details.officeAddress,
            details.address
          ) || this.officeAddressEnglish;
        this.officeAddressHindi = this.getOrganizationFieldValue(
          details.office_address_hindi,
          details.office_address_hi,
          details.officeAddressHindi
        );
        this.officeAddressOdia = this.getOrganizationFieldValue(
          details.office_address_odia,
          details.office_address_or,
          details.officeAddressOdia
        );
        this.updateLocalizedAddress();
      },
      error: () => {
        // Keep existing static fallback values if API fails.
      },
    });
  }

  private extractOrganizationDetails(response: unknown): OrganizationDetailsRecord | null {
    if (Array.isArray(response)) {
      return response.length ? (response[0] as OrganizationDetailsRecord) : null;
    }

    if (!response || typeof response !== 'object') {
      return null;
    }

    if (this.isOrganizationDetailsRecord(response)) {
      return response as OrganizationDetailsRecord;
    }

    const payload = response as {
      data?: unknown;
      organization_details?: unknown;
      organizationDetails?: unknown;
    };

    if (payload.data && this.isOrganizationDetailsRecord(payload.data)) {
      return payload.data as OrganizationDetailsRecord;
    }

    if (Array.isArray(payload.data)) {
      return payload.data.length ? (payload.data[0] as OrganizationDetailsRecord) : null;
    }

    if (payload.organization_details && this.isOrganizationDetailsRecord(payload.organization_details)) {
      return payload.organization_details as OrganizationDetailsRecord;
    }

    if (Array.isArray(payload.organization_details)) {
      return payload.organization_details.length
        ? (payload.organization_details[0] as OrganizationDetailsRecord)
        : null;
    }

    if (payload.organizationDetails && this.isOrganizationDetailsRecord(payload.organizationDetails)) {
      return payload.organizationDetails as OrganizationDetailsRecord;
    }

    if (Array.isArray(payload.organizationDetails)) {
      return payload.organizationDetails.length
        ? (payload.organizationDetails[0] as OrganizationDetailsRecord)
        : null;
    }

    return null;
  }

  private isOrganizationDetailsRecord(value: unknown): boolean {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const details = value as OrganizationDetailsRecord;
    return Boolean(
      details.email !== undefined ||
      details.email_id !== undefined ||
      details.emailId !== undefined ||
      details.phone_number !== undefined ||
      details.phoneNumber !== undefined ||
      details.office_address !== undefined ||
      details.officeAddress !== undefined ||
      details.office_address_hindi !== undefined ||
      details.officeAddressHindi !== undefined ||
      details.office_address_odia !== undefined ||
      details.officeAddressOdia !== undefined
    );
  }

  private updateLocalizedAddress(): void {
    if (this.currentLang === 'hi') {
      this.topBarAddress = this.officeAddressHindi || this.officeAddressEnglish || this.officeAddressOdia;
      return;
    }

    if (this.currentLang === 'or') {
      this.topBarAddress = this.officeAddressOdia || this.officeAddressEnglish || this.officeAddressHindi;
      return;
    }

    this.topBarAddress = this.officeAddressEnglish || this.officeAddressHindi || this.officeAddressOdia;
  }

  private getOrganizationFieldValue(...values: Array<string | null | undefined>): string {
    for (const value of values) {
      if (typeof value === 'string') {
        return value;
      }
    }

    return '';
  }

  private extractProgrammeMenuItems(response: unknown): ProgrammeMenuItem[] {
    const records = this.extractRecords(response);

    return records
      .map((record) => {
        const id = record.id;
        const nameEnglish = record.programme_name || record.title || '';
        const nameHindi = record.programme_name_hindi || '';
        const nameOdia = record.programme_name_odia || '';
        const fallbackName = nameEnglish || nameHindi || nameOdia;

        if ((id === null || id === undefined || id === '') || !fallbackName) {
          return null;
        }

        return {
          id: String(id),
          nameEnglish,
          nameHindi,
          nameOdia,
          displayOrder: Number(record.display_order ?? Number.MAX_SAFE_INTEGER),
        } as ProgrammeMenuItem;
      })
      .filter((item): item is ProgrammeMenuItem => Boolean(item))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getProgrammeMenuLabel(programme: ProgrammeMenuItem): string {
    if (this.currentLang === 'hi') {
      return programme.nameHindi || programme.nameEnglish || programme.nameOdia;
    }

    if (this.currentLang === 'or') {
      return programme.nameOdia || programme.nameEnglish || programme.nameHindi;
    }

    return programme.nameEnglish || programme.nameHindi || programme.nameOdia;
  }

  private extractRecords(response: unknown): ProgrammeMasterRecord[] {
    if (Array.isArray(response)) {
      return response as ProgrammeMasterRecord[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const payload = response as {
      data?: unknown;
      programme_masters?: unknown;
      programmeMasters?: unknown;
      programme_master?: unknown;
      programmeMaster?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as ProgrammeMasterRecord[];
    }

    if (Array.isArray(payload.programme_masters)) {
      return payload.programme_masters as ProgrammeMasterRecord[];
    }

    if (Array.isArray(payload.programmeMasters)) {
      return payload.programmeMasters as ProgrammeMasterRecord[];
    }

    if (Array.isArray(payload.programme_master)) {
      return payload.programme_master as ProgrammeMasterRecord[];
    }

    if (Array.isArray(payload.programmeMaster)) {
      return payload.programmeMaster as ProgrammeMasterRecord[];
    }

    return [];
  }
}

interface ProgrammeMasterRecord {
  id?: number | string | null;
  programme_name?: string | null;
  programme_name_hindi?: string | null;
  programme_name_odia?: string | null;
  title?: string | null;
  display_order?: number | string | null;
}

interface ProgrammeMenuItem {
  id: string;
  nameEnglish: string;
  nameHindi: string;
  nameOdia: string;
  displayOrder: number;
}

interface OrganizationDetailsRecord {
  id?: number | string | null;
  phone_number?: string;
  phoneNumber?: string;
  phone?: string;
  email?: string;
  email_id?: string;
  emailId?: string;
  office_address?: string;
  officeAddress?: string;
  address?: string;
  office_address_hindi?: string;
  office_address_hi?: string;
  officeAddressHindi?: string;
  office_address_odia?: string;
  office_address_or?: string;
  officeAddressOdia?: string;
}
