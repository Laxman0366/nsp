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

const donorRows: AdminTableRow[] = [
  {
    slNo: '01',
    title: 'Sujata Patnaik',
    createdDate: '22 Jul 2026',
    action: 'Recurring support',
  },
  {
    slNo: '02',
    title: 'Anil Kumar Das',
    createdDate: '18 Jul 2026',
    action: 'One-time gift',
  },
  {
    slNo: '03',
    title: 'Odisha Development Circle',
    createdDate: '10 Jul 2026',
    action: 'Institutional donor',
  },
  {
    slNo: '04',
    title: 'Asha Foundation',
    createdDate: '04 Jul 2026',
    action: 'Programme grant',
  },
  {
    slNo: '05',
    title: 'Community Wellbeing Trust',
    createdDate: '28 Jun 2026',
    action: 'Project support',
  },
];

const careerRows: AdminTableRow[] = [
  {
    slNo: '01',
    title: 'Programme Coordinator',
    createdDate: 'Open',
    action: 'Apply now',
  },
  {
    slNo: '02',
    title: 'Field Officer',
    createdDate: 'Open',
    action: 'Apply now',
  },
  { slNo: '03', title: 'Counsellor', createdDate: 'Open', action: 'Apply now' },
  {
    slNo: '04',
    title: 'Office Assistant',
    createdDate: 'Open',
    action: 'Apply now',
  },
  {
    slNo: '05',
    title: 'Data Entry Operator',
    createdDate: 'Open',
    action: 'Apply now',
  },
];

