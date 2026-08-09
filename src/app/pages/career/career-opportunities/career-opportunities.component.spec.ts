import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CareerOpportunitiesComponent } from './career-opportunities.component';
import { apiEndpoints } from '../../../api-endpoints';

describe('CareerOpportunitiesComponent', () => {
  let fixture: ComponentFixture<CareerOpportunitiesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerOpportunitiesComponent, HttpClientTestingModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CareerOpportunitiesComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads opportunities from the API and renders a table when openings exist', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(apiEndpoints.opportunities);
    expect(req.request.method).toBe('GET');

    req.flush([
      {
        id: 1,
        title: 'Programme Officer',
        qualification: 'Graduate in Social Work',
        number_of_posts: 2,
        remuneration: '₹35,000/month',
        age_limit: '30 years',
      },
    ]);

    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
  });
});
