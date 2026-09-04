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

const legalDocumentRows: AdminTableRow[] = [];

const legalStatusRows: AdminTableRow[] = [];

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
                  { label: 'title_hindi', type: 'text', placeholder: 'Enter title in Hindi' },
                  { label: 'title_odia', type: 'text', placeholder: 'Enter title in Odia' },
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
                  {
                    label: 'description_hindi',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter tender description in Hindi',
                  },
                  {
                    label: 'description_odia',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter tender description in Odia',
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
              { key: 'title_hindi', label: 'Title (Hindi)' },
              { key: 'title_odia', label: 'Title (Odia)' },
              { key: 'description', label: 'Description' },
              { key: 'description_hindi', label: 'Description (Hindi)' },
              { key: 'description_odia', label: 'Description (Odia)' },
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
                  { label: 'title_hindi', type: 'text', placeholder: 'Enter title in Hindi' },
                  { label: 'title_odia', type: 'text', placeholder: 'Enter title in Odia' },
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
                  {
                    label: 'description_hindi',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter advertisement description in Hindi',
                  },
                  {
                    label: 'description_odia',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter advertisement description in Odia',
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
              { key: 'title_hindi', label: 'Title (Hindi)' },
              { key: 'title_odia', label: 'Title (Odia)' },
              { key: 'description', label: 'Description' },
              { key: 'description_hindi', label: 'Description (Hindi)' },
              { key: 'description_odia', label: 'Description (Odia)' },
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
                  { label: 'title_hindi', type: 'text', placeholder: 'Enter title in Hindi' },
                  { label: 'title_odia', type: 'text', placeholder: 'Enter title in Odia' },
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
                  {
                    label: 'description_hindi',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter news description in Hindi',
                  },
                  {
                    label: 'description_odia',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter news description in Odia',
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
              { key: 'title_hindi', label: 'Title (Hindi)' },
              { key: 'title_odia', label: 'Title (Odia)' },
              { key: 'description', label: 'Description' },
              { key: 'description_hindi', label: 'Description (Hindi)' },
              { key: 'description_odia', label: 'Description (Odia)' },
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
          kind: 'form',
          form: {
            primaryAction: 'Save Legal Document',
            sections: [
              {
                title: 'Legal Document Details',
                columns: 2,
                fields: [
                  {
                    label: 'document_name',
                    type: 'text',
                    placeholder: 'Enter document name',
                  },
                  {
                    label: 'file_path',
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
              { key: 'title', label: 'Document Name' },
              { key: 'createdDate', label: 'Created Date' },
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
          kind: 'form',
          form: {
            primaryAction: 'Save Legal Status',
            sections: [
              {
                title: 'Legal Status Details',
                columns: 2,
                fields: [
                  {
                    label: 'status_details',
                    type: 'textarea',
                    placeholder: 'Enter status details',
                    span: 2,
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
              { key: 'title', label: 'Status Details' },
              { key: 'createdDate', label: 'Created Date' },
              { key: 'action', label: 'Action' },
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
                    type: 'text',
                    placeholder: 'Select programme name',
                  },
                  {
                    label: 'starting_year',
                    type: 'text',
                    placeholder: 'Enter 4 digit year',
                  },
                  {
                    label: 'supported_by',
                    type: 'text'
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
                    label: 'title_hindi',
                    type: 'text',
                    placeholder: 'Enter story title in Hindi',
                  },
                  {
                    label: 'title_odia',
                    type: 'text',
                    placeholder: 'Enter story title in Odia',
                  },
                  {
                    label: 'beneficiary_name',
                    type: 'text',
                    placeholder: 'Enter beneficiary name',
                  },
                  {
                    label: 'beneficiary_name_hindi',
                    type: 'text',
                    placeholder: 'Enter beneficiary name in Hindi',
                  },
                  {
                    label: 'beneficiary_name_odia',
                    type: 'text',
                    placeholder: 'Enter beneficiary name in Odia',
                  },
                  {
                    label: 'details',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter success story details',
                  },
                  {
                    label: 'details_hindi',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter success story details in Hindi',
                  },
                  {
                    label: 'details_odia',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Enter success story details in Odia',
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
              { key: 'title_hindi', label: 'title_hindi' },
              { key: 'title_odia', label: 'title_odia' },
              { key: 'beneficiary_name', label: 'beneficiary_name' },
              { key: 'beneficiary_name_hindi', label: 'beneficiary_name_hindi' },
              { key: 'beneficiary_name_odia', label: 'beneficiary_name_odia' },
              { key: 'details', label: 'details' },
              { key: 'details_hindi', label: 'details_hindi' },
              { key: 'details_odia', label: 'details_odia' },
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
        label: 'Open Jobs',
        path: 'open-jobs',
        icon: 'work_history',
        page: {
          title: 'Open Jobs',
          eyebrow: 'Career',
          summary: 'Current job openings and application totals.',
          kind: 'table',
          table: {
            columns: [
              { key: 'position_for', label: 'Position For' },
              { key: 'closing_date', label: 'Closing Date' },
              { key: 'number_of_vacancies', label: 'Number of Vacancies' },
              { key: 'applied_candidates', label: 'Applied Candidates' },
              { key: 'action', label: 'Action' },
            ],
            rows: [],
          },
        },
      },
      {
        label: 'Job Applications',
        path: 'job-applications',
        icon: 'assignment',
        page: {
          title: 'Job Applications',
          eyebrow: 'Career',
          summary: 'Applications received for the selected open job.',
          kind: 'table',
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'application_number', label: 'Application Number' },
              { key: 'position_applied', label: 'Position Applied' },
              { key: 'applicant_name', label: 'Applicant Name' },
              { key: 'gender', label: 'Gender' },
              { key: 'date_of_birth', label: 'Date of Birth' },
              { key: 'mobile_no', label: 'Mobile No.' },
              { key: 'applied_on', label: 'Applied On' },
              { key: 'action', label: 'Action' },
            ],
            rows: [],
          },
        },
      },
      {
        label: 'Job Aspirants',
        path: 'job-aspirants',
        icon: 'person_search',
        page: {
          title: 'Job Aspirants',
          eyebrow: 'Career',
          summary: 'Candidates who applied through the career application form.',
          kind: 'table',
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Phone' },
              { key: 'description', label: 'Description' },
              { key: 'resume_path', label: 'Resume', type: 'download' },
              { key: 'action', label: 'Action' },
            ],
            rows: [],
          },
        },
      }
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
