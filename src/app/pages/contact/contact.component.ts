import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { apiEndpoints } from '../../api-endpoints';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  private readonly http = inject(HttpClient);

  contactAddress = 'AT-Benagaon (Dayavihar), P.O-Gadasahi, P.S-Kanas, Dist-Puri, Odisha-752017';
  contactPhone = '9437524416';
  contactEmail = 'nspodisha@gmail.com';

  ngOnInit(): void {
    this.loadOrganizationDetails();
  }

  form = {
    name: '',
    email: '',
    message: '',
  };

  formError = '';
  submitInfo = '';

  submitContact(): void {
    this.formError = '';
    this.submitInfo = '';

    if (!this.form.name.trim() || !this.form.email.trim() || !this.form.message.trim()) {
      this.formError = 'Please fill in all fields before submitting.';
      return;
    }

    if (!this.isValidEmail(this.form.email)) {
      this.formError = 'Please enter a valid email address.';
      return;
    }

    const subject = `Contact form message from ${this.form.name.trim()}`;
    const body = [
      `Name: ${this.form.name.trim()}`,
      `Email: ${this.form.email.trim()}`,
      '',
      'Message:',
      this.form.message.trim(),
    ].join('\n');

    this.http.post('/api/send-mail', {
      subject,
      body,
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      message: this.form.message.trim(),
    }).subscribe({
      next: () => {
        this.submitInfo = 'Your message has been sent successfully.';
        this.form = {
          name: '',
          email: '',
          message: '',
        };
      },
      error: () => {
        this.formError = 'Unable to send your message right now. Please try again.';
      },
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  private loadOrganizationDetails(): void {
    this.http.get<unknown>(apiEndpoints.organizationDetailById(1)).subscribe({
      next: (response) => {
        const details = this.extractOrganizationDetails(response);
        if (!details) {
          return;
        }

        this.contactAddress =
          this.getOrganizationFieldValue(
            details.office_address,
            details.officeAddress,
            details.address
          ) || this.contactAddress;
        this.contactPhone =
          this.getOrganizationFieldValue(details.phone_number, details.phoneNumber, details.phone) ||
          this.contactPhone;
        this.contactEmail =
          this.getOrganizationFieldValue(details.email, details.email_id, details.emailId) ||
          this.contactEmail;
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

    const payload = response as {
      data?: unknown;
      organization_details?: unknown;
      organizationDetails?: unknown;
    };
    const candidates = [payload.data, payload.organization_details, payload.organizationDetails, response];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate.length ? (candidate[0] as OrganizationDetailsRecord) : null;
      }

      if (candidate && typeof candidate === 'object' && this.isOrganizationDetailsRecord(candidate)) {
        return candidate as OrganizationDetailsRecord;
      }
    }

    return null;
  }

  private isOrganizationDetailsRecord(value: unknown): boolean {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const details = value as OrganizationDetailsRecord;
    return Boolean(
      details.phone_number !== undefined ||
        details.phoneNumber !== undefined ||
        details.phone !== undefined ||
        details.email !== undefined ||
        details.email_id !== undefined ||
        details.emailId !== undefined ||
        details.office_address !== undefined ||
        details.officeAddress !== undefined ||
        details.address !== undefined
    );
  }

  private getOrganizationFieldValue(...values: Array<string | null | undefined>): string {
    for (const value of values) {
      if (typeof value === 'string' && value.trim()) {
        return value;
      }
    }

    return '';
  }
}

interface OrganizationDetailsRecord {
  phone_number?: string;
  phoneNumber?: string;
  phone?: string;
  email?: string;
  email_id?: string;
  emailId?: string;
  office_address?: string;
  officeAddress?: string;
  address?: string;
}
