import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AwardsRecognitionComponent } from './awards-recognition.component';
import { apiEndpoints } from '../../../api-endpoints';

describe('AwardsRecognitionComponent', () => {
  let fixture: ComponentFixture<AwardsRecognitionComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwardsRecognitionComponent, HttpClientTestingModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AwardsRecognitionComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads awards from the API and renders them', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(apiEndpoints.awardsRecognitions);
    expect(req.request.method).toBe('GET');

    req.flush([
      {
        id: 1,
        title: 'Award title',
        image_path: '/uploads/award.jpg',
      },
    ]);

    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.gallery-card');
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain('Award title');
  });
});
