import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-general-body',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './general-body.component.html',
  styleUrls: ['./general-body.component.scss']
})
export class GeneralBodyComponent {}
