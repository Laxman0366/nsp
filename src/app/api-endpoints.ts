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
  login: `${apiBaseUrl}/login`,
  programmeMasters: `${apiBaseUrl}/programme_master`,
  programmeMasterById: (id: string | number) => `${apiBaseUrl}/programme_master/${id}`,
  programmeDetails: `${apiBaseUrl}/projects`,
  programmeDetailById: (id: string | number) => `${apiBaseUrl}/projects/${id}`,
  programmeOverviews: `${apiBaseUrl}/programme_overview`,
  programmeOverviewById: (id: string | number) => `${apiBaseUrl}/programme_overview/${id}`,
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
  tenderNotices: `${apiBaseUrl}/tender_notices`,
  tenderNoticeById: (id: string | number) => `${apiBaseUrl}/tender_notices/${id}`,
  advertisements: `${apiBaseUrl}/advertisements`,
  advertisementById: (id: string | number) => `${apiBaseUrl}/advertisements/${id}`,
  newsEvents: `${apiBaseUrl}/news_events`,
  newsEventById: (id: string | number) => `${apiBaseUrl}/news_events/${id}`,
  mediaCoverages: `${apiBaseUrl}/media_coverages`,
  mediaCoverageById: (id: string | number) => `${apiBaseUrl}/media_coverages/${id}`,
  awardsRecognitions: `${apiBaseUrl}/awards_recognitions`,
  awardsRecognitionById: (id: string | number) => `${apiBaseUrl}/awards_recognitions/${id}`,
  imageGalleries: `${apiBaseUrl}/image_gallery`,
  imageGalleryById: (id: string | number) => `${apiBaseUrl}/image_gallery/${id}`,
  videoGalleries: `${apiBaseUrl}/video_gallery`,
  videoGalleryById: (id: string | number) => `${apiBaseUrl}/video_gallery/${id}`,
  opportunities: `${apiBaseUrl}/open-opportunities`,
  opportunityById: (id: string | number) => `${apiBaseUrl}/open-opportunities/${id}`,
  adminCareerOpportunities: `${apiBaseUrl}/opportunities`,
  adminCareerOpportunityById: (id: string | number) => `${apiBaseUrl}/opportunities/${id}`,
  openJobs: `${apiBaseUrl}/open_jobs`,
  partners: `${apiBaseUrl}/partners/`,
  partnerById: (id: string | number) => `${apiBaseUrl}/partners/${id}/`,
  cctvDetails: `${apiBaseUrl}/cctv_details/`,
  cctvDetailById: (id: string | number) => `${apiBaseUrl}/cctv_details/${id}/`,
  governingBodies: `${apiBaseUrl}/governing_bodies`,
  governingBodyById: (id: string | number) => `${apiBaseUrl}/governing_bodies/${id}`,
  generalBodies: `${apiBaseUrl}/general_bodies`,
  generalBodyById: (id: string | number) => `${apiBaseUrl}/general_bodies/${id}`,
  donations: `${apiBaseUrl}/donations`,
  donationById: (id: string | number) => `${apiBaseUrl}/donations/${id}`,
  organizationDetails: `${apiBaseUrl}/organization_details`,
  organizationDetailById: (id: string | number) => `${apiBaseUrl}/organization_details/${id}`,
  banners: `${apiBaseUrl}/banners`,
  bannerById: (id: string | number) => `${apiBaseUrl}/banners/${id}`,
  legalDocuments: `${apiBaseUrl}/legal_documents`,
  legalDocumentById: (id: string | number) => `${apiBaseUrl}/legal_documents/${id}`,
  legalStatuses: `${apiBaseUrl}/legal_status`,
  legalStatusById: (id: string | number) => `${apiBaseUrl}/legal_status/${id}`,
  upload: `${apiBaseUrl}/upload`,
  jobApplications: `${apiBaseUrl}/job_applications`,
  jobApplicationResumes: `${apiBaseUrl}/job_application_resumes`,
  careerApplications: `${apiBaseUrl}/job_aspirants`,
  publicAsset: (path: string) => toPublicAssetUrl(path),
} as const;
