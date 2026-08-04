import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { apiEndpoints } from '../api-endpoints';
import { MaterialModule } from '../material.module';
import { AdminField, AdminFieldOption, AdminPageDefinition, AdminTableColumn, AdminTableRow } from './admin-data';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [MaterialModule, FormsModule, QuillModule],
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss'],
})
export class AdminContentComponent implements OnInit {
  readonly page: AdminPageDefinition;
  private readonly annualReportsApiUrl = apiEndpoints.annualReports;
  isSavingAnnualReport = false;
  isUploadingAnnualReportFile = false;
  readonly quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'clean'],
    ],
  };
  private editingAnnualReportId: string | number | null = null;
  programmeMasterOptions: AdminFieldOption[] = [];
  projectOptions: AdminFieldOption[] = [];

  private annualReportForm: AnnualReportFormState = {
    programmeMasterFk: '',
    projectFk: '',
    programmeName: '',
    projectName: '',
    projectDetails: '',
    achievementDetails: '',
    startingYear: '',
    supportedBy: '',
    status: '',
    strength: '',
    beneficiariesCovered: '',
    title: '',
    subTitle: '',
    altText: '',
    imagePath: '',
    otherImagePaths: '',
    beneficiaryName: '',
    details: '',
    dateTime: '',
    noOfBeneficiaries: '',
    displayOrder: '',
    isActive: true,
    file: null,
    existingFileName: '',
    existingFilePath: '',
    existingFileUrl: '',
    uploadedFilePath: '',
    otherFile: null,
    otherExistingFileName: '',
    otherExistingFilePath: '',
    otherExistingFileUrl: '',
    otherUploadedFilePath: '',
    hasNewUploadedFile: false,
    hasNewOtherUploadedFile: false,
  };

  constructor(
    route: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly snackBar: MatSnackBar
  ) {
    this.page = route.snapshot.data['page'] as AdminPageDefinition;
  }

  ngOnInit(): void {
    if (this.isProgrammeDetailsPage() || this.isProgrammeOverviewPage()) {
      this.loadProgrammeMasterOptions();
    }

    if (this.isProgrammeOverviewPage()) {
      this.loadProjectOptions();
    }

    if (this.isReportPage() && this.page.table) {
      this.loadAnnualReportRows();
    }
  }

  getFieldOptions(field: AdminField): AdminFieldOption[] {
    if (field.label === 'programme_name' && (this.isProgrammeDetailsPage() || this.isProgrammeOverviewPage())) {
      return this.programmeMasterOptions;
    }

    if (field.label === 'project_name' && this.isProgrammeOverviewPage()) {
      return this.projectOptions;
    }

    return field.options || [];
  }

  isProgrammeDetailsRichTextField(label: string): boolean {
    if (!this.isProgrammeDetailsPage()) {
      return false;
    }

    return label === 'project_details' || label === 'achievement_details';
  }

  fieldClass(span?: 1 | 2 | 3 | 4): string {
    return span ? `span-${span}` : '';
  }

  rowClass(type?: string): string {
    return type ? `status-${type}` : '';
  }

  getTableColumns(): AdminTableColumn[] {
    if (!this.page.table) {
      return [];
    }

    const columns = this.page.table.columns || [];
    const nonActionColumns = columns.filter((column) => column.key !== 'action');
    const actionColumn = columns.find((column) => column.key === 'action');
    const normalizedActionColumn: AdminTableColumn = actionColumn
      ? { ...actionColumn, label: '' }
      : { key: 'action', label: '' };

    return [
      ...nonActionColumns,
      normalizedActionColumn,
    ];
  }

  onEditRow(row: AdminTableRow): void {
    if (!this.isReportPage()) {
      return;
    }

    const reportId = row['id'];
    if (reportId === null || reportId === undefined || reportId === '') {
      return;
    }

    if (typeof reportId !== 'string' && typeof reportId !== 'number') {
      return;
    }

    this.http.get<unknown>(this.getReportByIdApiUrl(reportId)).subscribe({
      next: (response) => {
        const report = this.extractReport(response);
        if (!report) {
          this.showToast(`Failed to load ${this.getReportLabel()} details.`, 'error-toast');
          return;
        }

        this.annualReportForm = {
          programmeMasterFk: this.resolveProgrammeMasterSelectionValue(report),
          projectFk: this.resolveProjectSelectionValue(report),
          programmeName: report.programme_name || '',
          projectName: report.project_name || '',
          projectDetails: report.project_details || '',
          achievementDetails: report.achievement_details || '',
          startingYear:
            report.starting_year === null || report.starting_year === undefined
              ? ''
              : String(report.starting_year),
          supportedBy: report.supported_by || '',
          status: report.status || '',
          strength:
            report.strength === null || report.strength === undefined ? '' : String(report.strength),
          beneficiariesCovered:
            report.beneficiaries_covered === null || report.beneficiaries_covered === undefined
              ? ''
              : String(report.beneficiaries_covered),
          title: report.title || report.project_name || '',
          subTitle: report.sub_title || '',
          altText: report.alt_text || '',
          imagePath: report.image_path || '',
          otherImagePaths: report.other_image_paths || '',
          beneficiaryName: report.beneficiary_name || '',
          details: report.details || '',
          dateTime: this.toDateTimeLocalValue(report.date_time),
          noOfBeneficiaries:
            report.no_of_beneficiaries === null || report.no_of_beneficiaries === undefined
              ? ''
              : String(report.no_of_beneficiaries),
          displayOrder: report.display_order === null || report.display_order === undefined
            ? ''
            : String(report.display_order),
          isActive: this.toBoolean(report.is_active),
          file: null,
          existingFileName: this.resolveExistingFileName(report),
          existingFilePath:
            report.video_path ||
            report.image_path ||
            report.file_path ||
            report.file_url ||
            report.download_url ||
            report.file ||
            '',
          existingFileUrl: this.resolveExistingFileUrl(report),
          uploadedFilePath: '',
          otherFile: null,
          otherExistingFileName: this.resolveOtherExistingFileName(report),
          otherExistingFilePath: report.other_image_paths || '',
          otherExistingFileUrl: this.resolveOtherExistingFileUrl(report),
          otherUploadedFilePath: '',
          hasNewUploadedFile: false,
          hasNewOtherUploadedFile: false,
        };
        this.editingAnnualReportId = report.id ?? reportId;
      },
      error: () => {
        this.showToast(`Failed to load ${this.getReportLabel()} details.`, 'error-toast');
      },
    });
  }

  onDeleteRow(row: AdminTableRow): void {
    if (!this.isReportPage()) {
      return;
    }

    const reportId = row['id'];
    if (reportId === null || reportId === undefined || reportId === '') {
      return;
    }

    if (typeof reportId !== 'string' && typeof reportId !== 'number') {
      return;
    }

    this.http.delete(this.getReportByIdApiUrl(reportId)).subscribe({
      next: () => {
        this.loadAnnualReportRows();
        this.showToast(`${this.getReportLabelCapitalized()} deleted successfully.`, 'success-toast');
      },
      error: () => {
        this.showToast(`Failed to delete ${this.getReportLabel()}.`, 'error-toast');
      },
    });
  }

  isAnnualReportFormValid(): boolean {
    if (this.isProgrammeOverviewPage()) {
      return Boolean(
        this.annualReportForm.programmeMasterFk.trim() &&
          this.annualReportForm.projectFk.trim() &&
          /^\d{4}$/.test(this.annualReportForm.startingYear.trim()) &&
          this.annualReportForm.supportedBy.trim() &&
          this.annualReportForm.status.trim() &&
          this.annualReportForm.strength.trim() &&
          this.annualReportForm.beneficiariesCovered.trim() &&
          this.annualReportForm.displayOrder.trim()
      );
    }

    if (this.isProgrammeDetailsPage()) {
      return Boolean(
        this.annualReportForm.programmeMasterFk.trim() &&
          this.annualReportForm.projectName.trim() &&
          this.annualReportForm.projectDetails.trim() &&
          this.annualReportForm.achievementDetails.trim() &&
          this.getAnnualReportFilePathForSave('image_path') &&
          this.annualReportForm.displayOrder.trim()
      );
    }

    if (this.isProgrammeMasterPage()) {
      return Boolean(
        this.annualReportForm.title.trim() && this.annualReportForm.displayOrder.trim()
      );
    }

    if (this.isBannerPage()) {
      const hasBannerImagePath =
        Boolean(this.getAnnualReportFilePathForSave()) ||
        Boolean(this.annualReportForm.file) ||
        Boolean(this.editingAnnualReportId);

      return Boolean(
        this.annualReportForm.title.trim() &&
          this.annualReportForm.displayOrder.trim() &&
          hasBannerImagePath
      );
    }

    if (this.isSuccessStoryPage()) {
      return Boolean(
        this.annualReportForm.title.trim() &&
          this.annualReportForm.beneficiaryName.trim() &&
          this.annualReportForm.details.trim() &&
          this.annualReportForm.displayOrder.trim() &&
          this.getAnnualReportFilePathForSave()
      );
    }

    if (this.isMediaCoveragePage()) {
      return Boolean(
        this.annualReportForm.title.trim() &&
          this.annualReportForm.dateTime.trim() &&
          this.annualReportForm.displayOrder.trim() &&
          this.getAnnualReportFilePathForSave()
      );
    }

    if (this.isAwardsRecognitionPage()) {
      return Boolean(
        this.annualReportForm.title.trim() &&
          this.annualReportForm.dateTime.trim() &&
          this.annualReportForm.displayOrder.trim() &&
          this.getAnnualReportFilePathForSave()
      );
    }

    if (this.isImageGalleryPage()) {
      return Boolean(
        this.annualReportForm.title.trim() &&
          this.annualReportForm.displayOrder.trim() &&
          this.getAnnualReportFilePathForSave()
      );
    }

    if (this.isVideoGalleryPage()) {
      return Boolean(
        this.annualReportForm.title.trim() &&
          this.annualReportForm.displayOrder.trim() &&
          this.getAnnualReportFilePathForSave()
      );
    }

    const hasBeneficiaryCount = this.isBeneficiaryListPage()
      ? this.annualReportForm.noOfBeneficiaries.trim()
      : true;

    return Boolean(
      this.annualReportForm.title.trim() &&
        hasBeneficiaryCount &&
        this.annualReportForm.displayOrder.trim() &&
        this.getAnnualReportFilePathForSave()
    );
  }

  onPrimaryActionClick(): void {
    if (!this.isReportPage()) {
      return;
    }

    this.saveAnnualReport();
  }

  onAnnualReportInputChange(label: string, value: string): void {
    if (!this.isReportPage()) {
      return;
    }

    if (
      label === 'Title' ||
      label === 'Project Name' ||
      label === 'project_name' ||
      label === 'title' ||
      label === 'programme_name'
    ) {
      if (label === 'programme_name' && (this.isProgrammeDetailsPage() || this.isProgrammeOverviewPage())) {
        this.annualReportForm.programmeMasterFk = value;
      } else if (label === 'project_name' && this.isProgrammeOverviewPage()) {
        this.annualReportForm.projectFk = value;
      } else if (label === 'Project Name' || label === 'project_name') {
        this.annualReportForm.projectName = value;
      } else {
        this.annualReportForm.title = value;
      }
    }

    if (label === 'sub_title') {
      this.annualReportForm.subTitle = value;
    }

    if (label === 'alt_text') {
      this.annualReportForm.altText = value;
    }

    if (label === 'image_path') {
      this.annualReportForm.imagePath = value;
    }

    if (label === 'project_details') {
      this.annualReportForm.projectDetails = value;
    }

    if (label === 'achievement_details') {
      this.annualReportForm.achievementDetails = value;
    }

    if (label === 'starting_year') {
      this.annualReportForm.startingYear = value.replace(/\D/g, '').slice(0, 4);
    }

    if (label === 'supported_by') {
      this.annualReportForm.supportedBy = value;
    }

    if (label === 'status') {
      this.annualReportForm.status = value;
    }

    if (label === 'strength') {
      this.annualReportForm.strength = value;
    }

    if (label === 'beneficiaries_covered') {
      this.annualReportForm.beneficiariesCovered = value;
    }

    if (label === 'other_image_paths') {
      this.annualReportForm.otherImagePaths = value;
    }

    if (label === 'beneficiary_name') {
      this.annualReportForm.beneficiaryName = value;
    }

    if (label === 'details') {
      this.annualReportForm.details = value;
    }

    if (label === 'date_time') {
      this.annualReportForm.dateTime = value;
    }

    if (label === 'Display Order' || label === 'display_order') {
      this.annualReportForm.displayOrder = value;
    }

    if (label === 'No of Beneficiaries') {
      this.annualReportForm.noOfBeneficiaries = value;
    }
  }

  getAnnualReportInputValue(label: string): string {
    if (!this.isReportPage()) {
      return '';
    }

    if (
      label === 'Title' ||
      label === 'Project Name' ||
      label === 'project_name' ||
      label === 'title' ||
      label === 'programme_name'
    ) {
      if (label === 'programme_name' && (this.isProgrammeDetailsPage() || this.isProgrammeOverviewPage())) {
        return this.annualReportForm.programmeMasterFk;
      }

      if (label === 'project_name' && this.isProgrammeOverviewPage()) {
        return this.annualReportForm.projectFk;
      }

      if (label === 'Project Name' || label === 'project_name') {
        return this.annualReportForm.projectName;
      }

      return this.annualReportForm.title;
    }

    if (label === 'sub_title') {
      return this.annualReportForm.subTitle;
    }

    if (label === 'alt_text') {
      return this.annualReportForm.altText;
    }

    if (label === 'image_path') {
      return this.annualReportForm.imagePath;
    }

    if (label === 'beneficiary_name') {
      return this.annualReportForm.beneficiaryName;
    }

    if (label === 'project_details') {
      return this.annualReportForm.projectDetails;
    }

    if (label === 'achievement_details') {
      return this.annualReportForm.achievementDetails;
    }

    if (label === 'other_image_paths') {
      return this.annualReportForm.otherImagePaths;
    }

    if (label === 'starting_year') {
      return this.annualReportForm.startingYear;
    }

    if (label === 'supported_by') {
      return this.annualReportForm.supportedBy;
    }

    if (label === 'status') {
      return this.annualReportForm.status;
    }

    if (label === 'strength') {
      return this.annualReportForm.strength;
    }

    if (label === 'beneficiaries_covered') {
      return this.annualReportForm.beneficiariesCovered;
    }

    if (label === 'details') {
      return this.annualReportForm.details;
    }

    if (label === 'date_time') {
      return this.annualReportForm.dateTime;
    }

    if (label === 'Display Order' || label === 'display_order') {
      return this.annualReportForm.displayOrder;
    }

    if (label === 'No of Beneficiaries') {
      return this.annualReportForm.noOfBeneficiaries;
    }

    return '';
  }

  onAnnualReportIsActiveChange(checked: boolean): void {
    if (!this.isReportPage()) {
      return;
    }

    this.annualReportForm.isActive = checked;
  }

  getAnnualReportIsActive(label: string): boolean {
    if (!this.isReportPage() || (label !== 'Is Active' && label !== 'is_active')) {
      return false;
    }

    return this.annualReportForm.isActive;
  }

  onAnnualReportFileSelected(event: Event, label: string): void {
    if (this.page.kind !== 'form') {
      return;
    }

    const input = event.target as HTMLInputElement;
    const selectedFile = input.files && input.files[0] ? input.files[0] : null;
    if (!selectedFile) {
      return;
    }

    if (label === 'other_image_paths') {
      this.annualReportForm.otherFile = selectedFile;
    } else {
      this.annualReportForm.file = selectedFile;
    }

    this.uploadAnnualReportFile(selectedFile, label);
  }

  getAnnualReportFileNote(label: string, defaultNote: string | undefined): string {
    if (this.page.kind !== 'form') {
      return defaultNote || 'No file chosen';
    }

    if (label === 'other_image_paths') {
      return (
        this.annualReportForm.otherFile?.name ||
        this.annualReportForm.otherExistingFileName ||
        defaultNote ||
        'No file chosen'
      );
    }

    return (
      this.annualReportForm.file?.name ||
      this.annualReportForm.existingFileName ||
      defaultNote ||
      'No file chosen'
    );
  }

  hasAnnualReportDownload(label: string): boolean {
    return Boolean(this.getAnnualReportDownloadUrl(label));
  }

  getAnnualReportDownloadUrl(label: string): string {
    if (this.page.kind !== 'form') {
      return '';
    }

    if (label === 'other_image_paths') {
      return this.annualReportForm.otherExistingFileUrl;
    }

    return this.annualReportForm.existingFileUrl;
  }

  isReportPage(): boolean {
    return (
      this.isProgrammeMasterPage() ||
      this.isProgrammeDetailsPage() ||
      this.isProgrammeOverviewPage() ||
      this.isBannerPage() ||
      this.page.title === 'Success Story' ||
      this.page.title === 'Media Coverage' ||
      this.page.title === 'Awards Recognition' ||
      this.page.title === 'Image Gallery' ||
      this.page.title === 'Video Gallery' ||
      this.page.title === 'Annual Report' ||
      this.page.title === 'Audit Report' ||
      this.page.title === 'Beneficiary List' ||
      this.page.title === 'Staff List' ||
      this.page.title === 'Food Menu'
    );
  }

  isSuccessStoryPage(): boolean {
    return this.page.title === 'Success Story';
  }

  isProgrammeMasterPage(): boolean {
    return this.page.title === 'Programme Master';
  }

  isProgrammeDetailsPage(): boolean {
    return this.page.title === 'Programme Details';
  }

  isProgrammeOverviewPage(): boolean {
    return this.page.title === 'Programme Overview';
  }

  isMediaCoveragePage(): boolean {
    return this.page.title === 'Media Coverage';
  }

  isAwardsRecognitionPage(): boolean {
    return this.page.title === 'Awards Recognition';
  }

  isImageGalleryPage(): boolean {
    return this.page.title === 'Image Gallery';
  }

  isVideoGalleryPage(): boolean {
    return this.page.title === 'Video Gallery';
  }

  isAnnualReportPage(): boolean {
    return this.page.title === 'Annual Report';
  }

  isAuditReportPage(): boolean {
    return this.page.title === 'Audit Report';
  }

  isBeneficiaryListPage(): boolean {
    return this.page.title === 'Beneficiary List';
  }

  isStaffListPage(): boolean {
    return this.page.title === 'Staff List';
  }

  isFoodMenuPage(): boolean {
    return this.page.title === 'Food Menu';
  }

  isBannerPage(): boolean {
    return this.page.title === 'Banner Management';
  }

  private getReportsApiUrl(): string {
    if (this.isProgrammeOverviewPage()) {
      return apiEndpoints.programmeOverviews;
    }

    if (this.isProgrammeDetailsPage()) {
      return apiEndpoints.programmeDetails;
    }

    if (this.isProgrammeMasterPage()) {
      return apiEndpoints.programmeMasters;
    }

    if (this.isVideoGalleryPage()) {
      return apiEndpoints.videoGalleries;
    }

    if (this.isImageGalleryPage()) {
      return apiEndpoints.imageGalleries;
    }

    if (this.isAwardsRecognitionPage()) {
      return apiEndpoints.awardsRecognitions;
    }

    if (this.isMediaCoveragePage()) {
      return apiEndpoints.mediaCoverages;
    }

    if (this.isSuccessStoryPage()) {
      return apiEndpoints.successStories;
    }

    if (this.isBannerPage()) {
      return apiEndpoints.banners;
    }

    if (this.isFoodMenuPage()) {
      return apiEndpoints.foodMenus;
    }

    if (this.isStaffListPage()) {
      return apiEndpoints.staffLists;
    }

    if (this.isBeneficiaryListPage()) {
      return apiEndpoints.beneficiaryLists;
    }

    return this.isAuditReportPage() ? apiEndpoints.auditReports : apiEndpoints.annualReports;
  }

  private getReportByIdApiUrl(id: string | number): string {
    if (this.isProgrammeOverviewPage()) {
      return apiEndpoints.programmeOverviewById(id);
    }

    if (this.isProgrammeDetailsPage()) {
      return apiEndpoints.programmeDetailById(id);
    }

    if (this.isProgrammeMasterPage()) {
      return apiEndpoints.programmeMasterById(id);
    }

    if (this.isVideoGalleryPage()) {
      return apiEndpoints.videoGalleryById(id);
    }

    if (this.isImageGalleryPage()) {
      return apiEndpoints.imageGalleryById(id);
    }

    if (this.isAwardsRecognitionPage()) {
      return apiEndpoints.awardsRecognitionById(id);
    }

    if (this.isMediaCoveragePage()) {
      return apiEndpoints.mediaCoverageById(id);
    }

    if (this.isSuccessStoryPage()) {
      return apiEndpoints.successStoryById(id);
    }

    if (this.isBannerPage()) {
      return apiEndpoints.bannerById(id);
    }

    if (this.isFoodMenuPage()) {
      return apiEndpoints.foodMenuById(id);
    }

    if (this.isStaffListPage()) {
      return apiEndpoints.staffListById(id);
    }

    if (this.isBeneficiaryListPage()) {
      return apiEndpoints.beneficiaryListById(id);
    }

    return this.isAuditReportPage()
      ? apiEndpoints.auditReportById(id)
      : apiEndpoints.annualReportById(id);
  }

  private getReportLabel(): string {
    if (this.isProgrammeOverviewPage()) {
      return 'programme overview';
    }

    if (this.isProgrammeDetailsPage()) {
      return 'programme details';
    }

    if (this.isProgrammeMasterPage()) {
      return 'programme master';
    }

    if (this.isVideoGalleryPage()) {
      return 'video gallery';
    }

    if (this.isImageGalleryPage()) {
      return 'image gallery';
    }

    if (this.isAwardsRecognitionPage()) {
      return 'awards recognition';
    }

    if (this.isMediaCoveragePage()) {
      return 'media coverage';
    }

    if (this.isSuccessStoryPage()) {
      return 'success story';
    }

    if (this.isBannerPage()) {
      return 'banner';
    }

    if (this.isFoodMenuPage()) {
      return 'food menu';
    }

    if (this.isStaffListPage()) {
      return 'staff list';
    }

    if (this.isBeneficiaryListPage()) {
      return 'beneficiary list';
    }

    return this.isAuditReportPage() ? 'audit report' : 'annual report';
  }

  private getReportLabelCapitalized(): string {
    if (this.isProgrammeOverviewPage()) {
      return 'Programme overview';
    }

    if (this.isProgrammeDetailsPage()) {
      return 'Programme details';
    }

    if (this.isProgrammeMasterPage()) {
      return 'Programme master';
    }

    if (this.isVideoGalleryPage()) {
      return 'Video gallery';
    }

    if (this.isImageGalleryPage()) {
      return 'Image gallery';
    }

    if (this.isAwardsRecognitionPage()) {
      return 'Awards recognition';
    }

    if (this.isMediaCoveragePage()) {
      return 'Media coverage';
    }

    if (this.isSuccessStoryPage()) {
      return 'Success story';
    }

    if (this.isBannerPage()) {
      return 'Banner';
    }

    if (this.isFoodMenuPage()) {
      return 'Food menu';
    }

    if (this.isStaffListPage()) {
      return 'Staff list';
    }

    if (this.isBeneficiaryListPage()) {
      return 'Beneficiary list';
    }

    return this.isAuditReportPage() ? 'Audit report' : 'Annual report';
  }

  private saveAnnualReport(): void {
    if (!this.isAnnualReportFormValid()) {
      return;
    }

    const filePath = this.getAnnualReportFilePathForSave();
    if (
      !this.isBannerPage() &&
      !this.isProgrammeMasterPage() &&
      !this.isProgrammeDetailsPage() &&
      !this.isProgrammeOverviewPage() &&
      !filePath
    ) {
      return;
    }

    const payload = new FormData();
    if (this.isProgrammeOverviewPage()) {
      payload.append('programme_master_fk', this.annualReportForm.programmeMasterFk.trim());
      payload.append('projects_fk', this.annualReportForm.projectFk.trim());
      payload.append('starting_year', this.annualReportForm.startingYear.trim());
      payload.append('supported_by', this.annualReportForm.supportedBy.trim());
      payload.append('status', this.annualReportForm.status.trim());
      payload.append('strength', this.annualReportForm.strength.trim());
      payload.append('beneficiaries_covered', this.annualReportForm.beneficiariesCovered.trim());
    } else if (this.isProgrammeDetailsPage()) {
      payload.append('programme_master_fk', this.annualReportForm.programmeMasterFk.trim());
      payload.append('project_name', this.annualReportForm.projectName.trim());
      payload.append('project_details', this.annualReportForm.projectDetails.trim());
      payload.append('achievement_details', this.annualReportForm.achievementDetails.trim());
      payload.append('image_path', this.getAnnualReportFilePathForSave('image_path'));
      payload.append('other_image_paths', this.getAnnualReportFilePathForSave('other_image_paths'));
    } else if (this.isProgrammeMasterPage()) {
      payload.append('programme_name', this.annualReportForm.title.trim());
    } else if (this.isBannerPage()) {
      const bannerImagePath =
        this.getAnnualReportFilePathForSave() || this.annualReportForm.imagePath.trim();
      if (!bannerImagePath) {
        this.showToast('Please wait for image upload to complete, then save.', 'warn-toast');
        return;
      }

      payload.append('title', this.annualReportForm.title.trim());
      payload.append('sub_title', this.annualReportForm.subTitle.trim());
      payload.append('alt_text', this.annualReportForm.altText.trim());
      payload.append('image_path', bannerImagePath);
    } else if (this.isMediaCoveragePage() || this.isAwardsRecognitionPage()) {
      payload.append('title', this.annualReportForm.title.trim());
      payload.append('date_time', this.annualReportForm.dateTime.trim());
      payload.append('image_path', filePath);
    } else if (this.isVideoGalleryPage()) {
      payload.append('title', this.annualReportForm.title.trim());
      payload.append('video_path', filePath);
    } else if (this.isImageGalleryPage()) {
      payload.append('title', this.annualReportForm.title.trim());
      payload.append('image_path', filePath);
    } else if (this.isSuccessStoryPage()) {
      payload.append('title', this.annualReportForm.title.trim());
      payload.append('beneficiary_name', this.annualReportForm.beneficiaryName.trim());
      payload.append('details', this.annualReportForm.details.trim());
      payload.append('image_path', filePath);
    } else if (this.isBeneficiaryListPage()) {
      payload.append('project_name', this.annualReportForm.title.trim());
      payload.append('no_of_beneficiaries', this.annualReportForm.noOfBeneficiaries.trim());
    } else {
      payload.append('title', this.annualReportForm.title.trim());
    }
    payload.append('display_order', this.annualReportForm.displayOrder);
    payload.append('is_active', this.annualReportForm.isActive ? '1' : '0');
    if (
      !this.isProgrammeOverviewPage() &&
      !this.isProgrammeDetailsPage() &&
      !this.isProgrammeMasterPage() &&
      !this.isBannerPage() &&
      !this.isSuccessStoryPage() &&
      !this.isMediaCoveragePage() &&
      !this.isAwardsRecognitionPage() &&
      !this.isImageGalleryPage() &&
      !this.isVideoGalleryPage()
    ) {
      payload.append('file_path', filePath);
    }
    payload.append('is_uploaded_file', this.annualReportForm.hasNewUploadedFile ? 'true' : 'false');

    this.isSavingAnnualReport = true;
    const isEditing = this.editingAnnualReportId !== null && this.editingAnnualReportId !== undefined;
    const editingAnnualReportId = this.editingAnnualReportId;
    const request = isEditing
      ? this.http.put(this.getReportByIdApiUrl(editingAnnualReportId as string | number), payload)
      : this.http.post(this.getReportsApiUrl(), payload);

    request.subscribe({
      next: () => {
        const successMessage = isEditing
          ? `${this.getReportLabelCapitalized()} updated successfully.`
          : `${this.getReportLabelCapitalized()} created successfully.`;
        this.resetAnnualReportForm();
        if (this.page.table) {
          this.loadAnnualReportRows(successMessage);
        }
      },
      error: () => {
        this.showToast(
          isEditing
            ? `Failed to update ${this.getReportLabel()}.`
            : `Failed to save ${this.getReportLabel()}.`,
          'error-toast'
        );
        this.isSavingAnnualReport = false;
      },
      complete: () => {
        this.isSavingAnnualReport = false;
      },
    });
  }

  private resetAnnualReportForm(): void {
    this.editingAnnualReportId = null;

    this.annualReportForm = {
      programmeMasterFk: '',
      projectFk: '',
      programmeName: '',
      projectName: '',
      projectDetails: '',
      achievementDetails: '',
      startingYear: '',
      supportedBy: '',
      status: '',
      strength: '',
      beneficiariesCovered: '',
      title: '',
      subTitle: '',
      altText: '',
      imagePath: '',
      otherImagePaths: '',
      beneficiaryName: '',
      details: '',
      dateTime: '',
      noOfBeneficiaries: '',
      displayOrder: '',
      isActive: true,
      file: null,
      existingFileName: '',
      existingFilePath: '',
      existingFileUrl: '',
      uploadedFilePath: '',
      otherFile: null,
      otherExistingFileName: '',
      otherExistingFilePath: '',
      otherExistingFileUrl: '',
      otherUploadedFilePath: '',
      hasNewUploadedFile: false,
      hasNewOtherUploadedFile: false,
    };
  }

  private loadAnnualReportRows(successMessage = ''): void {
    this.http.get<unknown>(this.getReportsApiUrl()).subscribe({
      next: (response) => {
        const reports = this.extractReports(response);
        this.page.table!.rows = this.toTableRows(reports);
        if (successMessage) {
          this.showToast(successMessage, 'success-toast');
        }
      },
      error: () => {
        this.page.table!.rows = [];
        if (successMessage) {
          this.showToast('Saved, but failed to refresh table data.', 'warn-toast');
        }
      },
    });
  }

  private showToast(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }

  private extractReports(response: unknown): AnnualReportApiItem[] {
    if (Array.isArray(response)) {
      return response as AnnualReportApiItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const payload = response as {
      data?: unknown;
      programme_overview?: unknown;
      programmeOverview?: unknown;
      programme_overviews?: unknown;
      programmeOverviews?: unknown;
      annual_reports?: unknown;
      annualReports?: unknown;
      programme_details?: unknown;
      programmeDetails?: unknown;
      programme_masters?: unknown;
      programmeMasters?: unknown;
      success_stories?: unknown;
      successStories?: unknown;
      banner_management?: unknown;
      bannerManagement?: unknown;
      banners?: unknown;
      media_coverages?: unknown;
      mediaCoverages?: unknown;
      awards_recognitions?: unknown;
      awardsRecognitions?: unknown;
      image_galleries?: unknown;
      imageGalleries?: unknown;
      video_galleries?: unknown;
      videoGalleries?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.programme_overviews)) {
      return payload.programme_overviews as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.programmeOverviews)) {
      return payload.programmeOverviews as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.programme_overview)) {
      return payload.programme_overview as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.programmeOverview)) {
      return payload.programmeOverview as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.annual_reports)) {
      return payload.annual_reports as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.annualReports)) {
      return payload.annualReports as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.programme_details)) {
      return payload.programme_details as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.programmeDetails)) {
      return payload.programmeDetails as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.programme_masters)) {
      return payload.programme_masters as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.programmeMasters)) {
      return payload.programmeMasters as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.success_stories)) {
      return payload.success_stories as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.successStories)) {
      return payload.successStories as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.banners)) {
      return payload.banners as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.banner_management)) {
      return payload.banner_management as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.bannerManagement)) {
      return payload.bannerManagement as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.media_coverages)) {
      return payload.media_coverages as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.mediaCoverages)) {
      return payload.mediaCoverages as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.awards_recognitions)) {
      return payload.awards_recognitions as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.awardsRecognitions)) {
      return payload.awardsRecognitions as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.image_galleries)) {
      return payload.image_galleries as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.imageGalleries)) {
      return payload.imageGalleries as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.video_galleries)) {
      return payload.video_galleries as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.videoGalleries)) {
      return payload.videoGalleries as AnnualReportApiItem[];
    }

    return [];
  }

  private extractReport(response: unknown): AnnualReportApiItem | null {
    if (!response || typeof response !== 'object') {
      return null;
    }

    const payload = response as {
      data?: unknown;
      programme_overview?: unknown;
      programmeOverview?: unknown;
      annual_report?: unknown;
      annualReport?: unknown;
      programme_detail?: unknown;
      programmeDetail?: unknown;
      programme_master?: unknown;
      programmeMaster?: unknown;
      success_story?: unknown;
      successStory?: unknown;
      banner?: unknown;
      media_coverage?: unknown;
      mediaCoverage?: unknown;
      awards_recognition?: unknown;
      awardsRecognition?: unknown;
      image_gallery?: unknown;
      imageGallery?: unknown;
      video_gallery?: unknown;
      videoGallery?: unknown;
    };

    if (payload.data && !Array.isArray(payload.data) && typeof payload.data === 'object') {
      return payload.data as AnnualReportApiItem;
    }

    if (
      payload.programme_overview &&
      !Array.isArray(payload.programme_overview) &&
      typeof payload.programme_overview === 'object'
    ) {
      return payload.programme_overview as AnnualReportApiItem;
    }

    if (
      payload.programmeOverview &&
      !Array.isArray(payload.programmeOverview) &&
      typeof payload.programmeOverview === 'object'
    ) {
      return payload.programmeOverview as AnnualReportApiItem;
    }

    if (
      payload.annual_report &&
      !Array.isArray(payload.annual_report) &&
      typeof payload.annual_report === 'object'
    ) {
      return payload.annual_report as AnnualReportApiItem;
    }

    if (
      payload.annualReport &&
      !Array.isArray(payload.annualReport) &&
      typeof payload.annualReport === 'object'
    ) {
      return payload.annualReport as AnnualReportApiItem;
    }

    if (
      payload.programme_detail &&
      !Array.isArray(payload.programme_detail) &&
      typeof payload.programme_detail === 'object'
    ) {
      return payload.programme_detail as AnnualReportApiItem;
    }

    if (
      payload.programmeDetail &&
      !Array.isArray(payload.programmeDetail) &&
      typeof payload.programmeDetail === 'object'
    ) {
      return payload.programmeDetail as AnnualReportApiItem;
    }

    if (
      payload.programme_master &&
      !Array.isArray(payload.programme_master) &&
      typeof payload.programme_master === 'object'
    ) {
      return payload.programme_master as AnnualReportApiItem;
    }

    if (
      payload.programmeMaster &&
      !Array.isArray(payload.programmeMaster) &&
      typeof payload.programmeMaster === 'object'
    ) {
      return payload.programmeMaster as AnnualReportApiItem;
    }

    if (
      payload.success_story &&
      !Array.isArray(payload.success_story) &&
      typeof payload.success_story === 'object'
    ) {
      return payload.success_story as AnnualReportApiItem;
    }

    if (
      payload.successStory &&
      !Array.isArray(payload.successStory) &&
      typeof payload.successStory === 'object'
    ) {
      return payload.successStory as AnnualReportApiItem;
    }

    if (payload.banner && !Array.isArray(payload.banner) && typeof payload.banner === 'object') {
      return payload.banner as AnnualReportApiItem;
    }

    if (
      payload.media_coverage &&
      !Array.isArray(payload.media_coverage) &&
      typeof payload.media_coverage === 'object'
    ) {
      return payload.media_coverage as AnnualReportApiItem;
    }

    if (
      payload.mediaCoverage &&
      !Array.isArray(payload.mediaCoverage) &&
      typeof payload.mediaCoverage === 'object'
    ) {
      return payload.mediaCoverage as AnnualReportApiItem;
    }

    if (
      payload.awards_recognition &&
      !Array.isArray(payload.awards_recognition) &&
      typeof payload.awards_recognition === 'object'
    ) {
      return payload.awards_recognition as AnnualReportApiItem;
    }

    if (
      payload.awardsRecognition &&
      !Array.isArray(payload.awardsRecognition) &&
      typeof payload.awardsRecognition === 'object'
    ) {
      return payload.awardsRecognition as AnnualReportApiItem;
    }

    if (
      payload.image_gallery &&
      !Array.isArray(payload.image_gallery) &&
      typeof payload.image_gallery === 'object'
    ) {
      return payload.image_gallery as AnnualReportApiItem;
    }

    if (
      payload.imageGallery &&
      !Array.isArray(payload.imageGallery) &&
      typeof payload.imageGallery === 'object'
    ) {
      return payload.imageGallery as AnnualReportApiItem;
    }

    if (
      payload.video_gallery &&
      !Array.isArray(payload.video_gallery) &&
      typeof payload.video_gallery === 'object'
    ) {
      return payload.video_gallery as AnnualReportApiItem;
    }

    if (
      payload.videoGallery &&
      !Array.isArray(payload.videoGallery) &&
      typeof payload.videoGallery === 'object'
    ) {
      return payload.videoGallery as AnnualReportApiItem;
    }

    return null;
  }

  private toTableRows(reports: AnnualReportApiItem[]): AdminTableRow[] {
    const sortedReports = [...reports].sort((a, b) => {
      const aOrder = this.toNumber(a.display_order);
      const bOrder = this.toNumber(b.display_order);
      return aOrder - bOrder;
    });

    return sortedReports.map((report, index) => ({
      id: report.id ?? '',
      slNo: String(index + 1).padStart(2, '0'),
      programme_name: report.programme_name || report.title || 'Untitled',
      project_name: report.project_name || '-',
      starting_year:
        report.starting_year === null || report.starting_year === undefined
          ? '-'
          : String(report.starting_year),
      supported_by: report.supported_by || '-',
      status: report.status || '-',
      strength:
        report.strength === null || report.strength === undefined ? '-' : String(report.strength),
      beneficiaries_covered:
        report.beneficiaries_covered === null || report.beneficiaries_covered === undefined
          ? '-'
          : String(report.beneficiaries_covered),
      project_details: report.project_details || '-',
      achievement_details: report.achievement_details || '-',
      title: report.title || 'Untitled',
      sub_title: report.sub_title || '-',
      alt_text: report.alt_text || '-',
      beneficiary_name: report.beneficiary_name || '-',
      details: report.details || '-',
      date_time: this.formatDateTime(report.date_time),
      video_path: report.video_path || '-',
      image_path: report.image_path || '-',
      other_image_paths: report.other_image_paths || '-',
      display_order:
        report.display_order === null || report.display_order === undefined
          ? '-'
          : String(report.display_order),
      is_active: this.toBoolean(report.is_active) ? 'Active' : 'Inactive',
      noOfBeneficiaries:
        report.no_of_beneficiaries === null || report.no_of_beneficiaries === undefined
          ? '-'
          : String(report.no_of_beneficiaries),
      createdDate: this.formatDate(report.created_at),
      action: this.resolveActionLabel(report),
    }));
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
  }

  private toBoolean(value: unknown): boolean {
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
  }

  private formatDate(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  private formatDateTime(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  }

  private toDateTimeLocalValue(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
      return value;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private resolveActionLabel(report: AnnualReportApiItem): string {
    return report.file || report.file_url || report.download_url
      ? 'Download PDF'
      : 'Unavailable';
  }

  private resolveExistingFileName(report: AnnualReportApiItem): string {
    const fallbackPath =
      report.video_path ||
      report.image_path ||
      report.file_path ||
      report.file_url ||
      report.download_url ||
      report.file ||
      '';
    return report.file_name || this.extractFileName(fallbackPath);
  }

  private resolveExistingFileUrl(report: AnnualReportApiItem): string {
    const fileUrl =
      report.video_path ||
      report.image_path ||
      report.download_url ||
      report.file_url ||
      report.file_path ||
      report.file ||
      '';
    return apiEndpoints.publicAsset(fileUrl);
  }

  private getAnnualReportFilePathForSave(label: 'image_path' | 'other_image_paths' = 'image_path'): string {
    if (label === 'other_image_paths') {
      return this.annualReportForm.otherUploadedFilePath || this.annualReportForm.otherExistingFilePath;
    }

    return this.annualReportForm.uploadedFilePath || this.annualReportForm.existingFilePath;
  }

  private loadProgrammeMasterOptions(): void {
    this.http.get<unknown>(apiEndpoints.programmeMasters).subscribe({
      next: (response) => {
        const reports = this.extractReports(response);
        this.programmeMasterOptions = reports.map((report) => ({
          label: report.programme_name || report.title || '',
          value:
            report.id === null || report.id === undefined || report.id === ''
              ? ''
              : String(report.id),
        })).filter((option) => Boolean(option.value));
      },
      error: () => {
        this.programmeMasterOptions = [];
      },
    });
  }

  private loadProjectOptions(): void {
    this.http.get<unknown>(apiEndpoints.programmeDetails).subscribe({
      next: (response) => {
        const reports = this.extractReports(response);
        this.projectOptions = reports
          .map((report) => ({
            label: report.project_name || '',
            value: report.id === null || report.id === undefined || report.id === '' ? '' : String(report.id),
          }))
          .filter((option) => Boolean(option.value));
      },
      error: () => {
        this.projectOptions = [];
      },
    });
  }

  private resolveProgrammeMasterSelectionValue(report: AnnualReportApiItem): string {
    if (
      report.programme_master_fk !== null &&
      report.programme_master_fk !== undefined &&
      report.programme_master_fk !== ''
    ) {
      return String(report.programme_master_fk);
    }

    const matchedOption = this.programmeMasterOptions.find(
      (option) => option.label === (report.programme_name || '')
    );

    return matchedOption?.value || '';
  }

  private resolveProjectSelectionValue(report: AnnualReportApiItem): string {
    if (report.projects_fk !== null && report.projects_fk !== undefined && report.projects_fk !== '') {
      return String(report.projects_fk);
    }

    const matchedOption = this.projectOptions.find(
      (option) => option.label === (report.project_name || '')
    );

    return matchedOption?.value || '';
  }

  private resolveOtherExistingFileName(report: AnnualReportApiItem): string {
    return this.extractFileName(report.other_image_paths || '');
  }

  private resolveOtherExistingFileUrl(report: AnnualReportApiItem): string {
    return apiEndpoints.publicAsset(report.other_image_paths || '');
  }

  private extractFileName(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const normalizedValue = value.split('?')[0].split('#')[0];
    const segments = normalizedValue.split('/').filter(Boolean);
    return segments[segments.length - 1] || value;
  }

  private uploadAnnualReportFile(file: File, label: string): void {
    const payload = new FormData();
    payload.append('file', file);

    this.isUploadingAnnualReportFile = true;
    this.http.post<unknown>(apiEndpoints.upload, payload).subscribe({
      next: (response) => {
        const filePath = this.extractUploadedFilePath(response);
        if (!filePath) {
          this.showToast('File uploaded, but file path was missing in response.', 'warn-toast');
          return;
        }

        if (label === 'other_image_paths') {
          this.annualReportForm.otherUploadedFilePath = filePath;
          this.annualReportForm.otherExistingFilePath = filePath;
          this.annualReportForm.otherExistingFileUrl = apiEndpoints.publicAsset(filePath);
          this.annualReportForm.otherExistingFileName = file.name;
          this.annualReportForm.otherImagePaths = filePath;
          this.annualReportForm.hasNewOtherUploadedFile = true;
          return;
        }

        this.annualReportForm.uploadedFilePath = filePath;
        this.annualReportForm.existingFilePath = filePath;
        this.annualReportForm.existingFileUrl = apiEndpoints.publicAsset(filePath);
        this.annualReportForm.existingFileName = file.name;
        this.annualReportForm.imagePath = filePath;
        this.annualReportForm.hasNewUploadedFile = true;
      },
      error: () => {
        this.showToast('Failed to upload file.', 'error-toast');
      },
      complete: () => {
        this.isUploadingAnnualReportFile = false;
      },
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
}

interface AnnualReportApiItem {
  id?: number | string | null;
  programme_master_fk?: number | string | null;
  projects_fk?: number | string | null;
  programme_name?: string;
  project_name?: string;
  project_details?: string;
  achievement_details?: string;
  starting_year?: number | string | null;
  supported_by?: string | null;
  status?: string | null;
  strength?: number | string | null;
  beneficiaries_covered?: number | string | null;
  title?: string;
  sub_title?: string;
  alt_text?: string;
  beneficiary_name?: string;
  details?: string;
  date_time?: string | null;
  video_path?: string | null;
  image_path?: string | null;
  other_image_paths?: string | null;
  no_of_beneficiaries?: number | string | null;
  created_at?: string | null;
  is_active?: boolean | number | string | null;
  file?: string | null;
  file_name?: string | null;
  file_path?: string | null;
  file_url?: string | null;
  download_url?: string | null;
  display_order?: number | string | null;
}

interface AnnualReportFormState {
  programmeMasterFk: string;
  projectFk: string;
  programmeName: string;
  projectName: string;
  projectDetails: string;
  achievementDetails: string;
  startingYear: string;
  supportedBy: string;
  status: string;
  strength: string;
  beneficiariesCovered: string;
  title: string;
  subTitle: string;
  altText: string;
  imagePath: string;
  otherImagePaths: string;
  beneficiaryName: string;
  details: string;
  dateTime: string;
  noOfBeneficiaries: string;
  displayOrder: string;
  isActive: boolean;
  file: File | null;
  existingFileName: string;
  existingFilePath: string;
  existingFileUrl: string;
  uploadedFilePath: string;
  otherFile: File | null;
  otherExistingFileName: string;
  otherExistingFilePath: string;
  otherExistingFileUrl: string;
  otherUploadedFilePath: string;
  hasNewUploadedFile: boolean;
  hasNewOtherUploadedFile: boolean;
}
