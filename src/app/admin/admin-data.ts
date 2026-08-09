export type AdminPageKind = 'form' | 'table' | 'cards';

export interface AdminFieldOption {
  label: string;
  value: string;
}

export interface AdminField {
  label: string;
  type:
    | 'text'
    | 'email'
    | 'tel'
    | 'number'
    | 'date'
    | 'datetime-local'
    | 'textarea'
    | 'select'
    | 'file'
    | 'readonly'
    | 'checkbox';
  optional?: boolean;
  placeholder?: string;
  rows?: number;
  span?: 1 | 2 | 3 | 4;
  options?: AdminFieldOption[];
  note?: string;
}

export interface AdminFormSection {
  title: string;
  note?: string;
  columns?: 2 | 3 | 4;
  fields: AdminField[];
}

export interface AdminTableColumn {
  key: string;
  label: string;
  type?: 'text' | 'download' | 'status';
}

export interface AdminTableRow {
  [key: string]: string | number | boolean | null | undefined;
}

export interface AdminCardItem {
  title: string;
  text: string;
  tag?: string;
  image?: string;
}

export interface AdminPageDefinition {
  title: string;
  eyebrow: string;
  summary: string;
  kind: AdminPageKind;
  form?: {
    sections: AdminFormSection[];
    primaryAction?: string;
    secondaryAction?: string;
  };
  table?: {
    columns: AdminTableColumn[];
    rows: AdminTableRow[];
  };
  cards?: AdminCardItem[];
}

export interface AdminMenuItem {
  label: string;
  path: string;
  icon: string;
  page: AdminPageDefinition;
}

export interface AdminMenuGroup {
  label: string;
  path: string;
  icon: string;
  items: AdminMenuItem[];
}

const annualReportRows: AdminTableRow[] = [];

const programmeMasterRows: AdminTableRow[] = [];

const programmeDetailsRows: AdminTableRow[] = [];

const programmeOverviewRows: AdminTableRow[] = [];

const auditReportRows: AdminTableRow[] = [];

const successStoryRows: AdminTableRow[] = [];

const mediaCoverageRows: AdminTableRow[] = [];

const awardsRecognitionRows: AdminTableRow[] = [];

const imageGalleryRows: AdminTableRow[] = [];

const videoGalleryRows: AdminTableRow[] = [];

const beneficiaryRows: AdminTableRow[] = [];

const staffRows: AdminTableRow[] = [];

const foodMenuRows: AdminTableRow[] = [];

const legalDocumentRows: AdminTableRow[] = [
  {
    slNo: '01',
    title: 'Society Registration Certificate',
    createdDate: 'Ready for upload',
    action: 'Download PDF',
  },
  {
    slNo: '02',
    title: 'PAN Registration Document',
    createdDate: 'Ready for upload',
    action: 'Download PDF',
  },
  {
    slNo: '03',
    title: '12A Registration Certificate',
    createdDate: 'Ready for upload',
    action: 'Download PDF',
  },
  {
    slNo: '04',
    title: '80G Approval Certificate',
    createdDate: 'Ready for upload',
    action: 'Download PDF',
  },
  {
    slNo: '05',
    title: 'FCRA Registration Certificate',
    createdDate: 'Ready for upload',
    action: 'Download PDF',
  },
];

const legalStatusRows: AdminTableRow[] = [
  {
    slNo: '01',
    title:
      'Certified by RCI for D.Ed. Special Education (VI), valid up to 2025-26.',
    createdDate: '27 Oct 2022',
    action: '',
  },
  {
    slNo: '02',
    title:
      'Certified by RCI for B.Ed. Special Education (ID), valid up to 2025-26.',
    createdDate: '24 Jan 2022',
    action: '',
  },
  {
    slNo: '03',
    title:
      'Certified by RCI for B.Ed. Special Education (HI), valid up to 2025-26.',
    createdDate: '26 May 2022',
    action: '',
  },
  {
    slNo: '04',
    title:
      'Recognized as a Specialized Adoption Agency by the WCD Department, Government of Odisha.',
    createdDate: '17 May 2021',
    action: '',
  },
  {
    slNo: '05',
    title:
      'Registered under section 41(1) of the JJ Act with renewal validity up to November 2027.',
    createdDate: '11 Nov 2022',
    action: '',
  },
  {
    slNo: '06',
    title:
      'Licensed under the Immoral Traffic (Prevention) Act and renewed up to February 2024.',
    createdDate: '2016',
    action: '',
  },
  {
    slNo: '07',
    title:
      'Accredited by Credibility Alliance for Good Governance of Voluntary Organizations.',
    createdDate: '08 Oct 2018',
    action: '',
  },
  {
    slNo: '08',
    title:
      'Registered under the National Trust with validity up to April 2026.',
    createdDate: '15 Apr 2021',
    action: '',
  },
  {
    slNo: '09',
    title: 'Registered under RPWD Act, 2016 with renewal up to April 2024.',
    createdDate: '05 Apr 2004',
    action: '',
  },
  {
    slNo: '10',
    title:
      'NGO Darpan, NITI Aayog registration with Unique ID OR/2009/0005189.',
    createdDate: '2009',
    action: '',
  },
];

const donorRows: AdminTableRow[] = [];

const partnerRows: AdminTableRow[] = [
  {
    title: 'Technology Partner',
    logo_path: '/assets/images/partners/tech-partner.png',
    display_order: 1,
    is_active: true,
  },
  {
    title: 'Community Partner',
    logo_path: '/assets/images/partners/community-partner.png',
    display_order: 2,
    is_active: true,
  },
];

