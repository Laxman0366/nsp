import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { apiEndpoints } from '../../../api-endpoints';

interface OpportunityItem {
  id?: number | string | null;
  name_of_post?: string | null;
  req_qualification?: string | null;
  number_of_post?: number | string | null;
  remuneration?: string | null;
  lower_age?: number | null;
  upper_age?: number | null;
  closing_date?: string | null;
  apply_link?: string | null;
}

@Component({
  selector: 'app-career-opportunities',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, FormsModule, TranslateModule, RouterModule],
  templateUrl: './career-opportunities.component.html',
  styleUrls: ['./career-opportunities.component.scss']
})
export class CareerOpportunitiesComponent implements OnInit {
  opportunities: OpportunityItem[] = [];
  isLoading = false;
  hasLoaded = false;

  // Form fields
  applicationForm = {
    name: '',
    email: '',
    phone: '',
    description: '',
    resume_path: '',
  };
  isSubmitting = false;
  uploadedFileName = 'No file chosen';

  constructor(private readonly http: HttpClient, private readonly snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.http.get<unknown>(apiEndpoints.opportunities).subscribe({
      next: (response) => {
        this.opportunities = this.extractOpportunities(response);
        this.hasLoaded = true;
        this.isLoading = false;
      },
      error: () => {
        this.opportunities = [];
        this.hasLoaded = true;
        this.isLoading = false;
      },
    });
  }

  private extractOpportunities(response: unknown): OpportunityItem[] {
    if (Array.isArray(response)) {
      return response as OpportunityItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const payload = response as {
      data?: unknown;
      opportunities?: unknown;
      opportunitiesList?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as OpportunityItem[];
    }

    if (Array.isArray(payload.opportunities)) {
      return payload.opportunities as OpportunityItem[];
    }

    if (Array.isArray(payload.opportunitiesList)) {
      return payload.opportunitiesList as OpportunityItem[];
    }

    return [];
  }

  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) {
      return;
    }

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<unknown>(apiEndpoints.upload, formData).subscribe({
      next: (response) => {
        const filePath = this.extractFilePath(response);
        if (filePath) {
          this.applicationForm.resume_path = filePath;
          this.uploadedFileName = file.name;
        }
      },
      error: () => {
        this.snackBar.open('Failed to upload resume. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-toast'],
        });
      },
    });
  }

  private extractFilePath(response: unknown): string | null {
    if (!response || typeof response !== 'object') {
      return null;
    }

    const payload = response as {
      file_path?: string;
      filePath?: string;
      path?: string;
      data?: {
        file_path?: string;
        filePath?: string;
        path?: string;
      };
    };

    return (
      payload.file_path ||
      payload.filePath ||
      payload.path ||
      payload.data?.file_path ||
      payload.data?.filePath ||
      payload.data?.path ||
      null
    );
  }

  onSubmitApplication(): void {
    // Validate form
    if (!this.applicationForm.name.trim()) {
      this.snackBar.open('Please enter your full name', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['warn-toast'],
      });
      return;
    }
    if (!this.applicationForm.email.trim()) {
      this.snackBar.open('Please enter your email address', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['warn-toast'],
      });
      return;
    }
    if (!this.applicationForm.phone.trim()) {
      this.snackBar.open('Please enter your phone number', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['warn-toast'],
      });
      return;
    }
    if (!this.applicationForm.description.trim()) {
      this.snackBar.open('Please describe your experience', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['warn-toast'],
      });
      return;
    }
    if (!this.applicationForm.resume_path.trim()) {
      this.snackBar.open('Please upload your resume', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['warn-toast'],
      });
      return;
    }

    this.isSubmitting = true;

    const payload = {
      name: this.applicationForm.name.trim(),
      email: this.applicationForm.email.trim(),
      phone: this.applicationForm.phone.trim(),
      description: this.applicationForm.description.trim(),
      resume_path: this.applicationForm.resume_path.trim(),
    };

    this.http.post<unknown>(apiEndpoints.careerApplications, payload).subscribe({
      next: () => {
        this.snackBar.open('Application submitted successfully! We will review it and get back to you soon.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-toast'],
        });
        this.resetForm();
        this.isSubmitting = false;
      },
      error: () => {
        this.snackBar.open('Failed to submit application. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-toast'],
        });
        this.isSubmitting = false;
      },
    });
  }

  private resetForm(): void {
    this.applicationForm = {
      name: '',
      email: '',
      phone: '',
      description: '',
      resume_path: '',
    };
    this.uploadedFileName = 'No file chosen';
  }
}
