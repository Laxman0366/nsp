import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SuccessStoryComponent } from './success-story.component';
import { apiEndpoints } from '../../../api-endpoints';

describe('SuccessStoryComponent', () => {
  let fixture: ComponentFixture<SuccessStoryComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessStoryComponent, HttpClientTestingModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessStoryComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads stories from the success stories endpoint', () => {
    const req = httpMock.expectOne(apiEndpoints.successStories);
    expect(req.request.method).toBe('GET');

    req.flush([
      {
        id: 1,
        title: 'Test story',
        sub_title: 'A meaningful proverb',
        description: 'Story body',
        image_path: '',
      },
    ]);

    fixture.detectChanges();

    const titles = fixture.nativeElement.querySelectorAll('.story-title');
    expect(titles.length).toBe(1);
    expect(titles[0].textContent).toContain('Test story');
  });
});
