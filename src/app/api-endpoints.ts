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
  successStories: `${apiBaseUrl}/success_stories`,
  successStoryById: (id: string | number) => `${apiBaseUrl}/success_stories/${id}`,
  mediaCoverages: `${apiBaseUrl}/media_coverages`,
  mediaCoverageById: (id: string | number) => `${apiBaseUrl}/media_coverages/${id}`,
  awardsRecognitions: `${apiBaseUrl}/awards_recognitions`,
  awardsRecognitionById: (id: string | number) => `${apiBaseUrl}/awards_recognitions/${id}`,
  imageGalleries: `${apiBaseUrl}/image_gallery`,
  imageGalleryById: (id: string | number) => `${apiBaseUrl}/image_gallery/${id}`,
  videoGalleries: `${apiBaseUrl}/video_gallery`,
  videoGalleryById: (id: string | number) => `${apiBaseUrl}/video_gallery/${id}`,
  upload: `${apiBaseUrl}/upload`,
  publicAsset: (path: string) => toPublicAssetUrl(path),
} as const;
