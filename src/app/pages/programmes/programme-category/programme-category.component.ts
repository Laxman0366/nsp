import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { apiEndpoints } from 'src/app/api-endpoints';

@Component({
  selector: 'app-programme-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './programme-category.component.html',
  styleUrls: ['./programme-category.component.scss'],
})
export class ProgrammeCategoryComponent implements OnInit {
  programmeId = '';
  programmeName = 'Programme';
  isLoading = false;
  projects: ProgrammeProject[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('programmeId');
      this.programmeId = id || '';
      this.loadProgrammeProjects();
    });
  }

  private loadProgrammeProjects(): void {
    if (!this.programmeId) {
      this.projects = [];
      return;
    }

    this.isLoading = true;

    this.http.get<unknown>(apiEndpoints.programmeMasters).subscribe({
      next: (response) => {
        const programmes = this.extractArray(response);
        const selected = programmes.find((item) => String(item.id ?? '') === this.programmeId);
        this.programmeName = selected?.programme_name || selected?.title || 'Programme';
      },
      error: () => {
        this.programmeName = 'Programme';
      },
    });

    this.http.get<unknown>(apiEndpoints.programmeDetails).subscribe({
      next: (response) => {
        const allProjects = this.extractArray(response);
        this.projects = allProjects
          .filter((item) => this.matchesProgramme(item, this.programmeId, this.programmeName))
          .map((item) => ({
            id: String(item.id ?? ''),
            projectName: item.project_name || 'Untitled Project',
            projectText: item.project_details || item.achievement_details || 'Project details will be updated soon.',
            details: item.achievement_details || item.project_details || 'No additional details available.',
            featureImageUrl: this.toAssetUrl(item.image_path || ''),
            otherImageUrls: this.parseOtherImages(item.other_image_paths),
          }));
      },
      error: () => {
        this.projects = [];
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private matchesProgramme(
    project: ProjectRecord,
    programmeId: string,
    programmeName: string
  ): boolean {
    const projectProgrammeFk = project.programme_master_fk ?? project.Programme_master_fk;
    if (projectProgrammeFk !== null && projectProgrammeFk !== undefined && projectProgrammeFk !== '') {
      return String(projectProgrammeFk) === programmeId;
    }

    if (!programmeName) {
      return false;
    }

    return (project.programme_name || '').trim().toLowerCase() === programmeName.trim().toLowerCase();
  }

  private extractArray(payload: unknown): GenericRecord[] {
    if (Array.isArray(payload)) {
      return payload as GenericRecord[];
    }

    if (!payload || typeof payload !== 'object') {
      return [];
    }

    const response = payload as {
      data?: unknown;
      programme_masters?: unknown;
      programme_master?: unknown;
      programmeMasters?: unknown;
      programmeMaster?: unknown;
      projects?: unknown;
      project?: unknown;
      programme_details?: unknown;
      programmeDetails?: unknown;
    };

    if (Array.isArray(response.data)) {
      return response.data as GenericRecord[];
    }

    if (Array.isArray(response.projects)) {
      return response.projects as GenericRecord[];
    }

    if (Array.isArray(response.programme_details)) {
      return response.programme_details as GenericRecord[];
    }

    if (Array.isArray(response.programmeDetails)) {
      return response.programmeDetails as GenericRecord[];
    }

    if (Array.isArray(response.programme_masters)) {
      return response.programme_masters as GenericRecord[];
    }

    if (Array.isArray(response.programmeMasters)) {
      return response.programmeMasters as GenericRecord[];
    }

    if (Array.isArray(response.programme_master)) {
      return response.programme_master as GenericRecord[];
    }

    if (Array.isArray(response.programmeMaster)) {
      return response.programmeMaster as GenericRecord[];
    }

    if (Array.isArray(response.project)) {
      return response.project as GenericRecord[];
    }

    return [];
  }

  private parseOtherImages(raw: string | null | undefined): string[] {
    if (!raw) {
      return [];
    }

    return raw
      .split(',')
      .map((item) => item.trim())
      .filter((item) => Boolean(item))
      .map((path) => this.toAssetUrl(path));
  }

  private toAssetUrl(path: string): string {
    if (!path) {
      return '';
    }

    return apiEndpoints.publicAsset(path);
  }
}

interface GenericRecord {
  id?: number | string | null;
  title?: string | null;
  programme_name?: string | null;
  Programme_master_fk?: number | string | null;
  programme_master_fk?: number | string | null;
  project_name?: string | null;
  project_details?: string | null;
  achievement_details?: string | null;
  image_path?: string | null;
  other_image_paths?: string | null;
}

interface ProjectRecord extends GenericRecord {}

interface ProgrammeProject {
  id: string;
  projectName: string;
  projectText: string;
  details: string;
  featureImageUrl: string;
  otherImageUrls: string[];
}
