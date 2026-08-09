import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { VideoGalleryComponent } from './video-gallery.component';
import { apiEndpoints } from '../../../api-endpoints';

describe('VideoGalleryComponent', () => {
  let fixture: ComponentFixture<VideoGalleryComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoGalleryComponent, HttpClientTestingModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoGalleryComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads videos from the API and renders them', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(apiEndpoints.videoGalleries);
    expect(req.request.method).toBe('GET');

    req.flush([
      {
        id: 1,
        title: 'Video title',
        video_path: '/assets/uploads/uploads_6a747641a82568.26436297.mp4',
      },
    ]);

    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.gallery-card');
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain('Video title');
  });
});
