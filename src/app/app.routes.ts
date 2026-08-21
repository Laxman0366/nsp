import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AboutOrganizationComponent } from './pages/about/about-organization/about-organization.component';
import { BriefProfileComponent } from './pages/about/brief-profile/brief-profile.component';
import { FounderMessageComponent } from './pages/about/founder-message/founder-message.component';
import { GoverningBodyComponent } from './pages/about/governing-body/governing-body.component';
import { GeneralBodyComponent } from './pages/about/general-body/general-body.component';
import { LegalDocumentComponent } from './pages/about/legal-document/legal-document.component';
import { LegalStatusComponent } from './pages/about/legal-status/legal-status.component';
import { ProgrammesComponent } from './pages/programmes/programmes.component';
import { ProgrammeOverviewComponent } from './pages/programmes/programme-overview/programme-overview.component';
import { ChildrensWelfareComponent } from './pages/programmes/childrens-welfare/childrens-welfare.component';
import { WomensWelfareComponent } from './pages/programmes/womens-welfare/womens-welfare.component';
import { PWDWelfareComponent } from './pages/programmes/pwd-welfare/pwd-welfare.component';
import { VocationalTrainingComponent } from './pages/programmes/vocational-training/vocational-training.component';
import { MentalHealthComponent } from './pages/programmes/mental-health/mental-health.component';
import { SeniorCitizenComponent } from './pages/programmes/senior-citizen/senior-citizen.component';
import { SubstanceAbuseComponent } from './pages/programmes/substance-abuse/substance-abuse.component';
import { EducationHRWComponent } from './pages/programmes/education-hrw/education-hrw.component';
import { AnimalWelfareComponent } from './pages/programmes/animal-welfare/animal-welfare.component';
import { CapacityBuildingComponent } from './pages/programmes/capacity-building/capacity-building.component';
import { WaterSanitationComponent } from './pages/programmes/water-sanitation/water-sanitation.component';
import { AdvocacyComponent } from './pages/programmes/advocacy/advocacy.component';
import { ProgrammeCategoryComponent } from './pages/programmes/programme-category/programme-category.component';
import { DonationsComponent } from './pages/donations/donations.component';
import { DonateNowComponent } from './pages/donations/donate-now/donate-now.component';
import { DonorListComponent } from './pages/donations/donor-list/donor-list.component';
import { AchievementsComponent } from './pages/achievements/achievements.component';
import { SuccessStoryComponent } from './pages/achievements/success-story/success-story.component';
import { MediaCoverageComponent } from './pages/achievements/media-coverage/media-coverage.component';
import { AwardsRecognitionComponent } from './pages/achievements/awards-recognition/awards-recognition.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { AnnualReportComponent } from './pages/reports/annual-report/annual-report.component';
import { AuditReportComponent } from './pages/reports/audit-report/audit-report.component';
import { BeneficiaryListComponent } from './pages/reports/beneficiary-list/beneficiary-list.component';
import { StaffListComponent } from './pages/reports/staff-list/staff-list.component';
import { FoodMenuComponent } from './pages/reports/food-menu/food-menu.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { ImageGalleryComponent } from './pages/gallery/image-gallery/image-gallery.component';
import { VideoGalleryComponent } from './pages/gallery/video-gallery/video-gallery.component';
import { CareerComponent } from './pages/career/career.component';
import { CareerOpportunitiesComponent } from './pages/career/career-opportunities/career-opportunities.component';
import { ApplyNowComponent } from './pages/career/apply-now/apply-now.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { AccessCctvComponent } from './pages/access-cctv/access-cctv.component';
import { NoticeListComponent } from './pages/notices/notice-list.component';
import { adminAuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.AdminRoutes),
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'notices/:type',
        component: NoticeListComponent,
      },
      {
        path: 'about/organization',
        component: AboutOrganizationComponent,
      },
      {
        path: 'about/brief-profile',
        component: BriefProfileComponent,
      },
      {
        path: 'about/founder-message',
        component: FounderMessageComponent,
      },
      {
        path: 'about/governing-body',
        component: GoverningBodyComponent,
      },
      {
        path: 'about/general-body',
        component: GeneralBodyComponent,
      },
      {
        path: 'about/legal-document',
        component: LegalDocumentComponent,
      },
      {
        path: 'about/legal-status',
        component: LegalStatusComponent,
      },
      {
        path: 'programmes',
        component: ProgrammesComponent,
      },
      {
        path: 'programmes/category/:programmeId',
        component: ProgrammeCategoryComponent,
      },
      {
        path: 'programmes/overview',
        component: ProgrammeOverviewComponent,
      },
      {
        path: 'programmes/childrens-welfare',
        component: ChildrensWelfareComponent,
      },
      {
        path: 'programmes/womens-welfare',
        component: WomensWelfareComponent,
      },
      {
        path: 'programmes/pwd-welfare',
        component: PWDWelfareComponent,
      },
      {
        path: 'programmes/vocational-training',
        component: VocationalTrainingComponent,
      },
      {
        path: 'programmes/mental-health',
        component: MentalHealthComponent,
      },
      {
        path: 'programmes/senior-citizen',
        component: SeniorCitizenComponent,
      },
      {
        path: 'programmes/substance-abuse',
        component: SubstanceAbuseComponent,
      },
      {
        path: 'programmes/education-hrw',
        component: EducationHRWComponent,
      },
      {
        path: 'programmes/animal-welfare',
        component: AnimalWelfareComponent,
      },
      {
        path: 'programmes/capacity-building',
        component: CapacityBuildingComponent,
      },
      {
        path: 'programmes/water-sanitation',
        component: WaterSanitationComponent,
      },
      {
        path: 'programmes/advocacy',
        component: AdvocacyComponent,
      },
      {
        path: 'donations',
        component: DonationsComponent,
      },
      {
        path: 'donations/donate-now',
        component: DonateNowComponent,
      },
      {
        path: 'donations/donor-list',
        component: DonorListComponent,
      },
      {
        path: 'achievements',
        component: AchievementsComponent,
      },
      {
        path: 'achievements/success-story',
        component: SuccessStoryComponent,
      },
      {
        path: 'achievements/media-coverage',
        component: MediaCoverageComponent,
      },
      {
        path: 'achievements/awards-recognition',
        component: AwardsRecognitionComponent,
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
      {
        path: 'reports/annual-report',
        component: AnnualReportComponent,
      },
      {
        path: 'reports/audit-report',
        component: AuditReportComponent,
      },
      {
        path: 'reports/beneficiary-list',
        component: BeneficiaryListComponent,
      },
      {
        path: 'reports/staff-list',
        component: StaffListComponent,
      },
      {
        path: 'reports/food-menu',
        component: FoodMenuComponent,
      },
      {
        path: 'gallery',
        component: GalleryComponent,
      },
      {
        path: 'gallery/image-gallery',
        component: ImageGalleryComponent,
      },
      {
        path: 'gallery/video-gallery',
        component: VideoGalleryComponent,
      },
      {
        path: 'career',
        component: CareerComponent,
      },
      {
        path: 'career/opportunities',
        component: CareerOpportunitiesComponent,
      },
      {
        path: 'career/apply-now',
        component: ApplyNowComponent,
      },
      {
        path: 'access-cctv',
        component: AccessCctvComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
