import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MaterialModule } from '../../../material.module';

interface PostOption {
  value: string;
  label: string;
}

interface EducationSection {
  key: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-apply-now',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './apply-now.component.html',
  styleUrls: ['./apply-now.component.scss']
})
export class ApplyNowComponent {
  private readonly fb = inject(UntypedFormBuilder);

  readonly postOptions: PostOption[] = [
    { value: 'programme-coordinator', label: 'Programme Coordinator' },
    { value: 'project-assistant', label: 'Project Assistant' },
    { value: 'field-officer', label: 'Field Officer' },
    { value: 'community-worker', label: 'Community Worker' },
  ];

  readonly educationSections: EducationSection[] = [
    { key: 'secondary', title: 'Secondary Matriculation', subtitle: 'Class 10 or equivalent' },
    { key: 'higherSecondary', title: 'Higher Secondary (10+2)', subtitle: 'Higher secondary qualification' },
    { key: 'graduation', title: 'Graduation', subtitle: 'Degree or equivalent' },
    { key: 'postGraduation', title: 'Post-Graduation', subtitle: 'Advanced degree or equivalent' },
    { key: 'other', title: 'Other Qualification', subtitle: 'Additional learning or certification' },
  ];

  readonly progressFields = [
    'post',
    'personal.registrationNumber',
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
    'personal.photo',
    'personal.signature',
    'secondary.nameOfQualificationAwarded',
    'secondary.boardUniversity',
    'secondary.subjectSpecialisation',
    'secondary.yearOfPassing',
    'secondary.passingCategory',
    'secondary.percentage',
    'secondary.certificate',
    'higherSecondary.nameOfQualificationAwarded',
    'higherSecondary.boardUniversity',
    'higherSecondary.subjectSpecialisation',
    'higherSecondary.yearOfPassing',
    'higherSecondary.passingCategory',
    'higherSecondary.percentage',
    'higherSecondary.certificate',
    'graduation.nameOfQualificationAwarded',
    'graduation.boardUniversity',
    'graduation.subjectSpecialisation',
    'graduation.yearOfPassing',
    'graduation.passingCategory',
    'graduation.percentage',
    'graduation.certificate',
    'postGraduation.nameOfQualificationAwarded',
    'postGraduation.boardUniversity',
    'postGraduation.subjectSpecialisation',
    'postGraduation.yearOfPassing',
    'postGraduation.passingCategory',
    'postGraduation.percentage',
    'postGraduation.certificate',
    'other.nameOfQualificationAwarded',
    'other.boardUniversity',
    'other.subjectSpecialisation',
    'other.yearOfPassing',
    'other.passingCategory',
    'other.percentage',
    'other.certificate',
    'employment.organization',
    'employment.designation',
    'employment.period',
    'employment.grossSalary',
    'employment.assignment',
    'computer.proficiency',
    'computer.tools',
    'references.reference1Name',
    'references.reference1Phone',
    'references.reference1Email',
    'references.reference2Name',
    'references.reference2Phone',
    'references.reference2Email',
    'declaration',
  ];

  photoPreview: string | null = null;
  signaturePreview: string | null = null;
  submitted = false;

  readonly form = this.fb.group({
    post: ['', Validators.required],
    personal: this.fb.group({
      registrationNumber: ['', Validators.required],
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
      photo: ['', Validators.required],
      signature: ['', Validators.required],
    }),
    secondary: this.createEducationGroup(),
    higherSecondary: this.createEducationGroup(),
    graduation: this.createEducationGroup(),
    postGraduation: this.createEducationGroup(),
    other: this.createEducationGroup(),
    employment: this.fb.group({
      organization: ['', Validators.required],
      designation: ['', Validators.required],
      period: ['', Validators.required],
      grossSalary: ['', Validators.required],
      assignment: ['', Validators.required],
    }),
    computer: this.fb.group({
      proficiency: ['', Validators.required],
      tools: ['', Validators.required],
    }),
    languages: this.fb.group({
      english: [false],
      odia: [false],
      hindi: [false],
    }),
    references: this.fb.group({
      reference1Name: ['', Validators.required],
      reference1Phone: ['', Validators.required],
      reference1Email: ['', [Validators.required, Validators.email]],
      reference2Name: ['', Validators.required],
      reference2Phone: ['', Validators.required],
      reference2Email: ['', [Validators.required, Validators.email]],
    }),
    declaration: [false, Validators.requiredTrue],
  });

  get selectedPostLabel(): string {
    const selectedValue = this.form.get('post')?.value as string;
    return this.postOptions.find((option) => option.value === selectedValue)?.label || '';
  }

  get progressPercent(): number {
    const total = this.progressFields.length;
    const filled = this.progressFields.filter((path) => {
      const value = this.form.get(path)?.value;
      return value !== null && value !== undefined && value !== '' && value !== false;
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
      nameOfQualificationAwarded: ['', Validators.required],
      boardUniversity: ['', Validators.required],
      subjectSpecialisation: ['', Validators.required],
      yearOfPassing: ['', Validators.required],
      passingCategory: ['', Validators.required],
      percentage: ['', Validators.required],
      certificate: ['', Validators.required],
    });
  }

  onPostChange(): void {
    const post = this.form.get('post')?.value as string;

    if (!post) {
      this.form.get('personal.registrationNumber')?.reset('');
      return;
    }

    const postCode = post
      .split('-')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
    const year = new Date().getFullYear();
    const stamp = Math.floor(100 + Math.random() * 900);

    this.form.get('personal.registrationNumber')?.setValue(`NSP-${postCode}-${year}-${stamp}`);
  }

  onFileSelected(event: Event, controlPath: string, previewTarget?: 'photo' | 'signature'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.form.get(controlPath)?.setValue(file.name);

    if (!previewTarget) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      if (previewTarget === 'photo') {
        this.photoPreview = null;
      } else {
        this.signaturePreview = null;
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
    } else {
      this.signaturePreview = null;
    }
  }

  submit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.form.markAsPristine();
  }

  resetForm(): void {
    this.form.reset();
    this.photoPreview = null;
    this.signaturePreview = null;
    this.submitted = false;
  }
}
