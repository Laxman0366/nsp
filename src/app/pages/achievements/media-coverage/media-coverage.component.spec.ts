import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MediaCoverageComponent } from './media-coverage.component';
import { apiEndpoints } from '../../../api-endpoints';

describe('MediaCoverageComponent', () => {
  let fixture: ComponentFixture<MediaCoverageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaCoverageComponent, HttpClientTestingModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaCoverageComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads media coverages from the API and renders them', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(apiEndpoints.mediaCoverages);
    expect(req.request.method).toBe('GET');

    req.flush([
      {
        id: 1,
        title: 'First media story',
        image_path: '/uploads/media-1.jpg',
      },
    ]);

    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.gallery-card');
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain('First media story');
  });
});
