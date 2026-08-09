import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
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
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, TranslateModule, RouterModule],
  templateUrl: './career-opportunities.component.html',
  styleUrls: ['./career-opportunities.component.scss']
})
export class CareerOpportunitiesComponent implements OnInit {
  opportunities: OpportunityItem[] = [];
  isLoading = false;
  hasLoaded = false;

  constructor(private readonly http: HttpClient) {}

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
}
