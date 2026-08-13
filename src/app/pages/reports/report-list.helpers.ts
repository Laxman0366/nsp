import { apiEndpoints } from '../../api-endpoints';

export interface ReportApiItem {
  id?: number | string | null;
  title?: string;
  document_name?: string;
  status_details?: string;
  project_name?: string;
  no_of_beneficiaries?: number | string | null;
  created_at?: string | null;
  file?: string | null;
  file_name?: string | null;
  file_path?: string | null;
  file_url?: string | null;
  download_url?: string | null;
  display_order?: number | string | null;
}

export interface ReportTableRow {
  slNo: string;
  title: string;
  createdDate: string;
  downloadLabel: string;
  downloadUrl: string;
}

export interface BeneficiaryTableRow extends ReportTableRow {
  projectName: string;
  noOfBeneficiaries: string;
}

export function extractReports(response: unknown): ReportApiItem[] {
  if (Array.isArray(response)) {
    return response as ReportApiItem[];
  }

  if (!response || typeof response !== 'object') {
    return [];
  }

  const payload = response as {
    data?: unknown;
    annual_reports?: unknown;
    annualReports?: unknown;
    audit_reports?: unknown;
    auditReports?: unknown;
    beneficiary_report?: unknown;
    beneficiaryReport?: unknown;
    staffs?: unknown;
    food_menu?: unknown;
    foodMenu?: unknown;
    legal_documents?: unknown;
    legalDocuments?: unknown;
    legal_status?: unknown;
    legalStatus?: unknown;
  };

  if (Array.isArray(payload.data)) {
    return payload.data as ReportApiItem[];
  }

  if (Array.isArray(payload.annual_reports)) {
    return payload.annual_reports as ReportApiItem[];
  }

  if (Array.isArray(payload.annualReports)) {
    return payload.annualReports as ReportApiItem[];
  }

  if (Array.isArray(payload.audit_reports)) {
    return payload.audit_reports as ReportApiItem[];
  }

  if (Array.isArray(payload.auditReports)) {
    return payload.auditReports as ReportApiItem[];
  }

  if (Array.isArray(payload.beneficiary_report)) {
    return payload.beneficiary_report as ReportApiItem[];
  }

  if (Array.isArray(payload.beneficiaryReport)) {
    return payload.beneficiaryReport as ReportApiItem[];
  }

  if (Array.isArray(payload.staffs)) {
    return payload.staffs as ReportApiItem[];
  }

  if (Array.isArray(payload.food_menu)) {
    return payload.food_menu as ReportApiItem[];
  }

  if (Array.isArray(payload.foodMenu)) {
    return payload.foodMenu as ReportApiItem[];
  }

  if (Array.isArray(payload.legal_documents)) {
    return payload.legal_documents as ReportApiItem[];
  }

  if (Array.isArray(payload.legalDocuments)) {
    return payload.legalDocuments as ReportApiItem[];
  }

  if (Array.isArray(payload.legal_status)) {
    return payload.legal_status as ReportApiItem[];
  }

  if (Array.isArray(payload.legalStatus)) {
    return payload.legalStatus as ReportApiItem[];
  }

  return [];
}

export function toReportRows(reports: ReportApiItem[]): ReportTableRow[] {
  return sortReports(reports).map((report, index) => ({
    slNo: String(index + 1).padStart(2, '0'),
    title: report.title || report.document_name || report.status_details || 'Untitled',
    createdDate: formatDate(report.created_at),
    downloadLabel: resolveDownloadLabel(report),
    downloadUrl: resolveDownloadUrl(report),
  }));
}

export function toBeneficiaryRows(reports: ReportApiItem[]): BeneficiaryTableRow[] {
  return sortReports(reports).map((report, index) => ({
    slNo: String(index + 1).padStart(2, '0'),
    title: report.title || report.project_name || 'Untitled',
    projectName: report.project_name || report.title || 'Untitled',
    noOfBeneficiaries:
      report.no_of_beneficiaries === null || report.no_of_beneficiaries === undefined
        ? '-'
        : String(report.no_of_beneficiaries),
    createdDate: formatDate(report.created_at),
    downloadLabel: resolveDownloadLabel(report),
    downloadUrl: resolveDownloadUrl(report),
  }));
}

function sortReports(reports: ReportApiItem[]): ReportApiItem[] {
  return [...reports].sort((left, right) => toNumber(left.display_order) - toNumber(right.display_order));
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
}

function formatDate(value: string | null | undefined): string {
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

function resolveDownloadLabel(report: ReportApiItem): string {
  return resolveDownloadUrl(report) ? 'Download PDF' : 'Unavailable';
}

function resolveDownloadUrl(report: ReportApiItem): string {
  const fileUrl = report.download_url || report.file_url || report.file_path || report.file || '';
  return apiEndpoints.publicAsset(fileUrl);
}
