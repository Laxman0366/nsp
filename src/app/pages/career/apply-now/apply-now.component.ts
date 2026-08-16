import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  ReactiveFormsModule,
  UntypedFormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { jsPDF } from 'jspdf';
import { firstValueFrom } from 'rxjs';
import { apiEndpoints } from '../../../api-endpoints';
import { MatSnackBar } from '@angular/material/snack-bar';

interface PostOption {
  value: string;
  label: string;
}

interface EducationSection {
  key: string;
  title: string;
  subtitle: string;
}

interface JobApplicationResponseData {
  application_number?: string;
  position_applied?: string;
  applicant_name?: string;
  father_name?: string;
  mother_name?: string;
  date_of_birth?: string;
  gender?: string;
  present_address?: string;
  permanent_address?: string;
  employer_organization?: string;
  designation?: string;
  employment_period?: string;
  grade_salary?: string;
  computer_skill_name?: string;
  computer_skill_tools_proficiency?: string;
  language_english?: number | boolean | string;
  language_hindi?: number | boolean | string;
  language_odia?: number | boolean | string;
  reference1_name?: string;
  reference1_phone?: string;
  reference2_name?: string;
  reference2_phone?: string;
  photograph_path?: string;
  signature_path?: string;
}

@Component({
  selector: 'app-apply-now',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, TranslateModule],
  templateUrl: './apply-now.component.html',
  styleUrls: ['./apply-now.component.scss'],
})
export class ApplyNowComponent {
  private readonly fb = inject(UntypedFormBuilder);
  private readonly http = inject(HttpClient);

  postOptions: PostOption[] = [];

  readonly educationSections: EducationSection[] = [
    {
      key: 'secondary',
      title: 'Secondary Matriculation',
      subtitle: 'Class 10 or equivalent',
    },
    {
      key: 'higherSecondary',
      title: 'Higher Secondary (10+2)',
      subtitle: 'Higher secondary qualification',
    },
    {
      key: 'graduation',
      title: 'Graduation',
      subtitle: 'Degree or equivalent',
    },
    {
      key: 'postGraduation',
      title: 'Post-Graduation',
      subtitle: 'Advanced degree or equivalent',
    },
    {
      key: 'other',
      title: 'Other Qualification',
      subtitle: 'Additional learning or certification',
    },
  ];

  readonly progressFields = [
    'post',
    'personal.applicantName',
    'personal.gender',
    'personal.maritalStatus',
    'personal.dob',
    'personal.email',
    'personal.mobileNo',
    'personal.fatherName',
    'personal.motherName',
    'personal.presentAddress',
    'personal.permanentAddress',
    'languages.english',
    'languages.odia',
    'languages.hindi',
    'declaration',
  ];

  photoPreview: string | null = null;
  signaturePreview: string | null = null;
  private photoFile: File | null = null;
  private signatureFile: File | null = null;
  submitted = false;

