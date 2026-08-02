import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../layouts/admin/admin-layout.component';
import { AdminComponent } from './admin.component';
import { AdminContentComponent } from './admin-content.component';
import { ADMIN_ROUTE_ITEMS } from './admin-data';

export const AdminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
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