const cctvDetailRows: AdminTableRow[] = [
  {
    slNo: '01',
    project_name: 'Main Gate',
    project_name_hindi: 'मुख्य द्वार',
    project_name_odia: 'ମୁଖ୍ୟ ଗେଟ୍',
    serial_number: 'CCTV-001',
    display_order: 1,
  },
  {
    slNo: '02',
    project_name: 'Office Block',
    project_name_hindi: 'कार्यालय भवन',
    project_name_odia: 'ଅଫିସ୍ ବ୍ଲକ୍',
    serial_number: 'CCTV-002',
    display_order: 2,
  },
];

const careerRows: AdminTableRow[] = [
  {
    name_of_post: 'Programme Coordinator',
    req_qualification: 'MSW / MBA with 3 years experience',
    number_of_post: 2,
    remuneration: '35000',
    closing_date: '2026-12-31',
    lower_age: 25,
    upper_age: 40,
    display_order: 1,
    is_active: true,
  },
  {
    name_of_post: 'Field Officer',
    req_qualification: 'Graduate with community outreach experience',
    number_of_post: 3,
    remuneration: '25000',
    closing_date: '2026-11-30',
    lower_age: 21,
    upper_age: 35,
    display_order: 2,
    is_active: true,
  },
];

const governingBodyRows: AdminTableRow[] = [];
const generalBodyRows: AdminTableRow[] = [];

