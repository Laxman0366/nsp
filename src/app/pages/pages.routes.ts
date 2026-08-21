import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProgrammesComponent } from './programmes/programmes.component';
import { DonationsComponent } from './donations/donations.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { ReportsComponent } from './reports/reports.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CareerComponent } from './career/career.component';
import { ContactComponent } from './contact/contact.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: HomeComponent,
  }
  ,
  {
    path: 'programmes',
    component: ProgrammesComponent,
  },
  {
    path: 'donations',
    component: DonationsComponent,
  },
  {
    path: 'achievements',
    component: AchievementsComponent,
  },
  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'gallery',
    component: GalleryComponent,
  },
  {
    path: 'career',
    component: CareerComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
];
