import { environment } from '../environments/environment';

const apiBaseUrl = environment.apiBaseUrl.replace(/\/+$/, '');
const publicBaseUrl = environment.publicBaseUrl.replace(/\/+$/, '');

function toPublicAssetUrl(path: string): string {
  if (!path) {
    return '';
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${publicBaseUrl}${normalizedPath}`;
}

export const apiEndpoints = {
  annualReports: `${apiBaseUrl}/annual_reports`,
  annualReportById: (id: string | number) => `${apiBaseUrl}/annual_reports/${id}`,
  auditReports: `${apiBaseUrl}/audit_reports`,
  auditReportById: (id: string | number) => `${apiBaseUrl}/audit_reports/${id}`,
  staffLists: `${apiBaseUrl}/staffs`,
  staffListById: (id: string | number) => `${apiBaseUrl}/staffs/${id}`,
  foodMenus: `${apiBaseUrl}/food_menu`,
  foodMenuById: (id: string | number) => `${apiBaseUrl}/food_menu/${id}`,
  beneficiaryLists: `${apiBaseUrl}/beneficiary_report`,
  beneficiaryListById: (id: string | number) => `${apiBaseUrl}/beneficiary_report/${id}`,
  upload: `${apiBaseUrl}/upload`,
  publicAsset: (path: string) => toPublicAssetUrl(path),
} as const;