export const ADMIN_MENU: AdminMenuGroup[] = [
  {
    label: 'Master Setup',
    path: 'master-setup',
    icon: 'settings',
    items: [
      {
        label: 'Organization Settings',
        path: 'organization-details',
        icon: 'domain',
        page: {
          title: 'Organization Details',
          eyebrow: 'Master Setup',
          summary:
            'Core identity, contact details, and branding for the NSP admin area.',
          kind: 'form',
          form: {
            primaryAction: 'Save Details',
            sections: [
              {
                title: 'Address and branding',
                note: 'Update the public address and the assets used in the sidebar and hero areas.',
                columns: 2,
                fields: [
                  {
                    label: 'Phone Number',
                    type: 'text',
                  },
                  {
                    label: 'Email',
                    type: 'email',
                  },
                  {
                    label: 'Office address',
                    type: 'textarea',
                    rows: 3,
                  },
                  {
                    label: 'Office address(Hindi)',
                    type: 'textarea',
                    rows: 3,
                  },
                  {
                    label: 'Office address(Odia)',
                    type: 'textarea',
                    rows: 3,
                  },
                  {
                    label: 'facebook_url',
                    type: 'text',
                    optional: true,
                  },
                  {
                    label: 'twitter_url',
                    type: 'text',
                    optional: true,
                  },
                  {
                    label: 'linkedin_url',
                    type: 'text',
                    optional: true,
                  }
                ],
              },
            ],
          },
        },
      },
      {
        label: 'CCTV Details',
        path: 'cctv-details',
        icon: 'videocam',
        page: {
          title: 'CCTV Details',
          eyebrow: 'Master Setup',
          summary: 'Manage CCTV project details displayed in the admin area.',
          kind: 'form',
          form: {
            primaryAction: 'Save CCTV Details',
            sections: [
              {
                title: 'CCTV Details',
                columns: 2,
                fields: [
                  { label: 'project_name', type: 'text', placeholder: 'Enter project name' },
                  {
                    label: 'project_name_hindi',
                    type: 'text',
                    placeholder: 'Enter project name in Hindi',
                  },
                  {
                    label: 'project_name_odia',
                    type: 'text',
                    placeholder: 'Enter project name in Odia',
                  },
                  {
                    label: 'serial_number',
                    type: 'text',
                    placeholder: 'Enter serial number',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'project_name', label: 'project_name' },
              { key: 'project_name_hindi', label: 'project_name_hindi' },
              { key: 'project_name_odia', label: 'project_name_odia' },
              { key: 'serial_number', label: 'serial_number' },
              { key: 'display_order', label: 'display_order' },
              { key: 'action', label: 'Action' },
            ],
            rows: cctvDetailRows,
          },
        },
      },

    ],
  },
  {
    label: 'Home Page',
    path: 'home-page',
    icon: 'home',
    items: [
      {
        label: 'Banner Management',
        path: 'banner-management',
        icon: 'photo_library',
        page: {
          title: 'Banner Management',
          eyebrow: 'Home Page',
          summary:
            'Adjust the main hero content that appears on the home page.',
          kind: 'form',
          form: {
            primaryAction: 'Save Banner',
            sections: [
              {
                title: 'Banner Management Details',
                columns: 2,
                fields: [
                  { label: 'title', type: 'text', placeholder: 'Enter banner title' },
                  {
                    label: 'sub_title',
                    type: 'text',
                    placeholder: 'Enter banner subtitle',
                  },
                  {
                    label: 'alt_text',
                    type: 'text',
                    placeholder: 'Enter image alt text',
                  },
                  {
                    label: 'image_path',
                    type: 'file',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: '1',
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'title' },
              { key: 'sub_title', label: 'sub_title' },
              { key: 'alt_text', label: 'alt_text' },
              { key: 'image_path', label: 'image_path' },
              { key: 'display_order', label: 'display_order' },
              { key: 'is_active', label: 'is_active', type: 'status' },
              { key: 'action', label: 'Action' },
            ],
            rows: [],
          },
        },
      },
      {
        label: 'Partners',
        path: 'partners',
        icon: 'handshake',
        page: {
          title: 'Partners',
          eyebrow: 'Home Page',
          summary: 'Manage partner logos displayed on the public website.',
          kind: 'form',
          form: {
            primaryAction: 'Save Partner',
            sections: [
              {
                title: 'Partner Details',
                columns: 2,
                fields: [
                  { label: 'title', type: 'text', placeholder: 'Enter partner title' },
                  { label: 'logo_path', type: 'file' },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'title' },
              { key: 'logo_path', label: 'logo_path' },
              { key: 'display_order', label: 'display_order' },
              { key: 'action', label: 'Action' },
            ],
            rows: partnerRows,
          },
        },
      },
      {
        label: 'Tender Notices',
        path: 'tender-notices',
        icon: 'campaign',
        page: {
          title: 'Tender Notices',
          eyebrow: 'Master Setup',
          summary:
            'Maintain short announcements and quick links used across the site.',
          kind: 'form',
          form: {
            primaryAction: 'Save Tender Notice',
            sections: [
              {
                title: 'Tender Notice Details',
                columns: 3,
                fields: [
                  { label: 'title', type: 'text' },
                  {
                    label: 'opening_date',
                    type: 'date',
                  },
                  {
                    label: 'closing_date',
                    type: 'date',
                  },
                  {
                    label: 'detail_file_path',
                    type: 'file',
                    span: 2,
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                  },
                  {
                    label: 'description',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description' },
              { key: 'opening_date', label: 'Opening Date' },
              { key: 'closing_date', label: 'Closing Date' },
              { key: 'detail_file_path', label: 'Detail File' },
              { key: 'createdDate', label: 'Created Date' },
              { key: 'action', label: 'Action', type: 'download' },
            ],
            rows: [],
          },
        },
      },
      {
        label: 'Advertisements',
        path: 'advertisements',
        icon: 'ads_click',
        page: {
          title: 'Advertisements',
          eyebrow: 'Master Setup',
          summary:
            'Maintain promotional announcements and supporting files used across the site.',
          kind: 'form',
          form: {
            primaryAction: 'Save Advertisement',
            sections: [
              {
                title: 'Advertisement Details',
                columns: 3,
                fields: [
                  { label: 'title', type: 'text' },
                  {
                    label: 'opening_date',
                    type: 'date',
                  },
                  {
                    label: 'closing_date',
                    type: 'date',
                  },
                  {
                    label: 'detail_file_path',
                    type: 'file',
                    span: 2,
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                  },
                  {
                    label: 'description',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description' },
              { key: 'opening_date', label: 'Opening Date' },
              { key: 'closing_date', label: 'Closing Date' },
              { key: 'detail_file_path', label: 'Detail File' },
              { key: 'createdDate', label: 'Created Date' },
              { key: 'action', label: 'Action', type: 'download' },
            ],
            rows: [],
          },
        },
      },
      {
        label: 'News & Events',
        path: 'news_events',
        icon: 'event',
        page: {
          title: 'News & Events',
          eyebrow: 'Master Setup',
          summary:
            'Maintain news and event announcements with supporting files used across the site.',
          kind: 'form',
          form: {
            primaryAction: 'Save News Event',
            sections: [
              {
                title: 'News & Event Details',
                columns: 3,
                fields: [
                  { label: 'title', type: 'text' },
                  {
                    label: 'detail_file_path',
                    type: 'file',
                    span: 2,
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                  },
                  {
                    label: 'description',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description' },
              { key: 'detail_file_path', label: 'Detail File' },
              { key: 'createdDate', label: 'Created Date' },
              { key: 'action', label: 'Action', type: 'download' },
            ],
            rows: [],
          },
        },
      }
    ],
  },
  {
    label: 'About Us',
    path: 'about-us',
    icon: 'info',
    items: [
      {
        label: 'Governing Body',
        path: 'governing-body',
        icon: 'groups',
        page: {
          title: 'Governing Body',
          eyebrow: 'About Us',
          summary: 'Manage governing body members shown in About Us section.',
          kind: 'form',
          form: {
            primaryAction: 'Save Governing Body',
            sections: [
              {
                title: 'Governing Body Details',
                columns: 3,
                fields: [
                  {
                    label: 'name',
                    type: 'text',
                    placeholder: 'Enter member name',
                  },
                  {
                    label: 'name_hindi',
                    type: 'text',
                    placeholder: 'Enter member name in Hindi',
                  },
                  {
                    label: 'name_odia',
                    type: 'text',
                    placeholder: 'Enter member name in Odia',
                  },
                  {
                    label: 'position',
                    type: 'select',
                    options: [
                      { label: 'Chairman', value: 'Chairman' },
                      { label: 'Vice Chairman', value: 'Vice Chairman' },
                      { label: 'Secretary', value: 'Secretary' },
                      { label: 'Joint Secretary', value: 'Joint Secretary' },
                      { label: 'Member', value: 'Member' },
                    ],
                  },
                  {
                    label: 'qualification',
                    type: 'select',
                    options: [
                      { label: 'PhD', value: 'PhD' },
                      { label: 'Master Degree', value: 'Master Degree' },
                      { label: 'B.A/B.ED', value: 'B.A/B.ED' },
                      { label: 'M.A/B.ED', value: 'M.A/B.ED' },
                      { label: 'M.A', value: 'M.A' },
                      { label: 'MBA', value: 'MBA' },
                      { label: 'B.Sc/B.ED', value: 'B.Sc/B.ED' },
                      { label: 'Graduate', value: 'Graduate' },
                      { label: '+2', value: '+2' },
                      { label: 'HSC', value: 'HSC' },
                      { label: 'Under Matric', value: 'Under Matric' },
                    ],
                  },
                  {
                    label: 'message',
                    type: 'textarea',
                    rows: 3,
                    placeholder: 'Enter message',
                  },
                  {
                    label: 'message_hindi',
                    type: 'textarea',
                    rows: 3,
                    placeholder: 'Enter message in Hindi',
                  },
                  {
                    label: 'message_odia',
                    type: 'textarea',
                    rows: 3,
                    placeholder: 'Enter message in Odia',
                  },
                  {
                    label: 'image_path',
                    type: 'file',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'name', label: 'name' },
              { key: 'name_hindi', label: 'name_hindi' },
              { key: 'name_odia', label: 'name_odia' },
              { key: 'position', label: 'position' },
              { key: 'qualification', label: 'qualification' },
              { key: 'message', label: 'message' },
              { key: 'message_hindi', label: 'message_hindi' },
              { key: 'message_odia', label: 'message_odia' },
              { key: 'image_path', label: 'image_path' },
              { key: 'display_order', label: 'display_order' },
              { key: 'is_active', label: 'is_active', type: 'status' },
              { key: 'action', label: 'Action' },
            ],
            rows: governingBodyRows,
          },
        },
      },
      {
        label: 'General Body',
        path: 'general-body',
        icon: 'groups_2',
        page: {
          title: 'General Body',
          eyebrow: 'About Us',
          summary: 'Manage general body members shown in About Us section.',
          kind: 'form',
          form: {
            primaryAction: 'Save General Body',
            sections: [
              {
                title: 'General Body Details',
                columns: 3,
                fields: [
                  {
                    label: 'name',
                    type: 'text',
                    placeholder: 'Enter member name',
                  },
                  {
                    label: 'name_hindi',
                    type: 'text',
                    placeholder: 'Enter member name in Hindi',
                  },
                  {
                    label: 'name_odia',
                    type: 'text',
                    placeholder: 'Enter member name in Odia',
                  },
                  {
                    label: 'position',
                    type: 'select',
                    options: [
                      { label: 'Chairman', value: 'Chairman' },
                      { label: 'Vice Chairman', value: 'Vice Chairman' },
                      { label: 'Secretary', value: 'Secretary' },
                      { label: 'Joint Secretary', value: 'Joint Secretary' },
                      { label: 'Member', value: 'Member' },
                    ],
                  },
                  {
                    label: 'image_path',
                    type: 'file',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'name', label: 'name' },
              { key: 'name_hindi', label: 'name_hindi' },
              { key: 'name_odia', label: 'name_odia' },
              { key: 'position', label: 'position' },
              { key: 'image_path', label: 'image_path' },
              { key: 'display_order', label: 'display_order' },
              { key: 'is_active', label: 'is_active', type: 'status' },
              { key: 'action', label: 'Action' },
            ],
            rows: generalBodyRows,
          },
        },
      },
      {
        label: 'Legal Document',
        path: 'legal-document',
        icon: 'description',
        page: {
          title: 'Legal Document',
          eyebrow: 'About Us',
          summary: 'Registration and compliance documents ready for upload.',
          kind: 'table',
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Document Name' },
              { key: 'action', label: 'Download', type: 'download' },
            ],
            rows: legalDocumentRows,
          },
        },
      },
      {
        label: 'Legal Status',
        path: 'legal-status',
        icon: 'verified',
        page: {
          title: 'Legal Status',
          eyebrow: 'About Us',
          summary:
            'Track approvals, certifications, and statutory recognition.',
          kind: 'table',
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Status Details' },
              { key: 'createdDate', label: 'Created Date' },
            ],
            rows: legalStatusRows,
          },
        },
      },
    ],
  },
  {
    label: 'Programmes By NSP',
    path: 'programmes',
    icon: 'volunteer_activism',
    items: [
      {
        label: 'Programme Master',
        path: 'programme-master',
        icon: 'assignment',
        page: {
          title: 'Programme Master',
          eyebrow: 'Programmes',
          summary: 'Create and manage programme master records for NSP.',
          kind: 'form',
          form: {
            primaryAction: 'Save Programme Master',
            sections: [
              {
                title: 'Programme Master Details',
                columns: 2,
                fields: [
                  {
                    label: 'programme_name',
                    type: 'text',
                    placeholder: 'Enter programme name',
                  },
                  {
                    label: 'programme_name_hindi',
                    type: 'text',
                    placeholder: 'Enter programme name in Hindi',
                  },
                  {
                    label: 'programme_name_odia',
                    type: 'text',
                    placeholder: 'Enter programme name in Odia',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'programme_name', label: 'programme_name' },
              { key: 'programme_name_hindi', label: 'programme_name_hindi' },
              { key: 'programme_name_odia', label: 'programme_name_odia' },
              { key: 'display_order', label: 'display_order' },
              { key: 'is_active', label: 'is_active', type: 'status' },
              { key: 'action', label: 'Action' },
            ],
            rows: programmeMasterRows,
          },
        },
      },
      {
        label: 'Programme Details',
        path: 'programme-details',
        icon: 'format_list_bulleted',
        page: {
          title: 'Programme Details',
          eyebrow: 'Programmes',
          summary: 'Create and manage project-level programme details for NSP.',
          kind: 'form',
          form: {
            primaryAction: 'Save Programme Details',
            sections: [
              {
                title: 'Programme Details',
                columns: 2,
                fields: [
                  {
                    label: 'programme_name',
                    type: 'select',
                    placeholder: 'Select programme name',
                  },
                  {
                    label: 'project_name',
                    type: 'text',
                    placeholder: 'Enter project name',
                  },
                  {
                    label: 'project_name_hindi',
                    type: 'text',
                    placeholder: 'Enter project name in Hindi',
                  },
                  {
                    label: 'project_name_odia',
                    type: 'text',
                    placeholder: 'Enter project name in Odia',
                  },
                  {
                    label: 'project_details',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter project details',
                  },
                  {
                    label: 'project_details_hindi',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter project details in Hindi',
                  },
                  {
                    label: 'project_details_odia',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter project details in Odia',
                  },
                  {
                    label: 'achievement_details',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter achievement details',
                  },
                  {
                    label: 'achievement_details_hindi',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter achievement details in Hindi',
                  },
                  {
                    label: 'achievement_details_odia',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter achievement details in Odia',
                  },
                  {
                    label: 'image_path',
                    type: 'file',
                    note: 'No file chosen',
                  },
                  {
                    label: 'other_image_paths',
                    type: 'file',
                    note: 'No file chosen',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'programme_name', label: 'programme_name' },
              { key: 'project_name', label: 'project_name' },
              { key: 'project_name_hindi', label: 'project_name_hindi' },
              { key: 'project_name_odia', label: 'project_name_odia' },
              { key: 'project_details', label: 'project_details' },
              { key: 'project_details_hindi', label: 'project_details_hindi' },
              { key: 'project_details_odia', label: 'project_details_odia' },
              { key: 'achievement_details', label: 'achievement_details' },
              { key: 'achievement_details_hindi', label: 'achievement_details_hindi' },
              { key: 'achievement_details_odia', label: 'achievement_details_odia' },
              { key: 'image_path', label: 'image_path' },
              { key: 'other_image_paths', label: 'other_image_paths' },
              { key: 'display_order', label: 'display_order' },
              { key: 'is_active', label: 'is_active', type: 'status' },
              { key: 'action', label: 'Action' },
            ],
            rows: programmeDetailsRows,
          },
        },
      },
      {
        label: 'Programme Overview',
        path: 'programme-overview',
        icon: 'dashboard_customize',
        page: {
          title: 'Programme Overview',
          eyebrow: 'Programmes',
          summary: 'Create and manage programme overview records for NSP projects.',
          kind: 'form',
          form: {
            primaryAction: 'Save Programme Overview',
            sections: [
              {
                title: 'Programme Overview Details',
                columns: 2,
                fields: [
                  {
                    label: 'programme_name',
                    type: 'select',
                    placeholder: 'Select programme name',
                  },
                  {
                    label: 'project_name',
                    type: 'select',
                    placeholder: 'Select project name',
                  },
                  {
                    label: 'starting_year',
                    type: 'text',
                    placeholder: 'Enter 4 digit year',
                  },
                  {
                    label: 'supported_by',
                    type: 'select',
                    options: [
                      { label: 'Own Funding', value: 'Own Funding' },
                      { label: 'Ministry', value: 'Ministry' },
                      { label: 'Foreign Funding', value: 'Foreign Funding' },
                    ],
                  },
                  {
                    label: 'status',
                    type: 'select',
                    options: [
                      { label: 'On going', value: 'On going' },
                      { label: 'Completed', value: 'Completed' },
                      { label: 'Not Applicable', value: 'Not Applicable' },
                    ],
                  },
                  {
                    label: 'strength',
                    type: 'number',
                    placeholder: 'Enter strength',
                  },
                  {
                    label: 'beneficiaries_covered',
                    type: 'number',
                    placeholder: 'Enter beneficiaries covered',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'programme_name', label: 'programme_name' },
              { key: 'project_name', label: 'project_name' },
              { key: 'starting_year', label: 'starting_year' },
              { key: 'supported_by', label: 'supported_by' },
              { key: 'status', label: 'status' },
              { key: 'strength', label: 'strength' },
              { key: 'beneficiaries_covered', label: 'beneficiaries_covered' },
              { key: 'display_order', label: 'display_order' },
              { key: 'is_active', label: 'is_active', type: 'status' },
              { key: 'action', label: 'Action' },
            ],
            rows: programmeOverviewRows,
          },
        },
      },
    ],
  },
  {
    label: 'Donation',
    path: 'donation',
    icon: 'payments',
    items: [
      {
        label: 'Donate Now',
        path: 'donate-now',
        icon: 'volunteer_activism',
        page: {
          title: 'Donate Now',
          eyebrow: 'Donation',
          summary: 'A compact donor form for pledges and support requests.',
          kind: 'form',
          form: {
            primaryAction: 'Submit Donation',
            sections: [
              {
                title: 'Donation details',
                columns: 2,
                fields: [
                  {
                    label: 'Donor name',
                    type: 'text',
                    placeholder: 'Enter name',
                  },
                  {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'name@example.com',
                  },
                  {
                    label: 'Mobile number',
                    type: 'tel',
                    placeholder: 'Phone number',
                  },
                  {
                    label: 'Donation amount',
                    type: 'number',
                    placeholder: '1000',
                  },
                  {
                    label: 'Donation type',
                    type: 'select',
                    options: [
                      { label: 'One-time', value: 'one-time' },
                      { label: 'Recurring', value: 'recurring' },
                      { label: 'Project', value: 'project' },
                    ],
                  },
                  {
                    label: 'Purpose note',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Explain how the donation should be used.',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        label: 'Donor List',
        path: 'donor-list',
        icon: 'list_alt',
        page: {
          title: 'Donor List',
          eyebrow: 'Donation',
          summary: 'Create and manage donor entries with amount, date, and status.',
          kind: 'form',
          form: {
            primaryAction: 'Save Donor',
            sections: [
              {
                title: 'Donor Details',
                columns: 2,
                fields: [
                  {
                    label: 'donor_name',
                    type: 'text',
                    placeholder: 'Enter donor name',
                  },
                  {
                    label: 'donation_amount',
                    type: 'number',
                    placeholder: 'Enter donation amount',
                  },
                  {
                    label: 'donation_date',
                    type: 'date',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  {
                    label: 'is_active',
                    type: 'checkbox',
                  },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'donor_name', label: 'donor_name' },
              { key: 'donation_amount', label: 'donation_amount' },
              { key: 'donation_date', label: 'donation_date' },
              { key: 'display_order', label: 'display_order' },
              { key: 'is_active', label: 'is_active', type: 'status' },
              { key: 'action', label: 'Action' },
            ],
            rows: donorRows,
          },
        },
      },
    ],
  },
  {
    label: 'Achievements',
    path: 'achievements',
    icon: 'military_tech',
    items: [
      {
        label: 'Success Story',
        path: 'success-story',
        icon: 'auto_stories',
        page: {
          title: 'Success Story',
          eyebrow: 'Achievements',
          summary: 'Create and manage beneficiary success stories.',
          kind: 'form',
          form: {
            primaryAction: 'Save Success Story',
            sections: [
              {
                title: 'Success Story Details',
                columns: 3,
                fields: [
                  {
                    label: 'title',
                    type: 'text',
                    placeholder: 'Enter story title',
                  },
                  {
                    label: 'beneficiary_name',
                    type: 'text',
                    placeholder: 'Enter beneficiary name',
                  },
                  {
                    label: 'details',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter success story details',
                  },
                  {
                    label: 'image_path',
                    type: 'file',
                    note: 'No file chosen',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'title' },
              { key: 'beneficiary_name', label: 'beneficiary_name' },
              { key: 'details', label: 'details' },
              { key: 'image_path', label: 'image_path' },
              { key: 'display_order', label: 'display_order' },
              { key: 'is_active', label: 'is_active', type: 'status' },
              { key: 'action', label: 'Action' },
            ],
            rows: successStoryRows,
          },
        },
      },
      {
        label: 'Media Coverage',
        path: 'media-coverage',
        icon: 'newspaper',
        page: {
          title: 'Media Coverage',
          eyebrow: 'Achievements',
          summary: 'Create and manage media coverage entries.',
          kind: 'form',
          form: {
            primaryAction: 'Save Media Coverage',
            sections: [
              {
                title: 'Media Coverage Details',
                columns: 3,
                fields: [
                  {
                    label: 'title',
                    type: 'text',
                    placeholder: 'Enter media title',
                  },
                  {
                    label: 'date_time',
                    type: 'datetime-local',
                    placeholder: 'Select date and time',
                  },
                  {
                    label: 'image_path',
                    type: 'file',
                    note: 'No file chosen',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'title' },
              { key: 'date_time', label: 'date_time' },
              { key: 'image_path', label: 'image_path' },
              { key: 'display_order', label: 'display_order' },
              { key: 'is_active', label: 'is_active', type: 'status' },
              { key: 'action', label: 'Action' },
            ],
            rows: mediaCoverageRows,
          },
        },
      },
      {
        label: 'Awards Recognition',
        path: 'awards-recognition',
        icon: 'workspace_premium',
        page: {
          title: 'Awards Recognition',
          eyebrow: 'Achievements',
          summary: 'Create and manage awards and recognitions.',
          kind: 'form',
          form: {
            primaryAction: 'Save Awards Recognition',
            sections: [
              {
                title: 'Awards Recognition Details',
                columns: 3,
                fields: [
                  {
                    label: 'title',
                    type: 'text',
                    placeholder: 'Enter award title',
                  },
                  {
                    label: 'date_time',
                    type: 'datetime-local',
                    placeholder: 'Select date and time',
                  },
                  {
                    label: 'image_path',
                    type: 'file',
                    note: 'No file chosen',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'title' },
              { key: 'date_time', label: 'date_time' },
              { key: 'image_path', label: 'image_path' },
              { key: 'display_order', label: 'display_order' },
              { key: 'is_active', label: 'is_active', type: 'status' },
              { key: 'action', label: 'Action' },
            ],
            rows: awardsRecognitionRows,
          },
        },
      },
    ],
  },
  {
    label: 'Reports',
    path: 'reports',
    icon: 'summarize',
    items: [
      {
        label: 'Annual Report',
        path: 'annual-report',
        icon: 'description',
        page: {
          title: 'Annual Report',
          eyebrow: 'Reports',
          summary: 'Add and manage annual report uploads.',
          kind: 'form',
          form: {
            primaryAction: 'Save Annual Report',
            sections: [
              {
                title: 'Annual Report Details',
                columns: 2,
                fields: [
                  {
                    label: 'Title',
                    type: 'text',
                    placeholder: 'Enter report title',
                  },
                  {
                    label: 'File Upload',
                    type: 'file',
                    note: 'No file chosen',
                  },
                  {
                    label: 'Display Order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'Is Active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Title' },
              { key: 'createdDate', label: 'Created Date' },
              { key: 'action', label: 'Download', type: 'download' },
            ],
            rows: annualReportRows,
          },
        },
      },
      {
        label: 'Audit Report',
        path: 'audit-report',
        icon: 'receipt_long',
        page: {
          title: 'Audit Report',
          eyebrow: 'Reports',
          summary: 'Audit report uploads and records.',
          kind: 'form',
          form: {
            primaryAction: 'Save Audit Report',
            sections: [
              {
                title: 'Audit Report Details',
                columns: 2,
                fields: [
                  {
                    label: 'Title',
                    type: 'text',
                    placeholder: 'Enter report title',
                  },
                  {
                    label: 'File Upload',
                    type: 'file',
                    note: 'No file chosen',
                  },
                  {
                    label: 'Display Order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'Is Active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Title' },
              { key: 'createdDate', label: 'Created Date' },
              { key: 'action', label: 'Download', type: 'download' },
            ],
            rows: auditReportRows,
          },
        },
      },
      {
        label: 'Beneficiary List',
        path: 'beneficiary-list',
        icon: 'people',
        page: {
          title: 'Beneficiary List',
          eyebrow: 'Reports',
          summary: 'Project beneficiary counts and updates.',
          kind: 'form',
          form: {
            primaryAction: 'Save Beneficiary List',
            sections: [
              {
                title: 'Beneficiary List Details',
                columns: 2,
                fields: [
                  {
                    label: 'Project Name',
                    type: 'text',
                    placeholder: 'Enter project name',
                  },
                  {
                    label: 'No of Beneficiaries',
                    type: 'number',
                    placeholder: 'Enter number of beneficiaries',
                  },
                  {
                    label: 'File Upload',
                    type: 'file',
                    note: 'No file chosen',
                  },
                  {
                    label: 'Display Order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'Is Active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'project_name', label: 'Project Name' },
              { key: 'noOfBeneficiaries', label: 'No of Beneficiaries' },
              { key: 'createdDate', label: 'Created Date' },
              { key: 'action', label: 'Download', type: 'download' },
            ],
            rows: beneficiaryRows,
          },
        },
      },
      {
        label: 'Staff List',
        path: 'staff-list',
        icon: 'badge',
        page: {
          title: 'Staff List',
          eyebrow: 'Reports',
          summary: 'Staff records and publication history.',
          kind: 'form',
          form: {
            primaryAction: 'Save Staff List',
            sections: [
              {
                title: 'Staff List Details',
                columns: 2,
                fields: [
                  {
                    label: 'Title',
                    type: 'text',
                    placeholder: 'Enter title',
                  },
                  {
                    label: 'File Upload',
                    type: 'file',
                    note: 'No file chosen',
                  },
                  {
                    label: 'Display Order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'Is Active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Title' },
              { key: 'createdDate', label: 'Created Date' },
              { key: 'action', label: 'Download', type: 'download' },
            ],
            rows: staffRows,
          },
        },
      },
      {
        label: 'Food Menu',
        path: 'food-menu',
        icon: 'restaurant_menu',
        page: {
          title: 'Food Menu',
          eyebrow: 'Reports',
          summary: 'Published meal plans and menu records.',
          kind: 'form',
          form: {
            primaryAction: 'Save Food Menu',
            sections: [
              {
                title: 'Food Menu Details',
                columns: 2,
                fields: [
                  {
                    label: 'Title',
                    type: 'text',
                    placeholder: 'Enter title',
                  },
                  {
                    label: 'File Upload',
                    type: 'file',
                    note: 'No file chosen',
                  },
                  {
                    label: 'Display Order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'Is Active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Title' },
              { key: 'createdDate', label: 'Created Date' },
              { key: 'action', label: 'Download', type: 'download' },
            ],
            rows: foodMenuRows,
          },
        },
      },
    ],
  },
  {
    label: 'Gallery',
    path: 'gallery',
    icon: 'collections',
    items: [
      {
        label: 'Image Gallery',
        path: 'image-gallery',
        icon: 'photo',
        page: {
          title: 'Image Gallery',
          eyebrow: 'Gallery',
          summary: 'Create and manage image gallery items.',
          kind: 'form',
          form: {
            primaryAction: 'Save Image Gallery',
            sections: [
              {
                title: 'Image Gallery Details',
                columns: 3,
                fields: [
                  {
                    label: 'title',
                    type: 'text',
                    placeholder: 'Enter image title',
                  },
                  {
                    label: 'image_path',
                    type: 'file',
                    note: 'No file chosen',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'title' },
              { key: 'image_path', label: 'image_path' },
              { key: 'display_order', label: 'display_order' },
              { key: 'is_active', label: 'is_active', type: 'status' },
              { key: 'action', label: 'Action' },
            ],
            rows: imageGalleryRows,
          },
        },
      },
      {
        label: 'Video Gallery',
        path: 'video-gallery',
        icon: 'smart_display',
        page: {
          title: 'Video Gallery',
          eyebrow: 'Gallery',
          summary: 'Create and manage video gallery items.',
          kind: 'form',
          form: {
            primaryAction: 'Save Video Gallery',
            sections: [
              {
                title: 'Video Gallery Details',
                columns: 3,
                fields: [
                  {
                    label: 'title',
                    type: 'text',
                    placeholder: 'Enter video title',
                  },
                  {
                    label: 'video_path',
                    type: 'file',
                    note: 'No file chosen',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'title' },
              { key: 'video_path', label: 'video_path' },
              { key: 'display_order', label: 'display_order' },
              { key: 'is_active', label: 'is_active', type: 'status' },
              { key: 'action', label: 'Action' },
            ],
            rows: videoGalleryRows,
          },
        },
      },
    ],
  },
  {
    label: 'Career',
    path: 'career',
    icon: 'work',
    items: [
      {
        label: 'Career Opportunities',
        path: 'career-opportunities',
        icon: 'work_outline',
        page: {
          title: 'Career Opportunities',
          eyebrow: 'Career',
          summary: 'Open positions and recruitment listings.',
          kind: 'form',
          form: {
            primaryAction: 'Save Career Opportunity',
            sections: [
              {
                title: 'Career Opportunities',
                columns: 3,
                fields: [
                  {
                    label: 'name_of_post',
                    type: 'text',
                    placeholder: 'Enter post name',
                  },
                  {
                    label: 'req_qualification',
                    type: 'text',
                    rows: 3,
                    placeholder: 'Enter required qualification',
                  },
                  {
                    label: 'number_of_post',
                    type: 'number',
                    placeholder: 'Enter number of posts',
                  },
                  {
                    label: 'remuneration',
                    type: 'text',
                    placeholder: 'Enter remuneration',
                  },
                  {
                    label: 'closing_date',
                    type: 'date',
                  },
                  {
                    label: 'lower_age',
                    type: 'number',
                    placeholder: 'Enter lower age',
                  },
                  {
                    label: 'upper_age',
                    type: 'number',
                    placeholder: 'Enter upper age',
                  },
                  {
                    label: 'display_order',
                    type: 'number',
                    placeholder: 'Enter display order',
                  },
                  { label: 'is_active', type: 'checkbox' },
                ],
              },
            ],
          },
          table: {
            columns: [
              { key: 'name_of_post', label: 'name_of_post' },
              { key: 'req_qualification', label: 'req_qualification' },
              { key: 'number_of_post', label: 'number_of_post' },
              { key: 'remuneration', label: 'remuneration' },
              { key: 'closing_date', label: 'closing_date' },
              { key: 'lower_age', label: 'lower_age' },
              { key: 'upper_age', label: 'upper_age' },
              { key: 'display_order', label: 'display_order' },
              { key: 'is_active', label: 'is_active', type: 'status' },
            ],
            rows: careerRows,
          },
        },
      },
      {
        label: 'Apply Now',
        path: 'apply-now',
        icon: 'assignment_ind',
        page: {
          title: 'Apply Now',
          eyebrow: 'Career',
          summary:
            'A structured application form with the same field groups as the public workflow.',
          kind: 'form',
          form: {
            primaryAction: 'Submit Application',
            secondaryAction: 'Reset',
            sections: [
              {
                title: 'Step 1 - Select the post',
                columns: 2,
                fields: [
                  {
                    label: 'Select application for the post',
                    type: 'select',
                    options: [
                      {
                        label: 'Programme Coordinator',
                        value: 'programme-coordinator',
                      },
                      { label: 'Field Officer', value: 'field-officer' },
                      { label: 'Counsellor', value: 'counsellor' },
                    ],
                  },
                  {
                    label: 'Registration number',
                    type: 'readonly',
                    placeholder: 'Auto-generated',
                  },
                ],
              },
              {
                title: 'Step 2 - Personal details',
                columns: 4,
                fields: [
                  { label: 'Applicant name', type: 'text' },
                  {
                    label: 'Gender',
                    type: 'select',
                    options: [
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                      { label: 'Other', value: 'other' },
                    ],
                  },
                  {
                    label: 'Marital status',
                    type: 'select',
                    options: [
                      { label: 'Unmarried', value: 'unmarried' },
                      { label: 'Married', value: 'married' },
                    ],
                  },
                  { label: 'Date of birth', type: 'date' },
                  { label: 'Email', type: 'email' },
                  { label: 'Mobile number', type: 'tel' },
                  { label: "Father's name", type: 'text' },
                  { label: "Mother's name", type: 'text' },
                  {
                    label: 'Present address',
                    type: 'textarea',
                    rows: 3,
                    span: 2,
                  },
                  {
                    label: 'Permanent address',
                    type: 'textarea',
                    rows: 3,
                    span: 2,
                  },
                ],
              },
              {
                title: 'Step 3 - Photo and signature',
                columns: 2,
                fields: [
                  { label: 'Affix photograph', type: 'file' },
                  { label: 'Signature', type: 'file' },
                ],
              },
              {
                title: 'Step 4 - Education',
                columns: 2,
                fields: [
                  {
                    label: 'Qualification awarded',
                    type: 'text',
                    placeholder: 'Secondary / Higher Secondary / Graduation',
                  },
                  { label: 'Board / University', type: 'text' },
                  { label: 'Subject specialisation', type: 'text' },
                  {
                    label: 'Year of passing',
                    type: 'text',
                    placeholder: 'YYYY',
                  },
                  {
                    label: 'Passing category',
                    type: 'select',
                    options: [
                      { label: 'First Class', value: 'first-class' },
                      { label: 'Second Class', value: 'second-class' },
                      { label: 'Distinction', value: 'distinction' },
                    ],
                  },
                  {
                    label: 'Percentile / Percentage / OGPA / Grade',
                    type: 'text',
                  },
                  {
                    label: 'Photocopies of certificates',
                    type: 'file',
                    span: 2,
                  },
                ],
              },
              {
                title: 'Step 5 - Employment and skills',
                columns: 2,
                fields: [
                  { label: 'Organization / agency', type: 'text' },
                  { label: 'Designation', type: 'text' },
                  { label: 'Period', type: 'text' },
                  { label: 'Gross salary', type: 'text' },
                  {
                    label: 'Assignment / nature of responsibility',
                    type: 'textarea',
                    rows: 3,
                    span: 2,
                  },
                  { label: 'Computer proficiency', type: 'text' },
                  { label: 'Tools and applications', type: 'text' },
                ],
              },
              {
                title: 'Step 6 - Reference contacts',
                columns: 2,
                fields: [
                  { label: 'Reference 1 name', type: 'text' },
                  { label: 'Reference 1 phone', type: 'tel' },
                  {
                    label: 'Reference 1 address',
                    type: 'textarea',
                    rows: 3,
                    span: 2,
                  },
                  { label: 'Reference 2 name', type: 'text' },
                  { label: 'Reference 2 phone', type: 'tel' },
                  {
                    label: 'Reference 2 address',
                    type: 'textarea',
                    rows: 3,
                    span: 2,
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
];

export const ADMIN_ROUTE_ITEMS = ADMIN_MENU.flatMap((group) =>
  group.items.map((item) => ({
    groupPath: group.path,
    groupLabel: group.label,
    ...item,
  })),
);
