import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { apiEndpoints } from '../api-endpoints';
import { MaterialModule } from '../material.module';
import { AdminPageDefinition, AdminTableColumn, AdminTableRow } from './admin-data';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss'],
})
export class AdminContentComponent implements OnInit {
  readonly page: AdminPageDefinition;
  private readonly annualReportsApiUrl = apiEndpoints.annualReports;
  isSavingAnnualReport = false;
  isUploadingAnnualReportFile = false;
  private editingAnnualReportId: string | number | null = null;

  private annualReportForm: AnnualReportFormState = {
    title: '',
    noOfBeneficiaries: '',
    displayOrder: '',
    isActive: true,
    file: null,
    existingFileName: '',
    existingFilePath: '',
    existingFileUrl: '',
    uploadedFilePath: '',
    hasNewUploadedFile: false,
  };

  constructor(
    route: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly snackBar: MatSnackBar
  ) {
    this.page = route.snapshot.data['page'] as AdminPageDefinition;
  }

  ngOnInit(): void {
    if (this.isReportPage() && this.page.table) {
      this.loadAnnualReportRows();
    }
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
          title: this.isBeneficiaryListPage() ? (report.project_name || '') : (report.title || ''),
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
          existingFilePath: report.file_path || report.file_url || report.download_url || report.file || '',
          existingFileUrl: this.resolveExistingFileUrl(report),
          uploadedFilePath: '',
          hasNewUploadedFile: false,
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

    if (label === 'Title' || label === 'Project Name') {
      this.annualReportForm.title = value;
    }

    if (label === 'Display Order') {
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

    if (label === 'Title' || label === 'Project Name') {
      return this.annualReportForm.title;
    }

    if (label === 'Display Order') {
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
    if (!this.isReportPage() || label !== 'Is Active') {
      return false;
    }

    return this.annualReportForm.isActive;
  }

  onAnnualReportFileSelected(event: Event): void {
    if (!this.isReportPage()) {
      return;
    }

    const input = event.target as HTMLInputElement;
    this.annualReportForm.file = input.files && input.files[0] ? input.files[0] : null;
    if (!this.annualReportForm.file) {
      return;
    }

    this.uploadAnnualReportFile(this.annualReportForm.file);
  }

  getAnnualReportFileNote(defaultNote: string | undefined): string {
    if (!this.isReportPage()) {
      return defaultNote || 'No file chosen';
    }

    return (
      this.annualReportForm.file?.name ||
      this.annualReportForm.existingFileName ||
      defaultNote ||
      'No file chosen'
    );
  }

  hasAnnualReportDownload(): boolean {
    return Boolean(this.getAnnualReportDownloadUrl());
  }

  getAnnualReportDownloadUrl(): string {
    if (!this.isReportPage()) {
      return '';
    }

    return this.annualReportForm.existingFileUrl;
  }

  isReportPage(): boolean {
    return (
      this.page.title === 'Annual Report' ||
      this.page.title === 'Audit Report' ||
      this.page.title === 'Beneficiary List' ||
      this.page.title === 'Staff List' ||
      this.page.title === 'Food Menu'
    );
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

  private getReportsApiUrl(): string {
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
    if (!filePath) {
      return;
    }

    const payload = new FormData();
    if (this.isBeneficiaryListPage()) {
      payload.append('project_name', this.annualReportForm.title.trim());
      payload.append('no_of_beneficiaries', this.annualReportForm.noOfBeneficiaries.trim());
    } else {
      payload.append('title', this.annualReportForm.title.trim());
    }
    payload.append('display_order', this.annualReportForm.displayOrder);
    payload.append('is_active', this.annualReportForm.isActive ? '1' : '0');
    payload.append('file_path', filePath);
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
      title: '',
      noOfBeneficiaries: '',
      displayOrder: '',
      isActive: true,
      file: null,
      existingFileName: '',
      existingFilePath: '',
      existingFileUrl: '',
      uploadedFilePath: '',
      hasNewUploadedFile: false,
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
      annual_reports?: unknown;
      annualReports?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.annual_reports)) {
      return payload.annual_reports as AnnualReportApiItem[];
    }

    if (Array.isArray(payload.annualReports)) {
      return payload.annualReports as AnnualReportApiItem[];
    }

    return [];
  }

  private extractReport(response: unknown): AnnualReportApiItem | null {
    if (!response || typeof response !== 'object') {
      return null;
    }

    const payload = response as {
      data?: unknown;
      annual_report?: unknown;
      annualReport?: unknown;
    };

    if (payload.data && !Array.isArray(payload.data) && typeof payload.data === 'object') {
      return payload.data as AnnualReportApiItem;
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
      title: report.title || 'Untitled',
      project_name: report.project_name || report.title || 'Untitled',
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

  private resolveActionLabel(report: AnnualReportApiItem): string {
    return report.file || report.file_url || report.download_url
      ? 'Download PDF'
      : 'Unavailable';
  }

  private resolveExistingFileName(report: AnnualReportApiItem): string {
    const fallbackPath = report.file_path || report.file_url || report.download_url || report.file || '';
    return report.file_name || this.extractFileName(fallbackPath);
  }

  private resolveExistingFileUrl(report: AnnualReportApiItem): string {
    const fileUrl = report.download_url || report.file_url || report.file_path || report.file || '';
    return apiEndpoints.publicAsset(fileUrl);
  }

  private getAnnualReportFilePathForSave(): string {
    return this.annualReportForm.uploadedFilePath || this.annualReportForm.existingFilePath;
  }

  private extractFileName(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const normalizedValue = value.split('?')[0].split('#')[0];
    const segments = normalizedValue.split('/').filter(Boolean);
    return segments[segments.length - 1] || value;
  }

  private uploadAnnualReportFile(file: File): void {
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

        this.annualReportForm.uploadedFilePath = filePath;
        this.annualReportForm.existingFilePath = filePath;
        this.annualReportForm.existingFileUrl = apiEndpoints.publicAsset(filePath);
        this.annualReportForm.existingFileName = file.name;
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
  title?: string;
  project_name?: string;
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
  title: string;
  noOfBeneficiaries: string;
  displayOrder: string;
  isActive: boolean;
  file: File | null;
  existingFileName: string;
  existingFilePath: string;
  existingFileUrl: string;
  uploadedFilePath: string;
  hasNewUploadedFile: boolean;
}
