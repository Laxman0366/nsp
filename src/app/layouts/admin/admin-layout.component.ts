import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { ADMIN_MENU, AdminMenuGroup } from '../../admin/admin-data';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterModule, MaterialModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminLayoutComponent {
  readonly menuGroups: AdminMenuGroup[] = ADMIN_MENU;

  constructor(public router: Router) {}

  isGroupActive(group: AdminMenuGroup): boolean {
    const activePath = `/admin/${group.path}`;
    return this.router.url === activePath || this.router.url.startsWith(`${activePath}/`);
  }

  itemPath(groupPath: string, itemPath: string): string {
    return `/admin/${groupPath}/${itemPath}`;
  }
}
