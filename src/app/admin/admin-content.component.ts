import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { firstValueFrom } from 'rxjs';
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
  private readonly organizationDetailsFixedId = 1;
  isSavingAnnualReport = false;
  isSavingOrganizationDetails = false;
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
  private organizationDetailsId: string | number | null = null;

  private organizationDetailsForm: OrganizationDetailsFormState = {
    phoneNumber: '',
    email: '',
    officeAddress: '',
    officeAddressHindi: '',
    officeAddressOdia: '',
    facebookUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
  };

  private annualReportForm: AnnualReportFormState = {
    programmeMasterFk: '',
    projectFk: '',
    programmeName: '',
    programmeNameHindi: '',
    programmeNameOdia: '',
    projectName: '',
    projectDetails: '',
    projectDetailsHindi: '',
    projectDetailsOdia: '',
    achievementDetails: '',
    achievementDetailsHindi: '',
    achievementDetailsOdia: '',
    startingYear: '',
    supportedBy: '',
    status: '',
    strength: '',
    beneficiariesCovered: '',
    title: '',
    titleHindi: '',
    titleOdia: '',
    description: '',
    descriptionHindi: '',
    descriptionOdia: '',
    openingDate: '',
    closingDate: '',
    detailFilePath: '',
    subTitle: '',
    altText: '',
    imagePath: '',
    logoPath: '',
    otherImagePaths: '',
    beneficiaryName: '',
    beneficiaryNameHindi: '',
    beneficiaryNameOdia: '',
    details: '',
    detailsHindi: '',
    detailsOdia: '',
    dateTime: '',
    noOfBeneficiaries: '',
    projectNameHindi: '',
    projectNameOdia: '',
    serialNumber: '',
    nameOfPost: '',
    reqQualification: '',
    numberOfPost: '',
    remuneration: '',
    lowerAge: '',
    upperAge: '',
    governingBodyName: '',
    governingBodyNameHindi: '',
    governingBodyNameOdia: '',
    governingBodyPosition: '',
    governingBodyQualification: '',
    governingBodyMessage: '',
    governingBodyMessageHindi: '',
    governingBodyMessageOdia: '',
    donorName: '',
    donationAmount: '',
    donationDate: '',
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
    if (this.isOrganizationDetailsPage()) {
      this.loadOrganizationDetails();
    }

    if (this.isProgrammeDetailsPage() || this.isProgrammeOverviewPage()) {
      this.loadProgrammeMasterOptions();
    }

    if (this.isProgrammeOverviewPage()) {
      this.loadProjectOptions();
    }

    if (this.isReportPage() && this.page.table) {
      this.loadAnnualReportRows();
    }
    if (this.isPartnersPage() && this.page.table) {
      this.loadAnnualReportRows();
    }
    if (this.isCctvDetailsPage() && this.page.table) {
      this.loadAnnualReportRows();
    }
  }

  getFieldOptions(field: AdminField): AdminFieldOption[] {
    if (field.label === 'programme_name' && (this.isProgrammeDetailsPage() || this.isProgrammeOverviewPage())) {
      return this.programmeMasterOptions;
    }

    if (field.label === 'project_name' && this.isProgrammeOverviewPage()) {
      return this.programmeMasterOptions;
    }

    if (field.label === 'project_name' && this.isProgrammeOverviewPage()) {
      return this.projectOptions;
    }

    return field.options || [];
  }

  isProgrammeDetailsRichTextField(label: string): boolean {
    if (this.isProgrammeDetailsPage()) {
      return (
        label === 'project_details' ||
        label === 'project_details_hindi' ||
        label === 'project_details_odia' ||
        label === 'achievement_details' ||
        label === 'achievement_details_hindi' ||
        label === 'achievement_details_odia'
      );
    }

    if (this.isSuccessStoryPage()) {
      return label === 'details' || label === 'details_hindi' || label === 'details_odia';
    }

    return false;
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

    if (this.isTenderNoticePage() || this.isAdvertisementPage() || this.isNewsEventsPage()) {
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
            this.showToast(
              this.isAdvertisementPage()
                ? 'Failed to load advertisement details.'
                : this.isNewsEventsPage()
                  ? 'Failed to load news event details.'
                  : 'Failed to load tender notice details.',
              'error-toast'
            );
            return;
          }

          this.annualReportForm = {
            programmeMasterFk: '',
            projectFk: '',
            programmeName: '',
            programmeNameHindi: '',
            programmeNameOdia: '',
            projectName: '',
            projectDetails: '',
            projectDetailsHindi: '',
            projectDetailsOdia: '',
            achievementDetails: '',
            achievementDetailsHindi: '',
            achievementDetailsOdia: '',
            startingYear: '',
            supportedBy: '',
            status: '',
            strength: '',
            beneficiariesCovered: '',
            title: report.title || '',
            titleHindi: report.title_hindi || '',
            titleOdia: report.title_odia || '',
            description: report.description || '',
            descriptionHindi: report.description_hindi || '',
            descriptionOdia: report.description_odia || '',
            openingDate: this.toDateValue(report.opening_date),
            closingDate: this.toDateValue(report.closing_date),
            detailFilePath: report.detail_file_path || '',
            subTitle: '',
            altText: '',
            imagePath: '',
            logoPath: '',
            otherImagePaths: '',
            beneficiaryName: '',
            beneficiaryNameHindi: '',
            beneficiaryNameOdia: '',
            details: '',
            detailsHindi: '',
            detailsOdia: '',
            dateTime: '',
            noOfBeneficiaries: '',
            projectNameHindi: '',
            projectNameOdia: '',
            serialNumber: '',
            nameOfPost: '',
            reqQualification: '',
            numberOfPost: '',
            remuneration: '',
            lowerAge: '',
            upperAge: '',
            governingBodyName: report.name || '',
            governingBodyNameHindi: report.name_hindi || '',
            governingBodyNameOdia: report.name_odia || '',
            governingBodyPosition: report.position || '',
            governingBodyQualification: report.qualification || '',
            governingBodyMessage: report.message || '',
            governingBodyMessageHindi: report.message_hindi || '',
            governingBodyMessageOdia: report.message_odia || '',
            donorName: report.donor_name || '',
            donationAmount:
              report.donation_amount === null || report.donation_amount === undefined
                ? ''
                : String(report.donation_amount),
            donationDate: this.toDateValue(report.donation_date),
            displayOrder: report.display_order === null || report.display_order === undefined
              ? ''
              : String(report.display_order),
            isActive: this.toBoolean(report.is_active),
            file: null,
            existingFileName: this.extractFileName(report.detail_file_path || ''),
            existingFilePath: report.detail_file_path || '',
            existingFileUrl: apiEndpoints.publicAsset(report.detail_file_path || ''),
            uploadedFilePath: '',
            otherFile: null,
            otherExistingFileName: '',
            otherExistingFilePath: '',
            otherExistingFileUrl: '',
            otherUploadedFilePath: '',
            hasNewUploadedFile: false,
            hasNewOtherUploadedFile: false,
          };
          this.editingAnnualReportId = report.id ?? reportId;
        },
        error: () => {
          this.showToast(
            this.isAdvertisementPage()
              ? 'Failed to load advertisement details.'
              : this.isNewsEventsPage()
                ? 'Failed to load news event details.'
                : 'Failed to load tender notice details.',
            'error-toast'
          );
        },
      });
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
          programmeNameHindi: report.programme_name_hindi || '',
          programmeNameOdia: report.programme_name_odia || '',
          projectName: report.project_name || '',
          projectDetails: report.project_details || '',
          projectDetailsHindi: report.project_details_hindi || '',
          projectDetailsOdia: report.project_details_odia || '',
          achievementDetails: report.achievement_details || '',
          achievementDetailsHindi: report.achievement_details_hindi || '',
          achievementDetailsOdia: report.achievement_details_odia || '',
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
          title: report.title || report.document_name || report.status_details || report.programme_name || report.project_name || '',
          description: report.description || '',
          descriptionHindi: report.description_hindi || '',
          descriptionOdia: report.description_odia || '',
          openingDate: this.toDateValue(report.opening_date),
          closingDate: this.toDateValue(report.closing_date),
          detailFilePath: report.detail_file_path || '',
          subTitle: report.sub_title || '',
          altText: report.alt_text || '',
          imagePath: report.image_path || report.logo_path || '',
          logoPath: report.logo_path || '',
          otherImagePaths: report.other_image_paths || '',
          beneficiaryName: report.beneficiary_name || '',
          beneficiaryNameHindi: report.beneficiary_name_hindi || '',
          beneficiaryNameOdia: report.beneficiary_name_odia || '',
          details: report.details || '',
          detailsHindi: report.details_hindi || '',
          detailsOdia: report.details_odia || '',
          titleHindi: report.title_hindi || '',
          titleOdia: report.title_odia || '',
          dateTime: this.toDateTimeLocalValue(report.date_time),
          noOfBeneficiaries:
            report.no_of_beneficiaries === null || report.no_of_beneficiaries === undefined
              ? ''
              : String(report.no_of_beneficiaries),
          projectNameHindi: report.project_name_hindi || '',
          projectNameOdia: report.project_name_odia || '',
          serialNumber: report.serial_number || '',
          nameOfPost: report.name_of_post || '',
          reqQualification: report.req_qualification || '',
          numberOfPost:
            report.number_of_post === null || report.number_of_post === undefined
              ? ''
              : String(report.number_of_post),
          remuneration: report.remuneration || '',
          lowerAge:
            report.lower_age === null || report.lower_age === undefined
              ? ''
              : String(report.lower_age),
          upperAge:
            report.upper_age === null || report.upper_age === undefined
              ? ''
              : String(report.upper_age),
          governingBodyName: report.name || '',
          governingBodyNameHindi: report.name_hindi || '',
          governingBodyNameOdia: report.name_odia || '',
          governingBodyPosition: report.position || '',
          governingBodyQualification: report.qualification || '',
          governingBodyMessage: report.message || '',
          governingBodyMessageHindi: report.message_hindi || '',
          governingBodyMessageOdia: report.message_odia || '',
          donorName: report.donor_name || '',
          donationAmount:
            report.donation_amount === null || report.donation_amount === undefined
              ? ''
              : String(report.donation_amount),
          donationDate: this.toDateValue(report.donation_date),
          displayOrder:
            report.display_order === null || report.display_order === undefined
              ? report.displayOrder === null || report.displayOrder === undefined
                ? ''
                : String(report.displayOrder)
              : String(report.display_order),
          isActive: this.toBoolean(report.is_active ?? report.isactive),
          file: null,
          existingFileName: this.resolveExistingFileName(report),
          existingFilePath:
            report.video_path ||
            report.image_path ||
            report.logo_path ||
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
        this.editingAnnualReportId = this.resolveReportId(report) ?? reportId;
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
    if (this.isGoverningBodyPage()) {
      return Boolean(
        this.annualReportForm.governingBodyName.trim() &&
          this.annualReportForm.governingBodyPosition.trim() &&
          this.annualReportForm.governingBodyQualification.trim() &&
          this.annualReportForm.displayOrder.trim() &&
          this.getAnnualReportFilePathForSave()
      );
    }

    if (this.isGeneralBodyPage()) {
      return Boolean(
        this.annualReportForm.governingBodyName.trim() &&
          this.annualReportForm.governingBodyPosition.trim() &&
          this.annualReportForm.displayOrder.trim() &&
          this.getAnnualReportFilePathForSave()
      );
    }

    if (this.isDonorListPage()) {
      return Boolean(
        this.annualReportForm.donorName.trim() &&
          this.annualReportForm.donationAmount.trim() &&
          this.annualReportForm.donationDate.trim() &&
          this.annualReportForm.displayOrder.trim()
      );
    }

    if (this.isLegalStatusPage()) {
      return Boolean(
        this.annualReportForm.title.trim() && this.annualReportForm.displayOrder.trim()
      );
    }

    if (this.isCareerOpportunitiesPage()) {
      return Boolean(
        this.annualReportForm.nameOfPost.trim() &&
          this.annualReportForm.reqQualification.trim() &&
          this.annualReportForm.numberOfPost.trim() &&
          this.annualReportForm.remuneration.trim() &&
          this.annualReportForm.closingDate.trim() &&
          this.annualReportForm.lowerAge.trim() &&
          this.annualReportForm.upperAge.trim() &&
          this.annualReportForm.displayOrder.trim()
      );
    }

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
        this.annualReportForm.programmeName.trim() && this.annualReportForm.displayOrder.trim()
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

      if (this.isPartnersPage()) {
        const hasPartnerLogoPath =
          Boolean(this.getAnnualReportFilePathForSave()) ||
          Boolean(this.annualReportForm.file) ||
          Boolean(this.editingAnnualReportId);

        return Boolean(
          this.annualReportForm.title.trim() &&
            this.annualReportForm.displayOrder.trim() &&
            hasPartnerLogoPath
        );
      }

    if (this.isTenderNoticePage() || this.isAdvertisementPage()) {
      return Boolean(
        this.annualReportForm.title.trim() &&
          this.annualReportForm.titleHindi.trim() &&
          this.annualReportForm.titleOdia.trim() &&
          this.annualReportForm.description.trim() &&
          this.annualReportForm.descriptionHindi.trim() &&
          this.annualReportForm.descriptionOdia.trim() &&
          this.annualReportForm.openingDate.trim() &&
          this.annualReportForm.closingDate.trim() &&
          this.annualReportForm.displayOrder.trim()
      );
    }

    if (this.isNewsEventsPage()) {
      return Boolean(
        this.annualReportForm.title.trim() &&
          this.annualReportForm.titleHindi.trim() &&
          this.annualReportForm.titleOdia.trim() &&
          this.annualReportForm.description.trim() &&
          this.annualReportForm.descriptionHindi.trim() &&
          this.annualReportForm.descriptionOdia.trim() &&
          this.annualReportForm.displayOrder.trim()
      );
    }

    if (this.isCctvDetailsPage()) {
      return Boolean(
        this.annualReportForm.projectName.trim() &&
          this.annualReportForm.projectNameHindi.trim() &&
          this.annualReportForm.projectNameOdia.trim() &&
          this.annualReportForm.serialNumber.trim() &&
          this.annualReportForm.displayOrder.trim()
      );
    }

    if (this.isSuccessStoryPage()) {
      return Boolean(
        this.annualReportForm.title.trim() &&
          this.annualReportForm.titleHindi.trim() &&
          this.annualReportForm.titleOdia.trim() &&
          this.annualReportForm.beneficiaryName.trim() &&
          this.annualReportForm.beneficiaryNameHindi.trim() &&
          this.annualReportForm.beneficiaryNameOdia.trim() &&
          this.annualReportForm.details.trim() &&
          this.annualReportForm.detailsHindi.trim() &&
          this.annualReportForm.detailsOdia.trim() &&
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
    if (this.isOrganizationDetailsPage()) {
      this.saveOrganizationDetails();
      return;
    }

    if (!this.isReportPage()) {
      return;
    }

    this.saveAnnualReport();
  }

  onClearForm(): void {
    if (this.isOrganizationDetailsPage()) {
      this.resetOrganizationDetailsForm();
      this.showToast('Form cleared.', 'success-toast');
      return;
    }

    if (!this.isReportPage()) {
      return;
    }

    this.resetAnnualReportForm();
    this.showToast('Form cleared.', 'success-toast');
  }

  onAnnualReportInputChange(label: string, value: string): void {
    if (this.isOrganizationDetailsPage()) {
      this.onOrganizationDetailsInputChange(label, value);
      return;
    }

    if (!this.isReportPage()) {
      return;
    }

    if (
      label === 'Title' ||
      label === 'Project Name' ||
      label === 'project_name' ||
      label === 'title' ||
      label === 'document_name' ||
      label === 'status_details' ||
      label === 'programme_name'
    ) {
      if (label === 'programme_name' && (this.isProgrammeDetailsPage() || this.isProgrammeOverviewPage())) {
        this.annualReportForm.programmeMasterFk = value;
      } else if (label === 'programme_name' && this.isProgrammeMasterPage()) {
        this.annualReportForm.programmeName = value;
        this.annualReportForm.title = value;
      } else if (label === 'project_name' && this.isProgrammeOverviewPage()) {
        this.annualReportForm.projectFk = value;
      } else if (label === 'Project Name' || label === 'project_name') {
        this.annualReportForm.projectName = value;
      } else {
        this.annualReportForm.title = value;
      }
    }

    if (label === 'programme_name_hindi') {
      this.annualReportForm.programmeNameHindi = value;
    }

    if (label === 'programme_name_odia') {
      this.annualReportForm.programmeNameOdia = value;
    }

    if (label === 'description') {
      this.annualReportForm.description = value;
    }

    if (label === 'description_hindi') {
      this.annualReportForm.descriptionHindi = value;
    }

    if (label === 'description_odia') {
      this.annualReportForm.descriptionOdia = value;
    }

    if (label === 'opening_date') {
      this.annualReportForm.openingDate = value;
    }

    if (label === 'closing_date') {
      this.annualReportForm.closingDate = value;
    }

    if (label === 'detail_file_path') {
      this.annualReportForm.detailFilePath = value;
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

    if (label === 'logo_path') {
      this.annualReportForm.logoPath = value;
    }

    if (label === 'project_details') {
      this.annualReportForm.projectDetails = value;
    }

    if (label === 'project_details_hindi') {
      this.annualReportForm.projectDetailsHindi = value;
    }

    if (label === 'project_details_odia') {
      this.annualReportForm.projectDetailsOdia = value;
    }

    if (label === 'achievement_details') {
      this.annualReportForm.achievementDetails = value;
    }

    if (label === 'achievement_details_hindi') {
      this.annualReportForm.achievementDetailsHindi = value;
    }

    if (label === 'achievement_details_odia') {
      this.annualReportForm.achievementDetailsOdia = value;
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

    if (label === 'beneficiary_name_hindi') {
      this.annualReportForm.beneficiaryNameHindi = value;
    }

    if (label === 'beneficiary_name_odia') {
      this.annualReportForm.beneficiaryNameOdia = value;
    }

    if (label === 'details') {
      this.annualReportForm.details = value;
    }

    if (label === 'details_hindi') {
      this.annualReportForm.detailsHindi = value;
    }

    if (label === 'details_odia') {
      this.annualReportForm.detailsOdia = value;
    }

    if (label === 'title_hindi') {
      this.annualReportForm.titleHindi = value;
    }

    if (label === 'title_odia') {
      this.annualReportForm.titleOdia = value;
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

    if (label === 'project_name_hindi') {
      this.annualReportForm.projectNameHindi = value;
    }

    if (label === 'project_name_odia') {
      this.annualReportForm.projectNameOdia = value;
    }

    if (label === 'serial_number') {
      this.annualReportForm.serialNumber = value;
    }

    if (label === 'name_of_post') {
      this.annualReportForm.nameOfPost = value;
    }

    if (label === 'req_qualification') {
      this.annualReportForm.reqQualification = value;
    }

    if (label === 'number_of_post') {
      this.annualReportForm.numberOfPost = value;
    }

    if (label === 'remuneration') {
      this.annualReportForm.remuneration = value;
    }

    if (label === 'lower_age') {
      this.annualReportForm.lowerAge = value;
    }

    if (label === 'upper_age') {
      this.annualReportForm.upperAge = value;
    }

    if (label === 'name') {
      this.annualReportForm.governingBodyName = value;
    }

    if (label === 'name_hindi') {
      this.annualReportForm.governingBodyNameHindi = value;
    }

    if (label === 'name_odia') {
      this.annualReportForm.governingBodyNameOdia = value;
    }

    if (label === 'position') {
      this.annualReportForm.governingBodyPosition = value;
    }

    if (label === 'qualification') {
      this.annualReportForm.governingBodyQualification = value;
    }

    if (label === 'message') {
      this.annualReportForm.governingBodyMessage = value;
    }

    if (label === 'message_hindi') {
      this.annualReportForm.governingBodyMessageHindi = value;
    }

    if (label === 'message_odia') {
      this.annualReportForm.governingBodyMessageOdia = value;
    }

    if (label === 'donor_name') {
      this.annualReportForm.donorName = value;
    }

    if (label === 'donation_amount') {
      this.annualReportForm.donationAmount = value;
    }

    if (label === 'donation_date') {
      this.annualReportForm.donationDate = value;
    }
  }

  getAnnualReportInputValue(label: string): string {
    if (this.isOrganizationDetailsPage()) {
      return this.getOrganizationDetailsInputValue(label);
    }

    if (!this.isReportPage()) {
      return '';
    }

    if (
      label === 'Title' ||
      label === 'Project Name' ||
      label === 'project_name' ||
      label === 'title' ||
      label === 'document_name' ||
      label === 'status_details' ||
      label === 'programme_name'
    ) {
      if (label === 'programme_name' && (this.isProgrammeDetailsPage() || this.isProgrammeOverviewPage())) {
        return this.annualReportForm.programmeMasterFk;
      }

      if (label === 'programme_name' && this.isProgrammeMasterPage()) {
        return this.annualReportForm.programmeName;
      }

      if (label === 'project_name' && this.isProgrammeOverviewPage()) {
        return this.annualReportForm.projectFk;
      }

      if (label === 'Project Name' || label === 'project_name') {
        return this.annualReportForm.projectName;
      }

      return this.annualReportForm.title;
    }

    if (label === 'programme_name_hindi') {
      return this.annualReportForm.programmeNameHindi;
    }

    if (label === 'programme_name_odia') {
      return this.annualReportForm.programmeNameOdia;
    }

    if (label === 'description') {
      return this.annualReportForm.description;
    }

    if (label === 'description_hindi') {
      return this.annualReportForm.descriptionHindi;
    }

    if (label === 'description_odia') {
      return this.annualReportForm.descriptionOdia;
    }

    if (label === 'opening_date') {
      return this.annualReportForm.openingDate;
    }

    if (label === 'closing_date') {
      return this.annualReportForm.closingDate;
    }

    if (label === 'detail_file_path') {
      return this.annualReportForm.detailFilePath;
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

    if (label === 'logo_path') {
      return this.annualReportForm.logoPath;
    }

    if (label === 'beneficiary_name') {
      return this.annualReportForm.beneficiaryName;
    }

    if (label === 'beneficiary_name_hindi') {
      return this.annualReportForm.beneficiaryNameHindi;
    }

    if (label === 'beneficiary_name_odia') {
      return this.annualReportForm.beneficiaryNameOdia;
    }

    if (label === 'project_details') {
      return this.annualReportForm.projectDetails;
    }

    if (label === 'project_details_hindi') {
      return this.annualReportForm.projectDetailsHindi;
    }

    if (label === 'project_details_odia') {
      return this.annualReportForm.projectDetailsOdia;
    }

    if (label === 'achievement_details') {
      return this.annualReportForm.achievementDetails;
    }

    if (label === 'achievement_details_hindi') {
      return this.annualReportForm.achievementDetailsHindi;
    }

    if (label === 'achievement_details_odia') {
      return this.annualReportForm.achievementDetailsOdia;
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

    if (label === 'details_hindi') {
      return this.annualReportForm.detailsHindi;
    }

    if (label === 'details_odia') {
      return this.annualReportForm.detailsOdia;
    }

    if (label === 'title_hindi') {
      return this.annualReportForm.titleHindi;
    }

    if (label === 'title_odia') {
      return this.annualReportForm.titleOdia;
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

    if (label === 'project_name_hindi') {
      return this.annualReportForm.projectNameHindi;
    }

    if (label === 'project_name_odia') {
      return this.annualReportForm.projectNameOdia;
    }

    if (label === 'serial_number') {
      return this.annualReportForm.serialNumber;
    }

    if (label === 'name_of_post') {
      return this.annualReportForm.nameOfPost;
    }

    if (label === 'req_qualification') {
      return this.annualReportForm.reqQualification;
    }

    if (label === 'number_of_post') {
      return this.annualReportForm.numberOfPost;
    }

    if (label === 'remuneration') {
      return this.annualReportForm.remuneration;
    }

    if (label === 'lower_age') {
      return this.annualReportForm.lowerAge;
    }

    if (label === 'upper_age') {
      return this.annualReportForm.upperAge;
    }

    if (label === 'name') {
      return this.annualReportForm.governingBodyName;
    }

    if (label === 'name_hindi') {
      return this.annualReportForm.governingBodyNameHindi;
    }

    if (label === 'name_odia') {
      return this.annualReportForm.governingBodyNameOdia;
    }

    if (label === 'position') {
      return this.annualReportForm.governingBodyPosition;
    }

    if (label === 'qualification') {
      return this.annualReportForm.governingBodyQualification;
    }

    if (label === 'message') {
      return this.annualReportForm.governingBodyMessage;
    }

    if (label === 'message_hindi') {
      return this.annualReportForm.governingBodyMessageHindi;
    }

    if (label === 'message_odia') {
      return this.annualReportForm.governingBodyMessageOdia;
    }

    if (label === 'donor_name') {
      return this.annualReportForm.donorName;
    }

    if (label === 'donation_amount') {
      return this.annualReportForm.donationAmount;
    }

    if (label === 'donation_date') {
      return this.annualReportForm.donationDate;
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
    if (!this.isReportPage() || (label !== 'Is Active' && label !== 'is_active' && label !== 'isactive')) {
      return false;
    }

    return this.annualReportForm.isActive;
  }

  onAnnualReportFileSelected(event: Event, label: string): void {
    if (this.page.kind !== 'form') {
      return;
    }

    const input = event.target as HTMLInputElement;
    const selectedFiles = input.files ? Array.from(input.files) : [];
    if (!selectedFiles.length) {
      return;
    }

    if (label === 'other_image_paths') {
      this.annualReportForm.otherFile = selectedFiles[0];
      this.uploadAnnualReportFiles(selectedFiles, label);
      return;
    }

    this.annualReportForm.file = selectedFiles[0];
    this.uploadAnnualReportFile(selectedFiles[0], label);
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

    if (label === 'logo_path') {
      return (
        this.annualReportForm.file?.name ||
        this.annualReportForm.existingFileName ||
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

  getAnnualReportFileName(label: string): string {
    if (label === 'other_image_paths') {
      return this.annualReportForm.otherFile?.name || this.annualReportForm.otherExistingFileName || '';
    }

    if (label === 'logo_path') {
      return this.annualReportForm.file?.name || this.annualReportForm.existingFileName || '';
    }

    return this.annualReportForm.file?.name || this.annualReportForm.existingFileName || '';
  }

  getOtherImagePathList(): string[] {
    const value = this.annualReportForm.otherImagePaths || this.annualReportForm.otherExistingFilePath || '';
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((path) => path.trim())
      .filter(Boolean);
  }

  getPublicAssetUrl(path: string): string {
    return apiEndpoints.publicAsset(path);
  }

  getFileName(path: string): string {
    if (!path) {
      return '';
    }

    const normalizedPath = path.split('?')[0].split('#')[0];
    const segments = normalizedPath.split('/').filter(Boolean);
    return segments[segments.length - 1] || path;
  }

  getImagePathList(value: unknown): string[] {
    if (typeof value !== 'string' || !value.trim()) {
      return [];
    }

    return value
      .split(',')
      .map((path) => path.trim())
      .filter(Boolean);
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

    if (label === 'logo_path') {
      return this.annualReportForm.existingFileUrl;
    }

    return this.annualReportForm.existingFileUrl;
  }

  isReportPage(): boolean {
    return (
      this.isProgrammeMasterPage() ||
      this.isProgrammeDetailsPage() ||
      this.isProgrammeOverviewPage() ||
      this.isBannerPage() ||
      this.isLegalDocumentPage() ||
      this.isLegalStatusPage() ||
      this.page.title === 'Success Story' ||
      this.page.title === 'Media Coverage' ||
      this.page.title === 'Awards Recognition' ||
      this.page.title === 'Tender Notices' ||
      this.page.title === 'Advertisements' ||
      this.page.title === 'News & Events' ||
      this.page.title === 'Partners' ||
      this.page.title === 'CCTV Details' ||
      this.page.title === 'Governing Body' ||
      this.page.title === 'General Body' ||
      this.page.title === 'Donor List' ||
      this.page.title === 'Career Opportunities' ||
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

  isTenderNoticePage(): boolean {
    return this.page.title === 'Tender Notices';
  }

  isAdvertisementPage(): boolean {
    return this.page.title === 'Advertisements';
  }

  isNewsEventsPage(): boolean {
    return this.page.title === 'News & Events';
  }

  isImageGalleryPage(): boolean {
    return this.page.title === 'Image Gallery';
  }

  isCareerOpportunitiesPage(): boolean {
    return this.page.title === 'Career Opportunities';
  }

  isCctvDetailsPage(): boolean {
    return this.page.title === 'CCTV Details';
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

  isGoverningBodyPage(): boolean {
    return this.page.title === 'Governing Body';
  }

  isGeneralBodyPage(): boolean {
    return this.page.title === 'General Body';
  }

  isDonorListPage(): boolean {
    return this.page.title === 'Donor List';
  }

  isBannerPage(): boolean {
    return this.page.title === 'Banner Management';
  }

  isPartnersPage(): boolean {
    return this.page.title === 'Partners';
  }

  isLegalDocumentPage(): boolean {
    return this.page.title === 'Legal Document';
  }

  isLegalStatusPage(): boolean {
    return this.page.title === 'Legal Status';
  }

  isOrganizationDetailsPage(): boolean {
    return this.page.title === 'Organization Details';
  }

  private loadOrganizationDetails(): void {
    this.http.get<unknown>(apiEndpoints.organizationDetailById(this.organizationDetailsFixedId)).subscribe({
      next: (response) => {
        const details = this.extractOrganizationDetails(response);
        if (!details) {
          this.resetOrganizationDetailsForm();
          this.organizationDetailsId = this.organizationDetailsFixedId;
          return;
        }

        this.organizationDetailsId = this.resolveOrganizationDetailsId(details) ?? this.organizationDetailsFixedId;
        this.organizationDetailsForm = {
          phoneNumber: this.getOrganizationFieldValue(details.phone_number, details.phoneNumber, details.phone),
          email: this.getOrganizationFieldValue(details.email, details.email_id, details.emailId),
          officeAddress: this.getOrganizationFieldValue(
            details.office_address,
            details.officeAddress,
            details.address
          ),
          officeAddressHindi: this.getOrganizationFieldValue(
            details.office_address_hindi,
            details.office_address_hi,
            details.officeAddressHindi
          ),
          officeAddressOdia: this.getOrganizationFieldValue(
            details.office_address_odia,
            details.office_address_or,
            details.officeAddressOdia
          ),
          facebookUrl: this.getOrganizationFieldValue(details.facebook_url, details.facebookUrl),
          twitterUrl: this.getOrganizationFieldValue(details.twitter_url, details.twitterUrl),
          linkedinUrl: this.getOrganizationFieldValue(details.linkedin_url, details.linkedinUrl),
        };
      },
      error: () => {
        this.resetOrganizationDetailsForm();
        this.showToast('Failed to load organization details.', 'error-toast');
      },
    });
  }

  private saveOrganizationDetails(): void {
    const payload = {
      id: this.organizationDetailsFixedId,
      phone_number: this.organizationDetailsForm.phoneNumber.trim(),
      email: this.organizationDetailsForm.email.trim(),
      office_address: this.organizationDetailsForm.officeAddress.trim(),
      office_address_hindi: this.organizationDetailsForm.officeAddressHindi.trim(),
      office_address_odia: this.organizationDetailsForm.officeAddressOdia.trim(),
      facebook_url: this.organizationDetailsForm.facebookUrl.trim(),
      twitter_url: this.organizationDetailsForm.twitterUrl.trim(),
      linkedin_url: this.organizationDetailsForm.linkedinUrl.trim(),
    };

    this.isSavingOrganizationDetails = true;
    const request = this.http.put(
      apiEndpoints.organizationDetailById(this.organizationDetailsFixedId),
      payload
    );

    request.subscribe({
      next: () => {
        this.showToast('Organization details updated successfully.', 'success-toast');
        this.loadOrganizationDetails();
      },
      error: () => {
        this.showToast('Failed to update organization details.', 'error-toast');
      },
      complete: () => {
        this.isSavingOrganizationDetails = false;
      },
    });
  }

  private resetOrganizationDetailsForm(): void {
    this.organizationDetailsForm = {
      phoneNumber: '',
      email: '',
      officeAddress: '',
      officeAddressHindi: '',
      officeAddressOdia: '',
      facebookUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
    };
  }

  private onOrganizationDetailsInputChange(label: string, value: string): void {
    if (label === 'Phone Number') {
      this.organizationDetailsForm.phoneNumber = value;
      return;
    }

    if (label === 'Email') {
      this.organizationDetailsForm.email = value;
      return;
    }

    if (label === 'Office address') {
      this.organizationDetailsForm.officeAddress = value;
      return;
    }

    if (label === 'Office address(Hindi)') {
      this.organizationDetailsForm.officeAddressHindi = value;
      return;
    }

    if (label === 'Office address(Odia)') {
      this.organizationDetailsForm.officeAddressOdia = value;
      return;
    }

    if (label === 'facebook_url') {
      this.organizationDetailsForm.facebookUrl = value;
      return;
    }

    if (label === 'twitter_url') {
      this.organizationDetailsForm.twitterUrl = value;
      return;
    }

    if (label === 'linkedin_url') {
      this.organizationDetailsForm.linkedinUrl = value;
    }
  }

  private getOrganizationDetailsInputValue(label: string): string {
    if (label === 'Phone Number') {
      return this.organizationDetailsForm.phoneNumber;
    }

    if (label === 'Email') {
      return this.organizationDetailsForm.email;
    }

    if (label === 'Office address') {
      return this.organizationDetailsForm.officeAddress;
    }

    if (label === 'Office address(Hindi)') {
      return this.organizationDetailsForm.officeAddressHindi;
    }

    if (label === 'Office address(Odia)') {
      return this.organizationDetailsForm.officeAddressOdia;
    }

    if (label === 'facebook_url') {
      return this.organizationDetailsForm.facebookUrl;
    }

    if (label === 'twitter_url') {
      return this.organizationDetailsForm.twitterUrl;
    }

    if (label === 'linkedin_url') {
      return this.organizationDetailsForm.linkedinUrl;
    }

    return '';
  }

  private extractOrganizationDetails(response: unknown): OrganizationDetailsApiItem | null {
    if (Array.isArray(response)) {
      return response.length ? (response[0] as OrganizationDetailsApiItem) : null;
    }

    if (!response || typeof response !== 'object') {
      return null;
    }

    const payload = response as {
      data?: unknown;
      organization_details?: unknown;
      organizationDetails?: unknown;
    };

    if (this.isOrganizationDetailsRecord(response)) {
      return response as OrganizationDetailsApiItem;
    }

    if (Array.isArray(payload.data)) {
      return payload.data.length ? (payload.data[0] as OrganizationDetailsApiItem) : null;
    }

    if (payload.data && this.isOrganizationDetailsRecord(payload.data)) {
      return payload.data as OrganizationDetailsApiItem;
    }

    if (Array.isArray(payload.organization_details)) {
      return payload.organization_details.length
        ? (payload.organization_details[0] as OrganizationDetailsApiItem)
        : null;
    }

    if (
      payload.organization_details &&
      !Array.isArray(payload.organization_details) &&
      this.isOrganizationDetailsRecord(payload.organization_details)
    ) {
      return payload.organization_details as OrganizationDetailsApiItem;
    }

    if (Array.isArray(payload.organizationDetails)) {
      return payload.organizationDetails.length
        ? (payload.organizationDetails[0] as OrganizationDetailsApiItem)
        : null;
    }

    if (
      payload.organizationDetails &&
      !Array.isArray(payload.organizationDetails) &&
      this.isOrganizationDetailsRecord(payload.organizationDetails)
    ) {
      return payload.organizationDetails as OrganizationDetailsApiItem;
    }

    return null;
  }

  private isOrganizationDetailsRecord(value: unknown): boolean {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const details = value as OrganizationDetailsApiItem;
    return Boolean(
      details.id !== undefined ||
        details.phone_number !== undefined ||
        details.phoneNumber !== undefined ||
        details.office_address !== undefined ||
        details.officeAddress !== undefined ||
        details.facebook_url !== undefined
    );
  }

  private resolveOrganizationDetailsId(details: OrganizationDetailsApiItem): string | number | null {
    const candidateIds: Array<string | number | null | undefined> = [
      details.id,
      details.organization_details_id,
      details.organization_details_fk,
      details.organization_id,
      details.pk,
    ];

    for (const candidateId of candidateIds) {
      if (candidateId !== null && candidateId !== undefined && candidateId !== '') {
        return candidateId;
      }
    }

    return null;
  }

  private getOrganizationFieldValue(...values: Array<string | null | undefined>): string {
    for (const value of values) {
      if (typeof value === 'string') {
        return value;
      }
    }

    return '';
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

    if (this.isTenderNoticePage()) {
      return apiEndpoints.tenderNotices;
    }

    if (this.isAdvertisementPage()) {
      return apiEndpoints.advertisements;
    }

    if (this.isNewsEventsPage()) {
      return apiEndpoints.newsEvents;
    }

    if (this.isCareerOpportunitiesPage()) {
      return apiEndpoints.opportunities;
    }

    if (this.isPartnersPage()) {
      return apiEndpoints.partners;
    }

    if (this.isCctvDetailsPage()) {
      return apiEndpoints.cctvDetails;
    }

    if (this.isGoverningBodyPage()) {
      return apiEndpoints.governingBodies;
    }

    if (this.isGeneralBodyPage()) {
      return apiEndpoints.generalBodies;
    }

    if (this.isDonorListPage()) {
      return apiEndpoints.donations;
    }

    if (this.isCctvDetailsPage()) {
      return apiEndpoints.cctvDetails;
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

    if (this.isLegalDocumentPage()) {
      return apiEndpoints.legalDocuments;
    }

    if (this.isLegalStatusPage()) {
      return apiEndpoints.legalStatuses;
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

    if (this.isTenderNoticePage()) {
      return apiEndpoints.tenderNoticeById(id);
    }

    if (this.isAdvertisementPage()) {
      return apiEndpoints.advertisementById(id);
    }

    if (this.isNewsEventsPage()) {
      return apiEndpoints.newsEventById(id);
    }

    if (this.isCareerOpportunitiesPage()) {
      return apiEndpoints.opportunityById(id);
    }

    if (this.isPartnersPage()) {
      return apiEndpoints.partnerById(id);
    }

    if (this.isCctvDetailsPage()) {
      return apiEndpoints.cctvDetailById(id);
    }

    if (this.isGoverningBodyPage()) {
      return apiEndpoints.governingBodyById(id);
    }

    if (this.isGeneralBodyPage()) {
      return apiEndpoints.generalBodyById(id);
    }

    if (this.isDonorListPage()) {
      return apiEndpoints.donationById(id);
    }

    if (this.isCctvDetailsPage()) {
      return apiEndpoints.cctvDetailById(id);
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

    if (this.isLegalDocumentPage()) {
      return apiEndpoints.legalDocumentById(id);
    }

    if (this.isLegalStatusPage()) {
      return apiEndpoints.legalStatusById(id);
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

    if (this.isTenderNoticePage()) {
      return 'tender notice';
    }

    if (this.isAdvertisementPage()) {
      return 'advertisement';
    }

    if (this.isNewsEventsPage()) {
      return 'news event';
    }

    if (this.isCareerOpportunitiesPage()) {
      return 'career opportunity';
    }

    if (this.isPartnersPage()) {
      return 'partner';
    }

    if (this.isCctvDetailsPage()) {
      return 'cctv details';
    }

    if (this.isGoverningBodyPage()) {
      return 'governing body';
    }

    if (this.isGeneralBodyPage()) {
      return 'general body';
    }

    if (this.isDonorListPage()) {
      return 'donor';
    }

    if (this.isCctvDetailsPage()) {
      return 'cctv details';
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

    if (this.isLegalDocumentPage()) {
      return 'legal document';
    }

    if (this.isLegalStatusPage()) {
      return 'legal status';
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

    if (this.isTenderNoticePage()) {
      return 'Tender notice';
    }

    if (this.isAdvertisementPage()) {
      return 'Advertisement';
    }

    if (this.isNewsEventsPage()) {
      return 'News event';
    }

    if (this.isCareerOpportunitiesPage()) {
      return 'Career opportunity';
    }

    if (this.isPartnersPage()) {
      return 'Partner';
    }

    if (this.isCctvDetailsPage()) {
      return 'CCTV details';
    }

    if (this.isGoverningBodyPage()) {
      return 'Governing body';
    }

    if (this.isGeneralBodyPage()) {
      return 'General body';
    }

    if (this.isDonorListPage()) {
      return 'Donor';
    }

    if (this.isCctvDetailsPage()) {
      return 'CCTV details';
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

    if (this.isLegalDocumentPage()) {
      return 'Legal document';
    }

    if (this.isLegalStatusPage()) {
      return 'Legal status';
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
      !this.isCareerOpportunitiesPage() &&
      !this.isCctvDetailsPage() &&
      !this.isGoverningBodyPage() &&
      !this.isGeneralBodyPage() &&
      !this.isDonorListPage() &&
      !this.isTenderNoticePage() &&
      !this.isAdvertisementPage() &&
      !this.isNewsEventsPage() &&
      !this.isLegalStatusPage() &&
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
      payload.append('project_name_hindi', this.annualReportForm.projectNameHindi.trim());
      payload.append('project_name_odia', this.annualReportForm.projectNameOdia.trim());
      payload.append('project_details', this.annualReportForm.projectDetails.trim());
      payload.append('project_details_hindi', this.annualReportForm.projectDetailsHindi.trim());
      payload.append('project_details_odia', this.annualReportForm.projectDetailsOdia.trim());
      payload.append('achievement_details', this.annualReportForm.achievementDetails.trim());
      payload.append('achievement_details_hindi', this.annualReportForm.achievementDetailsHindi.trim());
      payload.append('achievement_details_odia', this.annualReportForm.achievementDetailsOdia.trim());
      payload.append('image_path', this.getAnnualReportFilePathForSave('image_path'));
      payload.append('other_image_paths', this.getAnnualReportFilePathForSave('other_image_paths'));
    } else if (this.isProgrammeMasterPage()) {
      payload.append('programme_name', this.annualReportForm.programmeName.trim());
      payload.append('programme_name_hindi', this.annualReportForm.programmeNameHindi.trim());
      payload.append('programme_name_odia', this.annualReportForm.programmeNameOdia.trim());
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
    } else if (this.isTenderNoticePage() || this.isAdvertisementPage() || this.isNewsEventsPage()) {
      payload.append('title', this.annualReportForm.title.trim());
      payload.append('title_hindi', this.annualReportForm.titleHindi.trim());
      payload.append('title_odia', this.annualReportForm.titleOdia.trim());
      payload.append('description', this.annualReportForm.description.trim());
      payload.append('description_hindi', this.annualReportForm.descriptionHindi.trim());
      payload.append('description_odia', this.annualReportForm.descriptionOdia.trim());
      payload.append('opening_date', this.annualReportForm.openingDate.trim());
      payload.append('closing_date', this.annualReportForm.closingDate.trim());
      const detailFilePath = this.getAnnualReportFilePathForSave('detail_file_path');
      if (detailFilePath) {
        payload.append('detail_file_path', detailFilePath);
      }
    } else if (this.isVideoGalleryPage()) {
      payload.append('title', this.annualReportForm.title.trim());
      payload.append('video_path', filePath);
    } else if (this.isImageGalleryPage()) {
      payload.append('title', this.annualReportForm.title.trim());
      payload.append('image_path', filePath);
    } else if (this.isSuccessStoryPage()) {
      payload.append('title', this.annualReportForm.title.trim());
      payload.append('title_hindi', this.annualReportForm.titleHindi.trim());
      payload.append('title_odia', this.annualReportForm.titleOdia.trim());
      payload.append('beneficiary_name', this.annualReportForm.beneficiaryName.trim());
      payload.append('beneficiary_name_hindi', this.annualReportForm.beneficiaryNameHindi.trim());
      payload.append('beneficiary_name_odia', this.annualReportForm.beneficiaryNameOdia.trim());
      payload.append('details', this.annualReportForm.details.trim());
      payload.append('details_hindi', this.annualReportForm.detailsHindi.trim());
      payload.append('details_odia', this.annualReportForm.detailsOdia.trim());
      payload.append('image_path', filePath);
    } else if (this.isBeneficiaryListPage()) {
      payload.append('project_name', this.annualReportForm.title.trim());
      payload.append('no_of_beneficiaries', this.annualReportForm.noOfBeneficiaries.trim());
    } else if (this.isCareerOpportunitiesPage()) {
      payload.append('name_of_post', this.annualReportForm.nameOfPost.trim());
      payload.append('req_qualification', this.annualReportForm.reqQualification.trim());
      payload.append('number_of_post', this.annualReportForm.numberOfPost.trim());
      payload.append('remuneration', this.annualReportForm.remuneration.trim());
      payload.append('closing_date', this.annualReportForm.closingDate.trim());
      payload.append('lower_age', this.annualReportForm.lowerAge.trim());
      payload.append('upper_age', this.annualReportForm.upperAge.trim());
    } else if (this.isPartnersPage()) {
      payload.append('title', this.annualReportForm.title.trim());
      payload.append('logo_path', filePath);
    } else if (this.isCctvDetailsPage()) {
      payload.append('title', this.annualReportForm.title.trim());
      payload.append('project_name', this.annualReportForm.projectName.trim());
      payload.append('project_name_hindi', this.annualReportForm.projectNameHindi.trim());
      payload.append('project_name_odia', this.annualReportForm.projectNameOdia.trim());
      payload.append('serial_number', this.annualReportForm.serialNumber.trim());
    } else if (this.isGoverningBodyPage()) {
      payload.append('name', this.annualReportForm.governingBodyName.trim());
      payload.append('name_hindi', this.annualReportForm.governingBodyNameHindi.trim());
      payload.append('name_odia', this.annualReportForm.governingBodyNameOdia.trim());
      payload.append('position', this.annualReportForm.governingBodyPosition.trim());
      payload.append('qualification', this.annualReportForm.governingBodyQualification.trim());
      payload.append('message', this.annualReportForm.governingBodyMessage.trim());
      payload.append('message_hindi', this.annualReportForm.governingBodyMessageHindi.trim());
      payload.append('message_odia', this.annualReportForm.governingBodyMessageOdia.trim());
      payload.append('image_path', filePath);
    } else if (this.isGeneralBodyPage()) {
      payload.append('name', this.annualReportForm.governingBodyName.trim());
      payload.append('name_hindi', this.annualReportForm.governingBodyNameHindi.trim());
      payload.append('name_odia', this.annualReportForm.governingBodyNameOdia.trim());
      payload.append('position', this.annualReportForm.governingBodyPosition.trim());
      payload.append('image_path', filePath);
    } else if (this.isDonorListPage()) {
      payload.append('donor_name', this.annualReportForm.donorName.trim());
      payload.append('donation_amount', this.annualReportForm.donationAmount.trim());
      payload.append('donation_date', this.annualReportForm.donationDate.trim());
    } else if (this.isLegalStatusPage()) {
      payload.append('status_details', this.annualReportForm.title.trim());
    } else if (this.isLegalDocumentPage()) {
      payload.append('document_name', this.annualReportForm.title.trim());
    } else {
      payload.append('title', this.annualReportForm.title.trim());
    }
    payload.append('display_order', this.annualReportForm.displayOrder);
    payload.append('is_active', this.annualReportForm.isActive ? '1' : '0');
    payload.append('is_uploaded_file', this.annualReportForm.hasNewUploadedFile ? 'true' : 'false');

    if (
      !this.isProgrammeOverviewPage() &&
      !this.isProgrammeDetailsPage() &&
      !this.isProgrammeMasterPage() &&
      !this.isBannerPage() &&
      !this.isTenderNoticePage() &&
      !this.isAdvertisementPage() &&
      !this.isNewsEventsPage() &&
      !this.isSuccessStoryPage() &&
      !this.isMediaCoveragePage() &&
      !this.isAwardsRecognitionPage() &&
      !this.isImageGalleryPage() &&
      !this.isVideoGalleryPage() &&
      !this.isCareerOpportunitiesPage() &&
      !this.isPartnersPage() &&
      !this.isCctvDetailsPage() &&
      !this.isGoverningBodyPage() &&
      !this.isGeneralBodyPage() &&
      !this.isDonorListPage() &&
      !this.isLegalStatusPage()
    ) {
      payload.append('file_path', filePath);
    }

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
      programmeNameHindi: '',
      programmeNameOdia: '',
      projectName: '',
      projectDetails: '',
      projectDetailsHindi: '',
      projectDetailsOdia: '',
      achievementDetails: '',
      achievementDetailsHindi: '',
      achievementDetailsOdia: '',
      startingYear: '',
      supportedBy: '',
      status: '',
      strength: '',
      beneficiariesCovered: '',
      title: '',
      titleHindi: '',
      titleOdia: '',
      description: '',
      descriptionHindi: '',
      descriptionOdia: '',
      openingDate: '',
      closingDate: '',
      detailFilePath: '',
      subTitle: '',
      altText: '',
      imagePath: '',
      logoPath: '',
      otherImagePaths: '',
      beneficiaryName: '',
      beneficiaryNameHindi: '',
      beneficiaryNameOdia: '',
      details: '',
      detailsHindi: '',
      detailsOdia: '',
      dateTime: '',
      noOfBeneficiaries: '',
      projectNameHindi: '',
      projectNameOdia: '',
      serialNumber: '',
      nameOfPost: '',
      reqQualification: '',
      numberOfPost: '',
      remuneration: '',
      lowerAge: '',
      upperAge: '',
      governingBodyName: '',
      governingBodyNameHindi: '',
      governingBodyNameOdia: '',
      governingBodyPosition: '',
      governingBodyQualification: '',
      governingBodyMessage: '',
      governingBodyMessageHindi: '',
      governingBodyMessageOdia: '',
      donorName: '',
      donationAmount: '',
      donationDate: '',
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
      tender_notices?: unknown;
      tenderNotices?: unknown;
      advertisements?: unknown;
      advertisement?: unknown;
      news_events?: unknown;
      newsEvents?: unknown;
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
      partners?: unknown;
      partner?: unknown;
      cctv_details?: unknown;
      cctvDetails?: unknown;
      opportunities?: unknown;
      opportunity?: unknown;
      governing_bodies?: unknown;
      governingBodies?: unknown;
      governing_body?: unknown;
      governingBody?: unknown;
      general_bodies?: unknown;
      generalBodies?: unknown;
      general_body?: unknown;
      generalBody?: unknown;
      donations?: unknown;
      donor_list?: unknown;
      donorList?: unknown;
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

    if (Array.isArray(payload.tender_notices)) {
      return payload.tender_notices as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.tenderNotices)) {
      return payload.tenderNotices as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.advertisements)) {
      return payload.advertisements as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.advertisement)) {
      return payload.advertisement as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.news_events)) {
      return payload.news_events as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.newsEvents)) {
      return payload.newsEvents as AnnualReportApiItem[];
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

    if (Array.isArray(payload.partners)) {
      return payload.partners as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.partner)) {
      return payload.partner as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.cctv_details)) {
      return payload.cctv_details as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.cctvDetails)) {
      return payload.cctvDetails as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.opportunities)) {
      return payload.opportunities as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.opportunity)) {
      return payload.opportunity as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.governing_bodies)) {
      return payload.governing_bodies as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.governingBodies)) {
      return payload.governingBodies as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.governing_body)) {
      return payload.governing_body as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.governingBody)) {
      return payload.governingBody as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.general_bodies)) {
      return payload.general_bodies as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.generalBodies)) {
      return payload.generalBodies as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.general_body)) {
      return payload.general_body as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.generalBody)) {
      return payload.generalBody as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.donations)) {
      return payload.donations as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.donor_list)) {
      return payload.donor_list as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.donorList)) {
      return payload.donorList as AnnualReportApiItem[];
    }

    return [];
  }

  private extractReport(response: unknown): AnnualReportApiItem | null {
    if (!response || typeof response !== 'object') {
      return null;
    }

    const directReport = response as AnnualReportApiItem;
    if (
      directReport.id !== undefined ||
      directReport.title !== undefined ||
      directReport.name_of_post !== undefined ||
      directReport.name !== undefined
    ) {
      return directReport;
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
      tender_notice?: unknown;
      tenderNotice?: unknown;
      advertisement?: unknown;
      news_event?: unknown;
      newsEvent?: unknown;
      banner?: unknown;
      media_coverage?: unknown;
      mediaCoverage?: unknown;
      awards_recognition?: unknown;
      awardsRecognition?: unknown;
      image_gallery?: unknown;
      imageGallery?: unknown;
      video_gallery?: unknown;
      videoGallery?: unknown;
      opportunity?: unknown;
      partner?: unknown;
      partners?: unknown;
      cctv_detail?: unknown;
      cctvDetails?: unknown;
      cctv_details?: unknown;
      governing_body?: unknown;
      governingBody?: unknown;
      governing_bodies?: unknown;
      donation?: unknown;
      donor?: unknown;
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

    if (
      payload.tender_notice &&
      !Array.isArray(payload.tender_notice) &&
      typeof payload.tender_notice === 'object'
    ) {
      return payload.tender_notice as AnnualReportApiItem;
    }

    if (
      payload.tenderNotice &&
      !Array.isArray(payload.tenderNotice) &&
      typeof payload.tenderNotice === 'object'
    ) {
      return payload.tenderNotice as AnnualReportApiItem;
    }

    if (
      payload.advertisement &&
      !Array.isArray(payload.advertisement) &&
      typeof payload.advertisement === 'object'
    ) {
      return payload.advertisement as AnnualReportApiItem;
    }

    if (
      payload.news_event &&
      !Array.isArray(payload.news_event) &&
      typeof payload.news_event === 'object'
    ) {
      return payload.news_event as AnnualReportApiItem;
    }

    if (
      payload.newsEvent &&
      !Array.isArray(payload.newsEvent) &&
      typeof payload.newsEvent === 'object'
    ) {
      return payload.newsEvent as AnnualReportApiItem;
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

    if (payload.partners && !Array.isArray(payload.partners) && typeof payload.partners === 'object') {
      return payload.partners as AnnualReportApiItem;
    }

    if (payload.partner && !Array.isArray(payload.partner) && typeof payload.partner === 'object') {
      return payload.partner as AnnualReportApiItem;
    }

    if (
      payload.cctv_detail &&
      !Array.isArray(payload.cctv_detail) &&
      typeof payload.cctv_detail === 'object'
    ) {
      return payload.cctv_detail as AnnualReportApiItem;
    }

    if (
      payload.cctv_details &&
      !Array.isArray(payload.cctv_details) &&
      typeof payload.cctv_details === 'object'
    ) {
      return payload.cctv_details as AnnualReportApiItem;
    }

    if (
      payload.cctvDetails &&
      !Array.isArray(payload.cctvDetails) &&
      typeof payload.cctvDetails === 'object'
    ) {
      return payload.cctvDetails as AnnualReportApiItem;
    }

    if (
      payload.opportunity &&
      !Array.isArray(payload.opportunity) &&
      typeof payload.opportunity === 'object'
    ) {
      return payload.opportunity as AnnualReportApiItem;
    }

    if (
      payload.governing_body &&
      !Array.isArray(payload.governing_body) &&
      typeof payload.governing_body === 'object'
    ) {
      return payload.governing_body as AnnualReportApiItem;
    }

    if (
      payload.governingBody &&
      !Array.isArray(payload.governingBody) &&
      typeof payload.governingBody === 'object'
    ) {
      return payload.governingBody as AnnualReportApiItem;
    }

    if (
      payload.governing_bodies &&
      !Array.isArray(payload.governing_bodies) &&
      typeof payload.governing_bodies === 'object'
    ) {
      return payload.governing_bodies as AnnualReportApiItem;
    }

    if (
      payload.donation &&
      !Array.isArray(payload.donation) &&
      typeof payload.donation === 'object'
    ) {
      return payload.donation as AnnualReportApiItem;
    }

    if (payload.donor && !Array.isArray(payload.donor) && typeof payload.donor === 'object') {
      return payload.donor as AnnualReportApiItem;
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
      id: this.resolveReportId(report) ?? '',
      slNo: String(index + 1).padStart(2, '0'),
      programme_name: report.programme_name || report.title || 'Untitled',
      programme_name_hindi: report.programme_name_hindi || '-',
      programme_name_odia: report.programme_name_odia || '-',
      project_name: report.project_name || '-',
      project_name_hindi: report.project_name_hindi || '-',
      project_name_odia: report.project_name_odia || '-',
      project_details_hindi: report.project_details_hindi || '-',
      project_details_odia: report.project_details_odia || '-',
      achievement_details_hindi: report.achievement_details_hindi || '-',
      achievement_details_odia: report.achievement_details_odia || '-',
      serial_number: report.serial_number || '-',
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
      title: report.title || report.document_name || report.status_details || 'Untitled',
      title_hindi: report.title_hindi || '-',
      title_odia: report.title_odia || '-',
      status_details: report.status_details || '-',
      description: report.description || '-',
      description_hindi: report.description_hindi || '-',
      description_odia: report.description_odia || '-',
      opening_date: this.formatDate(report.opening_date),
      closing_date: this.formatDate(report.closing_date),
      detail_file_path: report.detail_file_path || '-',
      sub_title: report.sub_title || '-',
      alt_text: report.alt_text || '-',
      beneficiary_name: report.beneficiary_name || '-',
      beneficiary_name_hindi: report.beneficiary_name_hindi || '-',
      beneficiary_name_odia: report.beneficiary_name_odia || '-',
      details: report.details || '-',
      details_hindi: report.details_hindi || '-',
      details_odia: report.details_odia || '-',
      date_time: this.formatDateTime(report.date_time),
      video_path: report.video_path || '-',
      image_path: report.image_path || '-',
      logo_path: report.logo_path || '-',
      other_image_paths: report.other_image_paths || '-',
      display_order:
        report.display_order === null || report.display_order === undefined
          ? '-'
          : String(report.display_order),
      is_active: this.toBoolean(report.is_active ?? report.isactive) ? 'Active' : 'Inactive',
      noOfBeneficiaries:
        report.no_of_beneficiaries === null || report.no_of_beneficiaries === undefined
          ? '-'
          : String(report.no_of_beneficiaries),
      name_of_post: report.name_of_post || report.nameOfPost || '-',
      req_qualification: report.req_qualification || report.reqQualification || '-',
      number_of_post:
        report.number_of_post === null || report.number_of_post === undefined
          ? report.numberOfPost === null || report.numberOfPost === undefined
            ? '-'
            : String(report.numberOfPost)
          : String(report.number_of_post),
      remuneration: report.remuneration || '-',
      lower_age:
        report.lower_age === null || report.lower_age === undefined
          ? report.lowerAge === null || report.lowerAge === undefined
            ? '-'
            : String(report.lowerAge)
          : String(report.lower_age),
      upper_age:
        report.upper_age === null || report.upper_age === undefined
          ? report.upperAge === null || report.upperAge === undefined
            ? '-'
            : String(report.upperAge)
          : String(report.upper_age),
      donor_name: report.donor_name || '-',
      name: report.name || '-',
      name_hindi: report.name_hindi || '-',
      name_odia: report.name_odia || '-',
      position: report.position || '-',
      qualification: report.qualification || '-',
      message: report.message || '-',
      message_hindi: report.message_hindi || '-',
      message_odia: report.message_odia || '-',
      donation_amount:
        report.donation_amount === null || report.donation_amount === undefined
          ? '-'
          : String(report.donation_amount),
      donation_date: this.formatDate(report.donation_date),
      createdDate: this.formatDate(report.created_at),
      action: this.resolveActionLabel(report),
    }));
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
  }

  private resolveReportId(report: AnnualReportApiItem): string | number | null {
    const candidateIds: Array<string | number | null | undefined> = [
      report.id,
      report.cctv_details_id,
      report.cctv_details_fk,
      report.cctv_detail_id,
      report.cctv_id,
      report.governing_bodies_id,
      report.governing_body_id,
      report.governing_body_fk,
      report.general_bodies_id,
      report.general_body_id,
      report.general_body_fk,
      report.donation_id,
      report.donor_id,
      report.opportunity_id,
      report.opportunityId,
      report.report_id,
      report.reportId,
    ];

    for (const candidateId of candidateIds) {
      if (candidateId !== null && candidateId !== undefined && candidateId !== '') {
        return candidateId;
      }
    }

    return null;
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

  private toDateValue(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private resolveActionLabel(report: AnnualReportApiItem): string {
    return report.file || report.file_url || report.download_url || report.detail_file_path
      ? 'Download File'
      : 'Unavailable';
  }

  private resolveExistingFileName(report: AnnualReportApiItem): string {
    const fallbackPath =
      report.video_path ||
      report.image_path ||
      report.logo_path ||
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
      report.logo_path ||
      report.download_url ||
      report.file_url ||
      report.file_path ||
      report.file ||
      '';
    return apiEndpoints.publicAsset(fileUrl);
  }

  private getAnnualReportFilePathForSave(label: 'image_path' | 'other_image_paths' | 'detail_file_path' = 'image_path'): string {
    if (label === 'other_image_paths') {
      const joinedPaths = this.getOtherImagePathList().join(',');
      return joinedPaths || this.annualReportForm.otherUploadedFilePath || this.annualReportForm.otherExistingFilePath;
    }

    if (this.isPartnersPage()) {
      return this.annualReportForm.uploadedFilePath || this.annualReportForm.existingFilePath;
    }

    if (label === 'detail_file_path') {
      return this.annualReportForm.detailFilePath || this.annualReportForm.uploadedFilePath || this.annualReportForm.existingFilePath;
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
          this.annualReportForm.otherImagePaths = this.annualReportForm.otherImagePaths
            ? `${this.annualReportForm.otherImagePaths},${filePath}`
            : filePath;
          this.annualReportForm.hasNewOtherUploadedFile = true;
          return;
        }

        if (label === 'detail_file_path') {
          this.annualReportForm.detailFilePath = filePath;
          this.annualReportForm.existingFilePath = filePath;
          this.annualReportForm.existingFileUrl = apiEndpoints.publicAsset(filePath);
          this.annualReportForm.existingFileName = file.name;
          this.annualReportForm.hasNewUploadedFile = true;
          return;
        }

        if (label === 'logo_path') {
          this.annualReportForm.uploadedFilePath = filePath;
          this.annualReportForm.existingFilePath = filePath;
          this.annualReportForm.existingFileUrl = apiEndpoints.publicAsset(filePath);
          this.annualReportForm.existingFileName = file.name;
          this.annualReportForm.logoPath = filePath;
          this.annualReportForm.imagePath = filePath;
          this.annualReportForm.hasNewUploadedFile = true;
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

  private async uploadAnnualReportFiles(files: File[], label: string): Promise<void> {
    if (!files.length) {
      return;
    }

    this.isUploadingAnnualReportFile = true;

    try {
      for (const file of files) {
        const payload = new FormData();
        payload.append('file', file);

        const response = await firstValueFrom(this.http.post<unknown>(apiEndpoints.upload, payload));
        const filePath = this.extractUploadedFilePath(response);
        if (!filePath) {
          this.showToast('File uploaded, but file path was missing in response.', 'warn-toast');
          continue;
        }

        if (label === 'other_image_paths') {
          this.annualReportForm.otherUploadedFilePath = filePath;
          this.annualReportForm.otherExistingFilePath = filePath;
          this.annualReportForm.otherExistingFileUrl = apiEndpoints.publicAsset(filePath);
          this.annualReportForm.otherExistingFileName = file.name;
          this.annualReportForm.otherImagePaths = this.annualReportForm.otherImagePaths
            ? `${this.annualReportForm.otherImagePaths},${filePath}`
            : filePath;
          this.annualReportForm.hasNewOtherUploadedFile = true;
        } else if (label === 'detail_file_path') {
          this.annualReportForm.detailFilePath = filePath;
          this.annualReportForm.existingFilePath = filePath;
          this.annualReportForm.existingFileUrl = apiEndpoints.publicAsset(filePath);
          this.annualReportForm.existingFileName = file.name;
          this.annualReportForm.hasNewUploadedFile = true;
        } else if (label === 'logo_path') {
          this.annualReportForm.uploadedFilePath = filePath;
          this.annualReportForm.existingFilePath = filePath;
          this.annualReportForm.existingFileUrl = apiEndpoints.publicAsset(filePath);
          this.annualReportForm.existingFileName = file.name;
          this.annualReportForm.logoPath = filePath;
          this.annualReportForm.imagePath = filePath;
          this.annualReportForm.hasNewUploadedFile = true;
        } else {
          this.annualReportForm.uploadedFilePath = filePath;
          this.annualReportForm.existingFilePath = filePath;
          this.annualReportForm.existingFileUrl = apiEndpoints.publicAsset(filePath);
          this.annualReportForm.existingFileName = file.name;
          this.annualReportForm.imagePath = filePath;
          this.annualReportForm.hasNewUploadedFile = true;
        }
      }
    } catch {
      this.showToast('Failed to upload file.', 'error-toast');
    } finally {
      this.isUploadingAnnualReportFile = false;
    }
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
  cctv_details_id?: number | string | null;
  cctv_details_fk?: number | string | null;
  cctv_detail_id?: number | string | null;
  cctv_id?: number | string | null;
  opportunity_id?: number | string | null;
  opportunityId?: number | string | null;
  report_id?: number | string | null;
  reportId?: number | string | null;
  programme_master_fk?: number | string | null;
  projects_fk?: number | string | null;
  programme_name?: string;
  programme_name_hindi?: string;
  programme_name_odia?: string;
  project_name?: string;
  project_name_hindi?: string;
  project_name_odia?: string;
  serial_number?: string;
  project_details?: string;
  project_details_hindi?: string;
  project_details_odia?: string;
  achievement_details?: string;
  achievement_details_hindi?: string;
  achievement_details_odia?: string;
  starting_year?: number | string | null;
  supported_by?: string | null;
  status?: string | null;
  strength?: number | string | null;
  beneficiaries_covered?: number | string | null;
  title?: string;
  title_hindi?: string;
  title_odia?: string;
  document_name?: string;
  status_details?: string;
  description?: string;
  description_hindi?: string;
  description_odia?: string;
  opening_date?: string | null;
  closing_date?: string | null;
  detail_file_path?: string | null;
  sub_title?: string;
  alt_text?: string;
  beneficiary_name?: string;
  beneficiary_name_hindi?: string;
  beneficiary_name_odia?: string;
  details?: string;
  details_hindi?: string;
  details_odia?: string;
  date_time?: string | null;
  video_path?: string | null;
  image_path?: string | null;
  logo_path?: string | null;
  other_image_paths?: string | null;
  no_of_beneficiaries?: number | string | null;
  name_of_post?: string;
  nameOfPost?: string;
  req_qualification?: string;
  reqQualification?: string;
  number_of_post?: number | string | null;
  numberOfPost?: number | string | null;
  remuneration?: string;
  lower_age?: number | string | null;
  lowerAge?: number | string | null;
  upper_age?: number | string | null;
  upperAge?: number | string | null;
  name?: string;
  name_hindi?: string;
  name_odia?: string;
  position?: string;
  qualification?: string;
  message?: string;
  message_hindi?: string;
  message_odia?: string;
  governing_bodies_id?: number | string | null;
  governing_body_id?: number | string | null;
  governing_body_fk?: number | string | null;
  general_bodies_id?: number | string | null;
  general_body_id?: number | string | null;
  general_body_fk?: number | string | null;
  donor_name?: string;
  donation_amount?: number | string | null;
  donation_date?: string | null;
  donation_id?: number | string | null;
  donor_id?: number | string | null;
  created_at?: string | null;
  is_active?: boolean | number | string | null;
  isactive?: boolean | number | string | null;
  file?: string | null;
  file_name?: string | null;
  file_path?: string | null;
  file_url?: string | null;
  download_url?: string | null;
  display_order?: number | string | null;
  displayOrder?: number | string | null;
}

interface AnnualReportFormState {
  programmeMasterFk: string;
  projectFk: string;
  programmeName: string;
  programmeNameHindi: string;
  programmeNameOdia: string;
  projectName: string;
  projectDetails: string;
  projectDetailsHindi: string;
  projectDetailsOdia: string;
  achievementDetails: string;
  achievementDetailsHindi: string;
  achievementDetailsOdia: string;
  startingYear: string;
  supportedBy: string;
  status: string;
  strength: string;
  beneficiariesCovered: string;
  title: string;
  titleHindi: string;
  titleOdia: string;
  description: string;
  descriptionHindi: string;
  descriptionOdia: string;
  openingDate: string;
  closingDate: string;
  detailFilePath: string;
  subTitle: string;
  altText: string;
  imagePath: string;
  logoPath: string;
  otherImagePaths: string;
  beneficiaryName: string;
  beneficiaryNameHindi: string;
  beneficiaryNameOdia: string;
  details: string;
  detailsHindi: string;
  detailsOdia: string;
  dateTime: string;
  noOfBeneficiaries: string;
  projectNameHindi: string;
  projectNameOdia: string;
  serialNumber: string;
  nameOfPost: string;
  reqQualification: string;
  numberOfPost: string;
  remuneration: string;
  lowerAge: string;
  upperAge: string;
  governingBodyName: string;
  governingBodyNameHindi: string;
  governingBodyNameOdia: string;
  governingBodyPosition: string;
  governingBodyQualification: string;
  governingBodyMessage: string;
  governingBodyMessageHindi: string;
  governingBodyMessageOdia: string;
  donorName: string;
  donationAmount: string;
  donationDate: string;
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

interface OrganizationDetailsApiItem {
  id?: number | string | null;
  pk?: number | string | null;
  organization_details_id?: number | string | null;
  organization_details_fk?: number | string | null;
  organization_id?: number | string | null;
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
  facebook_url?: string;
  facebookUrl?: string;
  twitter_url?: string;
  twitterUrl?: string;
  linkedin_url?: string;
  linkedinUrl?: string;
}

interface OrganizationDetailsFormState {
  phoneNumber: string;
  email: string;
  officeAddress: string;
  officeAddressHindi: string;
  officeAddressOdia: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
}
