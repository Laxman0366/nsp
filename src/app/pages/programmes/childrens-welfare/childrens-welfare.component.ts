import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-childrens-welfare',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './childrens-welfare.component.html',
  styleUrls: ['./childrens-welfare.component.scss']
})
export class ChildrensWelfareComponent {}