export const ADMIN_MENU: AdminMenuGroup[] = [
  {
    label: 'Master Setup',
    path: 'master-setup',
    icon: 'settings',
    items: [
      {
        label: 'Organization Settings',
        path: 'organization-settings',
        icon: 'domain',
        page: {
          title: 'Organization Settings',
          eyebrow: 'Master Setup',
          summary:
            'Core identity, contact details, and branding for the NSP admin area.',
          kind: 'form',
          form: {
            primaryAction: 'Save Settings',
            secondaryAction: 'Reset',
            sections: [
              {
                title: 'Core identity',
                note: 'Keep the organization profile aligned across the site and admin panels.',
                columns: 2,
                fields: [
                  {
                    label: 'Organization name',
                    type: 'text',
                    placeholder: 'Nilachal Seva Pratisthan',
                  },
                  {
                    label: 'Registration number',
                    type: 'text',
                    placeholder: 'REG-NSP-0001',
                  },
                  {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'nspodisha@gmail.com',
                  },
                  { label: 'Phone', type: 'tel', placeholder: '9437524416' },
                ],
              },
              {
                title: 'Address and branding',
                note: 'Update the public address and the assets used in the sidebar and hero areas.',
                columns: 2,
                fields: [
                  {
                    label: 'District',
                    type: 'select',
                    options: [
                      { label: 'Puri', value: 'puri' },
                      { label: 'Khordha', value: 'khordha' },
                      { label: 'Cuttack', value: 'cuttack' },
                    ],
                  },
                  {
                    label: 'City',
                    type: 'text',
                    placeholder: 'Benagaon (Dayavihar)',
                  },
                  {
                    label: 'Website',
                    type: 'text',
                    placeholder: 'https://nsp.org.in',
                  },
                  { label: 'Logo file', type: 'file' },
                  {
                    label: 'Office address',
                    type: 'textarea',
                    rows: 3,
                    span: 2,
                    placeholder:
                      'AT-Benagaon (Dayavihar), P.O-Gadasahi, P.S-Kanas, Dist-Puri, Odisha-752017',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        label: 'Home Contact Panel',
        path: 'home-contact-panel',
        icon: 'contact_page',
        page: {
          title: 'Home Contact Panel',
          eyebrow: 'Master Setup',
          summary:
            'Update the contact block and support details shown in the public theme.',
          kind: 'form',
          form: {
            primaryAction: 'Save Contact Panel',
            sections: [
              {
                title: 'Contact form inputs',
                columns: 2,
                fields: [
                  {
                    label: 'Contact title',
                    type: 'text',
                    placeholder: 'Contact Us',
                  },
                  {
                    label: 'Support email',
                    type: 'email',
                    placeholder: 'nspodisha@gmail.com',
                  },
                  {
                    label: 'Support phone',
                    type: 'tel',
                    placeholder: '9437524416',
                  },
                  {
                    label: 'Map URL',
                    type: 'text',
                    placeholder: 'Google Maps embed link',
                  },
                  {
                    label: 'Short message',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder:
                      "Get in touch with us. We'd love to hear from you.",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        label: 'Site Notices',
        path: 'site-notices',
        icon: 'campaign',
        page: {
          title: 'Site Notices',
          eyebrow: 'Master Setup',
          summary:
            'Maintain short announcements and quick links used across the site.',
          kind: 'table',
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Notice Title' },
              { key: 'createdDate', label: 'Created Date' },
              { key: 'action', label: 'Action', type: 'download' },
            ],
            rows: [
              {
                slNo: '01',
                title: 'Admissions open for new programmes',
                createdDate: '01 Aug 2026',
                action: 'View',
              },
              {
                slNo: '02',
                title: 'Volunteer orientation schedule updated',
                createdDate: '28 Jul 2026',
                action: 'View',
              },
              {
                slNo: '03',
                title: 'Quarterly report upload pending',
                createdDate: '22 Jul 2026',
                action: 'View',
              },
            ],
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
                title: 'Hero banner content',
                columns: 2,
                fields: [
                  {
                    label: 'Banner title',
                    type: 'text',
                    placeholder: 'Supporting communities with dignity',
                  },
                  {
                    label: 'Banner subtitle',
                    type: 'text',
                    placeholder: 'A place where service meets action',
                  },
                  {
                    label: 'Call to action label',
                    type: 'text',
                    placeholder: 'Learn more',
                  },
                  {
                    label: 'Call to action URL',
                    type: 'text',
                    placeholder: '/about',
                  },
                  { label: 'Banner image', type: 'file' },
                  {
                    label: 'Banner description',
                    type: 'textarea',
                    rows: 4,
                    span: 2,
                    placeholder: 'Concise banner copy for the public homepage.',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        label: 'Quick News',
        path: 'quick-news',
        icon: 'feed',
        page: {
          title: 'Quick News',
          eyebrow: 'Home Page',
          summary:
            'Manage the short announcements that appear above or below the banner.',
          kind: 'table',
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Headline' },
              { key: 'createdDate', label: 'Published On' },
              { key: 'action', label: 'Action', type: 'download' },
            ],
            rows: [
              {
                slNo: '01',
                title: 'Community camp scheduled for next week',
                createdDate: '30 Jul 2026',
                action: 'Edit',
              },
              {
                slNo: '02',
                title: 'Annual celebration photo gallery added',
                createdDate: '24 Jul 2026',
                action: 'Edit',
              },
              {
                slNo: '03',
                title: 'Report upload completed for Q2',
                createdDate: '18 Jul 2026',
                action: 'Edit',
              },
            ],
          },
        },
      },
    ],
  },
  {
    label: 'About Us',
    path: 'about-us',
    icon: 'info',
    items: [
      {
        label: 'Organization Overview',
        path: 'organization-overview',
        icon: 'account_balance',
        page: {
          title: 'Organization Overview',
          eyebrow: 'About Us',
          summary:
            'A concise story of the NSP mission and the communities it serves.',
          kind: 'cards',
          cards: [
            {
              title: 'Mission',
              text: 'Build inclusive, community-led support systems that improve education, health, and dignity.',
              tag: 'Strategy',
            },
            {
              title: 'Vision',
              text: 'Create long-term social impact through practical service, partnerships, and accountability.',
              tag: 'Strategy',
            },
            {
              title: 'Approach',
              text: 'Use locally grounded programmes that combine outreach, training, and public communication.',
              tag: 'Operations',
            },
          ],
        },
      },
      {
        label: 'Brief Profile',
        path: 'brief-profile',
        icon: 'badge',
        page: {
          title: 'Brief Profile',
          eyebrow: 'About Us',
          summary:
            'Key organization facts that usually appear in the profile page.',
          kind: 'cards',
          cards: [
            {
              title: 'Founded for service',
              text: 'A community-focused organization with a long public service history.',
              tag: 'Profile',
            },
            {
              title: 'Location',
              text: 'Benagaon (Dayavihar), Puri, Odisha.',
              tag: 'Profile',
            },
            {
              title: 'Support areas',
              text: 'Education, welfare, livelihood, health, and advocacy.',
              tag: 'Profile',
            },
          ],
        },
      },
      {
        label: 'Founder Message',
        path: 'founder-message',
        icon: 'person',
        page: {
          title: 'Founder Message',
          eyebrow: 'About Us',
          summary: 'Founders and leadership notes can be managed here.',
          kind: 'cards',
          cards: [
            {
              title: 'Leadership note',
              text: 'Keep the founder statement short, direct, and values-focused.',
              tag: 'Message',
            },
            {
              title: 'Community promise',
              text: 'Ground every programme in respect, service, and measurable impact.',
              tag: 'Message',
            },
          ],
        },
      },
      {
        label: 'Governing Body',
        path: 'governing-body',
        icon: 'groups',
        page: {
          title: 'Governing Body',
          eyebrow: 'About Us',
          summary: 'Track board members and their responsibilities.',
          kind: 'table',
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Name / Role' },
              { key: 'createdDate', label: 'Tenure' },
            ],
            rows: [
              { slNo: '01', title: 'Chairperson', createdDate: '2024 - 2027' },
              { slNo: '02', title: 'Secretary', createdDate: '2024 - 2027' },
              { slNo: '03', title: 'Treasurer', createdDate: '2024 - 2027' },
              { slNo: '04', title: 'Member', createdDate: '2024 - 2027' },
              { slNo: '05', title: 'Member', createdDate: '2024 - 2027' },
            ],
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
          summary:
            'Maintain the wider member directory and annual meeting notes.',
          kind: 'table',
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Member Group' },
              { key: 'createdDate', label: 'Updated On' },
            ],
            rows: [
              {
                slNo: '01',
                title: 'Core General Body Members',
                createdDate: '08 Aug 2026',
              },
              {
                slNo: '02',
                title: 'Programme Advisors',
                createdDate: '08 Aug 2026',
              },
              {
                slNo: '03',
                title: 'Community Representatives',
                createdDate: '08 Aug 2026',
              },
            ],
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
        label: 'Overview',
        path: 'overview',
        icon: 'dashboard_customize',
        page: {
          title: 'Programme Overview',
          eyebrow: 'Programmes',
          summary: 'High-level summary of the programmes delivered by NSP.',
          kind: 'cards',
          cards: [
            {
              title: 'Education',
              text: 'Support for learning continuity, scholarships, and inclusive classrooms.',
              tag: 'Programme',
            },
            {
              title: 'Livelihood',
              text: 'Skills, employment readiness, and micro-enterprise support.',
              tag: 'Programme',
            },
            {
              title: 'Health',
              text: 'Community health, nutrition, and awareness drives.',
              tag: 'Programme',
            },
          ],
        },
      },
      {
        label: 'Childrens Welfare',
        path: 'childrens-welfare',
        icon: 'child_care',
        page: {
          title: 'Childrens Welfare',
          eyebrow: 'Programmes',
          summary: 'Child protection and support programmes.',
          kind: 'cards',
          cards: [
            {
              title: 'Child support',
              text: 'Learning, nutrition, and care pathways for children.',
              tag: 'Programme',
            },
          ],
        },
      },
      {
        label: 'Womens Welfare',
        path: 'womens-welfare',
        icon: 'female',
        page: {
          title: 'Womens Welfare',
          eyebrow: 'Programmes',
          summary: 'Women-centered economic and social support.',
          kind: 'cards',
          cards: [
            {
              title: 'Women empowerment',
              text: 'Training, self-help group support, and livelihood access.',
              tag: 'Programme',
            },
          ],
        },
      },
      {
        label: 'PWD Welfare',
        path: 'pwd-welfare',
        icon: 'accessibility_new',
        page: {
          title: 'PWD Welfare',
          eyebrow: 'Programmes',
          summary: 'Inclusion and accessibility support programmes.',
          kind: 'cards',
          cards: [
            {
              title: 'Accessibility',
              text: 'Services designed around participation and dignity.',
              tag: 'Programme',
            },
          ],
        },
      },
      {
        label: 'Vocational Training',
        path: 'vocational-training',
        icon: 'school',
        page: {
          title: 'Vocational Training',
          eyebrow: 'Programmes',
          summary: 'Job-oriented skills and training pathways.',
          kind: 'cards',
          cards: [
            {
              title: 'Skill building',
              text: 'Training modules aligned with local employment needs.',
              tag: 'Programme',
            },
          ],
        },
      },
      {
        label: 'Mental Health',
        path: 'mental-health',
        icon: 'psychology',
        page: {
          title: 'Mental Health',
          eyebrow: 'Programmes',
          summary: 'Counselling and emotional well-being support.',
          kind: 'cards',
          cards: [
            {
              title: 'Well-being',
              text: 'Awareness, referral, and counselling support.',
              tag: 'Programme',
            },
          ],
        },
      },
      {
        label: 'Senior Citizen',
        path: 'senior-citizen',
        icon: 'elderly',
        page: {
          title: 'Senior Citizen',
          eyebrow: 'Programmes',
          summary: 'Care and companionship focused initiatives.',
          kind: 'cards',
          cards: [
            {
              title: 'Ageing with dignity',
              text: 'Home visits, support services, and engagement activities.',
              tag: 'Programme',
            },
          ],
        },
      },
      {
        label: 'Substance Abuse',
        path: 'substance-abuse',
        icon: 'support',
        page: {
          title: 'Substance Abuse',
          eyebrow: 'Programmes',
          summary: 'Prevention and recovery support work.',
          kind: 'cards',
          cards: [
            {
              title: 'Prevention',
              text: 'Referral pathways, awareness sessions, and family support.',
              tag: 'Programme',
            },
          ],
        },
      },
      {
        label: 'Education HRW',
        path: 'education-hrw',
        icon: 'menu_book',
        page: {
          title: 'Education HRW',
          eyebrow: 'Programmes',
          summary: 'Education and rights-based learning initiatives.',
          kind: 'cards',
          cards: [
            {
              title: 'Learning access',
              text: 'School support, tutoring, and bridge learning.',
              tag: 'Programme',
            },
          ],
        },
      },
      {
        label: 'Animal Welfare',
        path: 'animal-welfare',
        icon: 'pets',
        page: {
          title: 'Animal Welfare',
          eyebrow: 'Programmes',
          summary: 'Animal care and community awareness.',
          kind: 'cards',
          cards: [
            {
              title: 'Care and awareness',
              text: 'Protection, treatment support, and local outreach.',
              tag: 'Programme',
            },
          ],
        },
      },
      {
        label: 'Capacity Building',
        path: 'capacity-building',
        icon: 'build_circle',
        page: {
          title: 'Capacity Building',
          eyebrow: 'Programmes',
          summary: 'Training the people who deliver the work.',
          kind: 'cards',
          cards: [
            {
              title: 'Capability growth',
              text: 'Workshops, facilitation, and organizational learning.',
              tag: 'Programme',
            },
          ],
        },
      },
      {
        label: 'Water Sanitation',
        path: 'water-sanitation',
        icon: 'water_drop',
        page: {
          title: 'Water Sanitation',
          eyebrow: 'Programmes',
          summary: 'Community water and hygiene support.',
          kind: 'cards',
          cards: [
            {
              title: 'WASH',
              text: 'Clean water, sanitation, and public hygiene campaigns.',
              tag: 'Programme',
            },
          ],
        },
      },
      {
        label: 'Advocacy',
        path: 'advocacy',
        icon: 'campaign',
        page: {
          title: 'Advocacy',
          eyebrow: 'Programmes',
          summary: 'Policy and public voice work.',
          kind: 'cards',
          cards: [
            {
              title: 'Public voice',
              text: 'Awareness campaigns and issue-based advocacy.',
              tag: 'Programme',
            },
          ],
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
          summary: 'A clean listing of donors, support type, and dates.',
          kind: 'table',
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Donor Name' },
              { key: 'createdDate', label: 'Created Date' },
              { key: 'action', label: 'Type', type: 'status' },
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
          kind: 'table',
          table: {
            columns: [
              { key: 'slNo', label: 'Sl No' },
              { key: 'title', label: 'Role' },
              { key: 'createdDate', label: 'Status' },
              { key: 'action', label: 'Action', type: 'download' },
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
