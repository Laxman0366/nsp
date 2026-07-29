import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../layouts/admin/admin-layout.component';
import { AdminComponent } from './admin.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: AdminComponent,
        data: {
          title: 'Admin',
          urls: [{ title: 'Admin', url: '/admin' }],
        },
      },
    ],
  },
];
