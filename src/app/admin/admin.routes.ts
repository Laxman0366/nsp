import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../layouts/admin/admin-layout.component';
import { AdminComponent } from './admin.component';
import { AdminContentComponent } from './admin-content.component';
import { ADMIN_ROUTE_ITEMS } from './admin-data';
import { ChangePasswordComponent } from './change-password/change-password.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        data: {
          title: 'Change Password',
          urls: [
            { title: 'Admin', url: '/admin/dashboard' },
            { title: 'Change Password', url: '/admin/change-password' },
          ],
        },
      },
      ...ADMIN_ROUTE_ITEMS.map((item) => ({
        path: `${item.groupPath}/${item.path}`,
        component: AdminContentComponent,
        data: {
          page: item.page,
          title: item.page.title,
          urls: [
            { title: 'Admin', url: '/admin/dashboard' },
            { title: item.groupLabel, url: `/admin/${item.groupPath}` },
            { title: item.label, url: `/admin/${item.groupPath}/${item.path}` },
          ],
        },
      })),
    ],
  },
];
