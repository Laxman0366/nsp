import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { apiEndpoints } from 'src/app/api-endpoints';

@Component({
  selector: 'app-programme-category',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './programme-category.component.html',
  styleUrls: ['./programme-category.component.scss'],
})
export class ProgrammeCategoryComponent implements OnInit {
  programmeId = '';
  programmeName = 'Programme';
  isLoading = false;
  projects: ProgrammeProject[] = [];
  private currentLang: 'en' | 'hi' | 'or' = 'en';
  private selectedProgramme: ProgrammeRecord | null = null;
  private allProjectRecords: ProjectRecord[] = [];
  private readonly defaultProgrammeName = 'Programme';
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentLang = this.normalizeLanguage(this.translate.currentLang || this.translate.getDefaultLang() || 'en');

    this.subscriptions.add(
      this.translate.onLangChange.subscribe(({ lang }) => {
        this.currentLang = this.normalizeLanguage(lang);
        this.rebuildProgrammeView();
      })
    );

    this.subscriptions.add(this.route.paramMap.subscribe((params) => {
      const id = params.get('programmeId');
      this.programmeId = id || '';
      this.loadProgrammeProjects();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadProgrammeProjects(): void {
    if (!this.programmeId) {
      this.selectedProgramme = null;
      this.allProjectRecords = [];
      this.projects = [];
      this.programmeName = this.defaultProgrammeName;
      return;
    }

    this.isLoading = true;
    this.selectedProgramme = null;
    this.allProjectRecords = [];

    this.http.get<unknown>(apiEndpoints.programmeMasters).subscribe({
      next: (response) => {
        const programmes = this.extractArray(response);
        const selected = programmes.find((item) => String(item.id ?? '') === this.programmeId) as ProgrammeRecord | undefined;
        this.selectedProgramme = selected || null;
        this.rebuildProgrammeView();
      },
      error: () => {
        this.selectedProgramme = null;
        this.rebuildProgrammeView();
      },
    });

    this.http.get<unknown>(apiEndpoints.programmeDetails).subscribe({
      next: (response) => {
        this.allProjectRecords = this.extractArray(response) as ProjectRecord[];
        this.rebuildProgrammeView();
      },
      error: () => {
        this.allProjectRecords = [];
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
    selectedProgramme: ProgrammeRecord | null
  ): boolean {
    const projectProgrammeFk = project.programme_master_fk ?? project.Programme_master_fk;
    if (projectProgrammeFk !== null && projectProgrammeFk !== undefined && projectProgrammeFk !== '') {
      return String(projectProgrammeFk) === programmeId;
    }

    if (!selectedProgramme) {
      return false;
    }

    const programmeNames = [
      selectedProgramme.programme_name,
      selectedProgramme.programme_name_hindi,
      selectedProgramme.programme_name_odia,
      selectedProgramme.title,
    ]
      .map((value) => (value || '').trim().toLowerCase())
      .filter(Boolean);

    const projectNames = [project.programme_name, project.programme_name_hindi, project.programme_name_odia]
      .map((value) => (value || '').trim().toLowerCase())
      .filter(Boolean);

    return projectNames.some((projectName) => programmeNames.includes(projectName));
  }

  private rebuildProgrammeView(): void {
    this.programmeName = this.getLocalizedText(
      this.selectedProgramme?.programme_name,
      this.selectedProgramme?.programme_name_hindi,
      this.selectedProgramme?.programme_name_odia,
      this.selectedProgramme?.title,
      this.defaultProgrammeName
    );

    this.projects = this.allProjectRecords
      .filter((item) => this.matchesProgramme(item, this.programmeId, this.selectedProgramme))
      .map((item) => ({
        id: String(item.id ?? ''),
        projectName: this.getLocalizedText(
          item.project_name,
          item.project_name_hindi || item.project_name_hi,
          item.project_name_odia || item.project_name_or,
          'Untitled Project'
        ),
        projectText: this.getLocalizedText(
          item.project_details,
          item.project_details_hindi || item.project_details_hi,
          item.project_details_odia || item.project_details_or,
          item.achievement_details,
          item.achievement_details_hindi || item.achievement_details_hi,
          item.achievement_details_odia || item.achievement_details_or,
          'Project details will be updated soon.'
        ),
        details: this.getLocalizedText(
          item.achievement_details,
          item.achievement_details_hindi || item.achievement_details_hi,
          item.achievement_details_odia || item.achievement_details_or,
          item.project_details,
          item.project_details_hindi || item.project_details_hi,
          item.project_details_odia || item.project_details_or,
          'No additional details available.'
        ),
        featureImageUrl: this.toAssetUrl(item.image_path || ''),
        otherImageUrls: this.parseOtherImages(item.other_image_paths),
      }));
  }

  private getLocalizedText(
    english?: string | null,
    hindi?: string | null,
    odia?: string | null,
    ...fallbacks: Array<string | null | undefined>
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

    for (const fallback of fallbacks) {
      if (fallback && fallback.trim()) {
        return fallback;
      }
    }

    return '';
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
  programme_name_hindi?: string | null;
  programme_name_odia?: string | null;
  Programme_master_fk?: number | string | null;
  programme_master_fk?: number | string | null;
  project_name?: string | null;
  project_name_hindi?: string | null;
  project_name_hi?: string | null;
  project_name_odia?: string | null;
  project_name_or?: string | null;
  project_details?: string | null;
  project_details_hindi?: string | null;
  project_details_hi?: string | null;
  project_details_odia?: string | null;
  project_details_or?: string | null;
  achievement_details?: string | null;
  achievement_details_hindi?: string | null;
  achievement_details_hi?: string | null;
  achievement_details_odia?: string | null;
  achievement_details_or?: string | null;
  image_path?: string | null;
  other_image_paths?: string | null;
}

interface ProjectRecord extends GenericRecord {}

interface ProgrammeRecord extends GenericRecord {}

interface ProgrammeProject {
  id: string;
  projectName: string;
  projectText: string;
  details: string;
  featureImageUrl: string;
  otherImageUrls: string[];
}
