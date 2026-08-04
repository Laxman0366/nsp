import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { apiEndpoints } from 'src/app/api-endpoints';

@Component({
  selector: 'app-full',
  imports: [RouterModule, MaterialModule, CommonModule],
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FullComponent implements OnInit {
  openDropdown: string | null = null;
  programmeMenuItems: ProgrammeMenuItem[] = [];
  isProgrammeMenuLoading = false;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadProgrammeMenuItems();
  }

  toggleDropdown(menu: string) {
    this.openDropdown = this.openDropdown === menu ? null : menu;
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

  private extractProgrammeMenuItems(response: unknown): ProgrammeMenuItem[] {
    const records = this.extractRecords(response);

    return records
      .map((record) => {
        const id = record.id;
        const name = record.programme_name || record.title || '';

        if ((id === null || id === undefined || id === '') || !name) {
          return null;
        }

        return {
          id: String(id),
          name,
          displayOrder: Number(record.display_order ?? Number.MAX_SAFE_INTEGER),
        } as ProgrammeMenuItem;
      })
      .filter((item): item is ProgrammeMenuItem => Boolean(item))
      .sort((a, b) => a.displayOrder - b.displayOrder);
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
  title?: string | null;
  display_order?: number | string | null;
}

interface ProgrammeMenuItem {
  id: string;
  name: string;
  displayOrder: number;
}
