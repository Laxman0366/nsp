import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ImageGalleryComponent } from './image-gallery.component';
import { apiEndpoints } from '../../../api-endpoints';

describe('ImageGalleryComponent', () => {
  let fixture: ComponentFixture<ImageGalleryComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageGalleryComponent, HttpClientTestingModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageGalleryComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads gallery photos from the API and renders them', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(apiEndpoints.imageGalleries);
    expect(req.request.method).toBe('GET');

    req.flush([
      {
        id: 1,
        title: 'Photo title',
        image_path: '/uploads/photo.jpg',
      },
    ]);

    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.gallery-card');
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain('Photo title');
  });
});