  readonly form = this.fb.group({
    applicationNumber: [''],
    post: ['', Validators.required],
    personal: this.fb.group({
      applicantName: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required, Validators.minLength(10)]],
      fatherName: ['', Validators.required],
      motherName: ['', Validators.required],
      presentAddress: ['', Validators.required],
      permanentAddress: ['', Validators.required],
      photo: [''],
      signature: [''],
    }),
    secondary: this.createEducationGroup(),
    higherSecondary: this.createEducationGroup(),
    graduation: this.createEducationGroup(),
    postGraduation: this.createEducationGroup(),
    other: this.createEducationGroup(),
    employment: this.fb.group({
      organization: [''],
      designation: [''],
      period: [''],
      grossSalary: [''],
      assignment: [''],
    }),
    computer: this.fb.group({
      proficiency: [''],
      tools: [''],
    }),
    languages: this.fb.group(
      {
        english: [false],
        odia: [false],
        hindi: [false],
      },
      { validators: [this.atLeastOneLanguageSelected] },
    ),
    references: this.fb.group({
      reference1Name: [''],
      reference1Phone: [''],
      reference1Email: ['', Validators.email],
      reference2Name: [''],
      reference2Phone: [''],
      reference2Email: ['', Validators.email],
    }),
    declaration: [false, Validators.requiredTrue],
  });

  constructor(
    private readonly snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.loadPostOptions();
  }

  get selectedPostLabel(): string {
    const selectedValue = this.form.get('post')?.value as string;
    return (
      this.postOptions.find((option) => option.value === selectedValue)
        ?.label || ''
    );
  }

  get progressPercent(): number {
    const total = this.progressFields.length;
    const filled = this.progressFields.filter((path) => {
      const value = this.form.get(path)?.value;
      return (
        value !== null && value !== undefined && value !== '' && value !== false
      );
    }).length;

    return Math.round((filled / total) * 100);
  }

  get uploadedCount(): number {
    return [this.photoPreview, this.signaturePreview].filter(Boolean).length;
  }

  get formReady(): boolean {
    return this.form.valid;
  }

  private createEducationGroup() {
    return this.fb.group({
      nameOfQualificationAwarded: [''],
      boardUniversity: [''],
      subjectSpecialisation: [''],
      yearOfPassing: [''],
      passingCategory: [''],
      percentage: [''],
      certificate: [''],
    });
  }

  private atLeastOneLanguageSelected(
    group: AbstractControl,
  ): ValidationErrors | null {
    const value = group.getRawValue() as {
      english?: boolean;
      odia?: boolean;
      hindi?: boolean;
    };
    return value.english || value.odia || value.hindi
      ? null
      : { requiredLanguage: true };
  }

  private loadPostOptions(): void {
    this.http.get<unknown>(apiEndpoints.opportunities).subscribe({
      next: (response) => {
        const opportunities = this.extractOpportunities(response);
        this.postOptions = opportunities
          .map((item) => item.name_of_post?.trim() || '')
          .filter(Boolean)
          .filter((name, index, all) => all.indexOf(name) === index)
          .map((name) => ({
            value: this.toPostValue(name),
            label: name,
          }));
      },
      error: () => {
        this.postOptions = [];
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

  private toPostValue(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  onFileSelected(
    event: Event,
    controlPath: string,
    previewTarget?: 'photo' | 'signature',
  ): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.form.get(controlPath)?.setValue(file.name);

    if (!previewTarget) {
      return;
    }

    if (previewTarget === 'photo') {
      this.photoFile = file;
    } else {
      this.signatureFile = file;
    }

    if (!file.type.startsWith('image/')) {
      if (previewTarget === 'photo') {
        this.photoPreview = null;
        this.photoFile = null;
      } else {
        this.signaturePreview = null;
        this.signatureFile = null;
      }

      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const preview = reader.result as string;
      if (previewTarget === 'photo') {
        this.photoPreview = preview;
      } else {
        this.signaturePreview = preview;
      }
    };
    reader.readAsDataURL(file);
  }

  removePreview(target: 'photo' | 'signature', controlPath: string): void {
    this.form.get(controlPath)?.reset('');
    if (target === 'photo') {
      this.photoPreview = null;
      this.photoFile = null;
    } else {
      this.signaturePreview = null;
      this.signatureFile = null;
    }
  }

  private async generateProfessionalResumePdf(
    application: JobApplicationResponseData,
  ): Promise<File> {
    const raw = this.form.getRawValue();
    const applicationData: any = application ?? {};
    const personal = raw.personal ?? {};
    const employment = raw.employment ?? {};
    const computer = raw.computer ?? {};
    const languages = raw.languages ?? {};
    const references = raw.references ?? {};
    const postLabel =
      application?.position_applied ||
      this.selectedPostLabel ||
      raw.post ||
      'Application';
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const photoWidth = 28;
    const applicationNumber =
      application?.application_number || raw.applicationNumber || '';
    const personalData = {
      applicantName: applicationData.applicant_name ?? personal.applicantName,
      fatherName: applicationData.father_name ?? personal.fatherName,
      motherName: applicationData.mother_name ?? personal.motherName,
      dob: applicationData.date_of_birth ?? personal.dob,
      gender: applicationData.gender ?? personal.gender,
      email: personal.email,
      mobileNo: personal.mobileNo,
      presentAddress: applicationData.present_address ?? personal.presentAddress,
      permanentAddress:
        applicationData.permanent_address ?? personal.permanentAddress,
      maritalStatus: personal.maritalStatus,
    };
    const employmentData = {
      organization:
        applicationData.employer_organization ?? employment.organization,
      designation: applicationData.designation ?? employment.designation,
      period: applicationData.employment_period ?? employment.period,
      grossSalary: applicationData.grade_salary ?? employment.grossSalary,
    };
    const computerData = {
      tools: applicationData.computer_skill_name ?? computer.tools,
      proficiency:
        applicationData.computer_skill_tools_proficiency ?? computer.proficiency,
    };
    const toLanguageFlag = (value: unknown): boolean => {
      if (typeof value === 'boolean') {
        return value;
      }

      if (typeof value === 'number') {
        return value === 1;
      }

      if (typeof value === 'string') {
        return value === '1' || value.toLowerCase() === 'true';
      }

      return false;
    };
    const languageData = {
      english: toLanguageFlag(applicationData.language_english) || !!languages.english,
      hindi: toLanguageFlag(applicationData.language_hindi) || !!languages.hindi,
      odia: toLanguageFlag(applicationData.language_odia) || !!languages.odia,
    };
    const referenceData = {
      reference1Name: applicationData.reference1_name ?? references.reference1Name,
      reference1Phone:
        applicationData.reference1_phone ?? references.reference1Phone,
      reference1Email: references.reference1Email,
      reference2Name: applicationData.reference2_name ?? references.reference2Name,
      reference2Phone:
        applicationData.reference2_phone ?? references.reference2Phone,
      reference2Email: references.reference2Email,
    };
    const photographPath =
      applicationData.photograph_path ?? personal.photo ?? '';
    const signaturePath =
      applicationData.signature_path ?? personal.signature ?? '';
    const sectionWidth = pageWidth - margin * 2;
    const fullSectionTable = (ratios: number[]): number[] => {
      const widths = ratios.map((ratio) => Math.floor(sectionWidth * ratio));
      const total = widths.reduce((sum, value) => sum + value, 0);
      widths[widths.length - 1] += sectionWidth - total;
      return widths;
    };
    const tableBorderColor = [105, 105, 105];

    const valueText = (value: unknown, fallback: string): string => {
      if (value === null || value === undefined || value === '') {
        return fallback;
      }
      return String(value);
    };
    const applicationRecord = applicationData as Record<string, unknown>;

    const getEducationValues = (
      apiPrefix: string,
      formKey: string,
    ): {
      nameOfQualificationAwarded: unknown;
      boardUniversity: unknown;
      yearOfPassing: unknown;
      percentage: unknown;
    } => {
      const formValues = raw[formKey] ?? {};
      return {
        nameOfQualificationAwarded:
          applicationRecord[`${apiPrefix}_qualification`] ??
          formValues.nameOfQualificationAwarded,
        boardUniversity:
          applicationRecord[`${apiPrefix}_university`] ?? formValues.boardUniversity,
        yearOfPassing:
          applicationRecord[`${apiPrefix}_passing_year`] ?? formValues.yearOfPassing,
        percentage:
          applicationRecord[`${apiPrefix}_percentage`] ?? formValues.percentage,
      };
    };

    const educationValueMap: Record<string, ReturnType<typeof getEducationValues>> = {
      secondary: getEducationValues('secondary', 'secondary'),
      higherSecondary: getEducationValues('higher_secondary', 'higherSecondary'),
      graduation: getEducationValues('graduation', 'graduation'),
      postGraduation: getEducationValues('post_graduation', 'postGraduation'),
      other: getEducationValues('other', 'other'),
    };

    let logoDataUrl: string | null = null;
    try {
      const response = await fetch('/assets/images/logos/nsp.jpeg');
      const blob = await response.blob();
      logoDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Unable to read logo image'));
        reader.readAsDataURL(blob);
      });
    } catch {
      logoDataUrl = null;
    }

    const addPageBreakIfNeeded = (y: number, need: number): number => {
      if (y + need > pageHeight - 20) {
        doc.addPage();
        return 18;
      }
      return y;
    };

    const drawCell = (
      x: number,
      y: number,
      w: number,
      h: number,
      label: string,
      value: string,
    ): void => {
      doc.setDrawColor(
        tableBorderColor[0],
        tableBorderColor[1],
        tableBorderColor[2],
      );
      doc.setLineWidth(0.35);
      doc.rect(x, y, w, h, 'S');
      doc.setFillColor(250, 250, 250);
      doc.rect(x, y, w, h, 'FD');
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.text(label, x + 1.8, y + 4);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.6);
      const wrappedValue = doc.splitTextToSize(value, Math.max(w - 6, 10));
      doc.text(wrappedValue, x + 1.8, y + 9.5);
    };

    const drawSection = (
      title: string,
      y: number,
      leftX: number,
      width: number,
    ): void => {
      doc.setFillColor(230, 230, 230);
      doc.setDrawColor(
        tableBorderColor[0],
        tableBorderColor[1],
        tableBorderColor[2],
      );
      doc.rect(leftX, y, width, 6, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(25, 25, 25);
      doc.text(title.toUpperCase(), leftX + 2, y + 4.2);
    };

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 52, 'F');

    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'JPEG', margin, 6, 22, 20);
    }

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Nilachala Seva Pratisthan', margin + 28, 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.6);
    const addressLines = doc.splitTextToSize(
      'AT-Benagaon(Dayavihar), P.O-Gadasahi, P.S-Kanas, Dist-Puri, Odisha-752017, Email-nspodisha@gmail.com.',
      pageWidth - margin * 2 - 30,
    );
    doc.text(addressLines, margin + 28, 20);

    doc.setDrawColor(160, 160, 160);
    doc.setLineWidth(0.4);
    doc.line(margin, 32, pageWidth - margin, 32);

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, 36, pageWidth - margin * 2, 10, 'F');
    doc.setDrawColor(90, 90, 90);
    doc.rect(margin, 36, pageWidth - margin * 2, 10, 'S');
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('APPLICATION FORM', pageWidth / 2, 43, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.7);
    doc.text(
      `Application Number: ${valueText(applicationNumber, 'Not selected')}`,
      margin + 2,
      49,
    );

    let yCursor = 52;

    const personalY = 52;
    const personalContentWidth = sectionWidth - photoWidth - 2;
    const personalLeftX = margin;
    const personalRightX = margin + personalContentWidth + 2;
    const fieldHeight = 12;
    const photoHeight = 30;

    drawSection('PERSONAL DETAILS', personalY, margin, sectionWidth);

    drawCell(
      personalLeftX,
      personalY + 7,
      personalContentWidth / 2,
      fieldHeight,
      'Application for the post of',
      valueText(postLabel, 'Not selected'),
    );
    drawCell(
      personalLeftX + personalContentWidth / 2,
      personalY + 7,
      personalContentWidth / 2,
      fieldHeight,
      'Name of applicant',
      valueText(personalData.applicantName, 'Not provided'),
    );
    drawCell(
      personalLeftX,
      personalY + 20,
      personalContentWidth / 2,
      fieldHeight,
      "Father's Name",
      valueText(personalData.fatherName, 'Not provided'),
    );
    drawCell(
      personalLeftX + personalContentWidth / 2,
      personalY + 20,
      personalContentWidth / 2,
      fieldHeight,
      "Mother's Name",
      valueText(personalData.motherName, 'Not provided'),
    );
    drawCell(
      personalLeftX,
      personalY + 33,
      personalContentWidth / 2,
      fieldHeight,
      'Date of Birth',
      valueText(personalData.dob, 'Not provided'),
    );
    drawCell(
      personalLeftX + personalContentWidth / 2,
      personalY + 33,
      personalContentWidth / 2,
      fieldHeight,
      'Gender',
      valueText(personalData.gender, 'Not provided'),
    );
    drawCell(
      personalLeftX,
      personalY + 46,
      personalContentWidth / 2,
      fieldHeight,
      'Email ID',
      valueText(personalData.email, 'Not provided'),
    );
    drawCell(
      personalLeftX + personalContentWidth / 2,
      personalY + 46,
      personalContentWidth / 2,
      fieldHeight,
      'Mobile No.',
      valueText(personalData.mobileNo, 'Not provided'),
    );
    drawCell(
      personalLeftX,
      personalY + 59,
      personalContentWidth / 2,
      fieldHeight,
      'Present Address',
      valueText(personalData.presentAddress, 'Not provided'),
    );
    drawCell(
      personalLeftX + personalContentWidth / 2,
      personalY + 59,
      personalContentWidth / 2,
      fieldHeight,
      'Permanent Address',
      valueText(personalData.permanentAddress, 'Not provided'),
    );
    drawCell(
      personalLeftX,
      personalY + 72,
      personalContentWidth / 2,
      fieldHeight,
      'Marital Status',
      valueText(personalData.maritalStatus, 'Not provided'),
    );
    drawCell(
      personalLeftX + personalContentWidth / 2,
      personalY + 72,
      personalContentWidth / 2,
      fieldHeight,
      'Home District',
      'Not provided',
    );

    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(
      tableBorderColor[0],
      tableBorderColor[1],
      tableBorderColor[2],
    );
    doc.rect(personalRightX, personalY + 7, photoWidth, photoHeight, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    if (this.photoPreview) {
      try {
        doc.addImage(
          this.photoPreview,
          'PNG',
          personalRightX,
          personalY + 7,
          28,
          30,
        );
      } catch {
        doc.text('Photo', personalRightX + 12, personalY + 23);
      }
    } else {
      doc.text('Photo', personalRightX + 12, personalY + 23);
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    yCursor = addPageBreakIfNeeded(personalY + 86, 34);
    drawSection('EDUCATIONAL DETAILS', yCursor, margin, pageWidth - margin * 2);
    yCursor += 7;

    const educationHeaders = [
      'Qualification',
      'Name of Qualification Awarded',
      'Board / University',
      'Year of Passing',
      'Percentage / Grade',
    ];
    const educationCellWidth = fullSectionTable([0.18, 0.28, 0.27, 0.14, 0.13]);
    let x = margin;
    educationHeaders.forEach((header, index) => {
      doc.setDrawColor(
        tableBorderColor[0],
        tableBorderColor[1],
        tableBorderColor[2],
      );
      doc.rect(x, yCursor, educationCellWidth[index], 8, 'S');
      doc.setFillColor(240, 240, 240);
      doc.rect(x, yCursor, educationCellWidth[index], 8, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text(header, x + 2, yCursor + 4.7);
      x += educationCellWidth[index];
    });
    yCursor += 8;

    this.educationSections.forEach((section) => {
      const values = educationValueMap[section.key] ?? {};
      const row = [
        section.title,
        valueText(values.nameOfQualificationAwarded, 'Not provided'),
        valueText(values.boardUniversity, 'Not provided'),
        valueText(values.yearOfPassing, 'Not provided'),
        valueText(values.percentage, 'Not provided'),
      ];
      x = margin;
      row.forEach((cellVal, index) => {
        const cellW = educationCellWidth[index];
        doc.setDrawColor(
          tableBorderColor[0],
          tableBorderColor[1],
          tableBorderColor[2],
        );
        doc.rect(x, yCursor, cellW, 8, 'S');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        const textLines = doc.splitTextToSize(cellVal, Math.max(cellW - 3, 8));
        doc.text(textLines, x + 2, yCursor + 3.8);
        x += cellW;
      });
      yCursor += 8;
      yCursor = addPageBreakIfNeeded(yCursor, 8);
    });

    yCursor = addPageBreakIfNeeded(yCursor + 2, 22);
    drawSection('EMPLOYMENT DETAILS', yCursor, margin, pageWidth - margin * 2);
    yCursor += 7;

    const employmentHeaders = [
      'Organization',
      'Designation',
      'Period',
      'Gross Salary',
    ];
    const employmentWidths = fullSectionTable([0.28, 0.33, 0.2, 0.19]);
    x = margin;
    employmentHeaders.forEach((header, index) => {
      doc.setDrawColor(
        tableBorderColor[0],
        tableBorderColor[1],
        tableBorderColor[2],
      );
      doc.rect(x, yCursor, employmentWidths[index], 8, 'S');
      doc.setFillColor(240, 240, 240);
      doc.rect(x, yCursor, employmentWidths[index], 8, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text(header, x + 2, yCursor + 4.7);
      x += employmentWidths[index];
    });
    yCursor += 8;

    x = margin;
    const employmentRow = [
      valueText(employmentData.organization, 'Not provided'),
      valueText(employmentData.designation, 'Not provided'),
      valueText(employmentData.period, 'Not provided'),
      valueText(employmentData.grossSalary, 'Not provided'),
    ];
    employmentRow.forEach((cellVal, index) => {
      doc.setDrawColor(
        tableBorderColor[0],
        tableBorderColor[1],
        tableBorderColor[2],
      );
      doc.rect(x, yCursor, employmentWidths[index], 10, 'S');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      const textLines = doc.splitTextToSize(
        cellVal,
        Math.max(employmentWidths[index] - 3, 8),
      );
      doc.text(textLines, x + 2, yCursor + 3.8);
      x += employmentWidths[index];
    });
    yCursor += 14;

    yCursor = addPageBreakIfNeeded(yCursor, 18);
    drawSection('COMPUTER LITERACY', yCursor, margin, pageWidth - margin * 2);
    yCursor += 7;
    const computerWidth = sectionWidth / 2;
    drawCell(
      margin,
      yCursor,
      computerWidth,
      12,
      'Package / Application',
      valueText(computerData.tools, 'Not provided'),
    );
    drawCell(
      margin + computerWidth,
      yCursor,
      computerWidth,
      12,
      'Proficiency Level',
      valueText(computerData.proficiency, 'Not provided'),
    );
    yCursor += 16;

    yCursor = addPageBreakIfNeeded(yCursor, 18);
    drawSection(
      'LANGUAGE PROFICIENCY',
      yCursor,
      margin,
      pageWidth - margin * 2,
    );
    yCursor += 7;
    const languageLabels = [
      'Language',
      'Ability to converse',
      'Ability to read',
      'Ability to write',
    ];
    const languageCellWidths = [52, 46, 46, 46];
    x = margin;
    languageLabels.forEach((label, index) => {
      doc.setDrawColor(
        tableBorderColor[0],
        tableBorderColor[1],
        tableBorderColor[2],
      );
      doc.rect(x, yCursor, languageCellWidths[index], 8, 'S');
      doc.setFillColor(240, 240, 240);
      doc.rect(x, yCursor, languageCellWidths[index], 8, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text(label, x + 2, yCursor + 4.7);
      x += languageCellWidths[index];
    });
    yCursor += 8;

    const languageRows = [
      [
        'English',
        languageData.english ? 'Yes' : 'No',
        languageData.english ? 'Yes' : 'No',
        languageData.english ? 'Yes' : 'No',
      ],
      [
        'Hindi',
        languageData.hindi ? 'Yes' : 'No',
        languageData.hindi ? 'Yes' : 'No',
        languageData.hindi ? 'Yes' : 'No',
      ],
      [
        'Odia',
        languageData.odia ? 'Yes' : 'No',
        languageData.odia ? 'Yes' : 'No',
        languageData.odia ? 'Yes' : 'No',
      ],
    ];
    languageRows.forEach((row) => {
      x = margin;
      row.forEach((cellVal, index) => {
        doc.setDrawColor(
          tableBorderColor[0],
          tableBorderColor[1],
          tableBorderColor[2],
        );
        doc.rect(x, yCursor, languageCellWidths[index], 8, 'S');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(cellVal, x + 2, yCursor + 5.2);
        x += languageCellWidths[index];
      });
      yCursor += 8;
    });

    yCursor = addPageBreakIfNeeded(yCursor + 2, 26);
    drawSection('REFERENCE DETAILS', yCursor, margin, pageWidth - margin * 2);
    yCursor += 7;
    const referenceWidth = fullSectionTable([0.34, 0.22, 0.44]);
    drawCell(
      margin,
      yCursor,
      referenceWidth[0],
      12,
      'Name',
      valueText(referenceData.reference1Name, 'Not provided'),
    );
    drawCell(
      margin + referenceWidth[0],
      yCursor,
      referenceWidth[1],
      12,
      'Phone',
      valueText(referenceData.reference1Phone, 'Not provided'),
    );
    drawCell(
      margin + referenceWidth[0] + referenceWidth[1],
      yCursor,
      referenceWidth[2],
      12,
      'Email',
      valueText(referenceData.reference1Email, 'Not provided'),
    );
    yCursor += 14;
    drawCell(
      margin,
      yCursor,
      referenceWidth[0],
      12,
      'Name',
      valueText(referenceData.reference2Name, 'Not provided'),
    );
    drawCell(
      margin + referenceWidth[0],
      yCursor,
      referenceWidth[1],
      12,
      'Phone',
      valueText(referenceData.reference2Phone, 'Not provided'),
    );
    drawCell(
      margin + referenceWidth[0] + referenceWidth[1],
      yCursor,
      referenceWidth[2],
      12,
      'Email',
      valueText(referenceData.reference2Email, 'Not provided'),
    );

    yCursor += 20;
    yCursor = addPageBreakIfNeeded(yCursor, 18);
    doc.setDrawColor(
      tableBorderColor[0],
      tableBorderColor[1],
      tableBorderColor[2],
    );
    doc.rect(margin, yCursor, pageWidth - margin * 2, 20, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Declaration:', margin + 2, yCursor + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    const declarationText =
      'I hereby declare that the information furnished is correct and complete to the best of my knowledge and belief and nothing has been concealed or distorted.';
    const declarationLines = doc.splitTextToSize(
      declarationText,
      pageWidth - margin * 2 - 8,
    );
    doc.text(declarationLines, margin + 2, yCursor + 11);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('Place:', margin + 2, pageHeight - 20);
    doc.text('Date:', margin + 2, pageHeight - 14);
    doc.text('Signature of the Applicant:', margin + 120, pageHeight - 20);

    if (this.signaturePreview) {
      try {
        doc.addImage(
          this.signaturePreview,
          'PNG',
          margin + 126,
          pageHeight - 38,
          30,
          10,
        );
      } catch {
        // ignore signature image rendering issues
      }
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    const safeName = (personalData.applicantName || 'applicant')
      .toString()
      .replace(/\s+/g, '_');
    const fileName = `${safeName}_application_form.pdf`;
    doc.save(fileName);
    return new File([doc.output('blob')], fileName, {
      type: 'application/pdf',
    });
  }

  private extractUploadedFilePath(response: unknown): string {
    if (typeof response === 'string') {
      return response;
    }

    if (!response || typeof response !== 'object') {
      return '';
    }

    const payload = response as {
      file_path?: unknown;
      path?: unknown;
      data?: {
        file_path?: unknown;
        path?: unknown;
      };
    };

    if (typeof payload.file_path === 'string') {
      return payload.file_path;
    }

    if (typeof payload.path === 'string') {
      return payload.path;
    }

    if (payload.data && typeof payload.data === 'object') {
      if (typeof payload.data.file_path === 'string') {
        return payload.data.file_path;
      }

      if (typeof payload.data.path === 'string') {
        return payload.data.path;
      }
    }

    return '';
  }

  private async uploadFile(file: File): Promise<string> {
    const uploadPayload = new FormData();
    uploadPayload.append('file', file);
    uploadPayload.append('folder', 'job_applications');
    const response = await firstValueFrom(
      this.http.post<unknown>(apiEndpoints.upload, uploadPayload),
    );
    const filePath = this.extractUploadedFilePath(response);
    if (!filePath) {
      throw new Error(`Uploaded file path was missing for ${file.name}.`);
    }
    return filePath;
  }

  private createApplicationPayload(
    raw: ReturnType<typeof this.form.getRawValue>,
    photographPath: string,
    signaturePath: string,
  ): Record<string, unknown> {
    const education = (
      formKey: string,
      apiKey: string,
    ): Record<string, unknown> => {
      const values = raw[formKey] ?? {};
      return {
        [`${apiKey}_qualification`]: values.nameOfQualificationAwarded || '',
        [`${apiKey}_university`]: values.boardUniversity || '',
        [`${apiKey}_specialisation`]: values.subjectSpecialisation || '',
        [`${apiKey}_passing_year`]: values.yearOfPassing || '',
        [`${apiKey}_percentage`]: values.percentage || '',
        [`${apiKey}_passing_category`]: values.passingCategory || '',
      };
    };

    return {
      application_number: raw.applicationNumber || '',
      position_applied: this.selectedPostLabel || raw.post || '',
      applicant_name: raw.personal?.applicantName || '',
      email: raw.personal?.email || '',
      mobile_no: raw.personal?.mobileNo || '',
      gender: raw.personal?.gender || '',
      marital_status: raw.personal?.maritalStatus || '',
      date_of_birth: raw.personal?.dob || '',
      father_name: raw.personal?.fatherName || '',
      mother_name: raw.personal?.motherName || '',
      guardian_name: '',
      present_address: raw.personal?.presentAddress || '',
      permanent_address: raw.personal?.permanentAddress || '',
      photograph_path: photographPath,
      signature_path: signaturePath,
      ...education('secondary', 'secondary'),
      ...education('higherSecondary', 'higher_secondary'),
      ...education('graduation', 'graduation'),
      ...education('postGraduation', 'post_graduation'),
      ...education('other', 'other'),
      employer_organization: raw.employment?.organization || '',
      designation: raw.employment?.designation || '',
      employment_period: raw.employment?.period || '',
      grade_salary: raw.employment?.grossSalary || '',
      job_description: raw.employment?.assignment || '',
      computer_skill_name: raw.computer?.tools || '',
      computer_skill_tools_proficiency: raw.computer?.proficiency || '',
      language_english: raw.languages?.english ? 1 : 0,
      language_odia: raw.languages?.odia ? 1 : 0,
      language_hindi: raw.languages?.hindi ? 1 : 0,
      reference1_name: raw.references?.reference1Name || '',
      reference1_phone: raw.references?.reference1Phone || '',
      reference1_email: raw.references?.reference1Email || '',
      reference2_name: raw.references?.reference2Name || '',
      reference2_phone: raw.references?.reference2Phone || '',
      reference2_email: raw.references?.reference2Email || '',
    };
  }

  async submit(): Promise<void> {
    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    try {
      const raw = this.form.getRawValue();
      const [photographPath, signaturePath] = await Promise.all([
        this.photoFile ? this.uploadFile(this.photoFile) : Promise.resolve(''),
        this.signatureFile
          ? this.uploadFile(this.signatureFile)
          : Promise.resolve(''),
      ]);
      const payload = this.createApplicationPayload(
        raw,
        photographPath,
        signaturePath,
      );
      this.http.post<unknown>(apiEndpoints.jobApplications, payload).subscribe({
        next: async (response:any) => {
          const pdfFile = await this.generateProfessionalResumePdf(response.data);
          const generatedResumeFilePath = await this.uploadFile(pdfFile);
          this.http.post<unknown>(apiEndpoints.jobApplicationResumes, { file_path: generatedResumeFilePath, job_applications_fk: response.data?.id }).subscribe({
            next: async (response:any) => {
              this.resetForm();
              this.showSuccessToast('Application submitted successfully.');
            }
          });
        },
        error: () => {
          this.showErrorToast('Failed to submit the application. Please try again later.');
        },
      });
      this.form.markAsPristine();
    } catch {
      this.form.markAsDirty();
    }
  }

  private showToast(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }

  private showSuccessToast(message: string): void {
    this.showToast(message, 'success-toast');
  }

  private showErrorToast(message: string): void {
    this.showToast(message, 'error-toast');
  }

  resetForm(): void {
    this.form.reset();
    this.photoPreview = null;
    this.signaturePreview = null;
    this.photoFile = null;
    this.signatureFile = null;
    this.submitted = false;
  }
}

interface OpportunityItem {
  name_of_post?: string | null;
}
