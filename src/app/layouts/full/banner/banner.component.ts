import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  imports: [],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent implements OnInit {
  slides: Array<{ id: number; src: string; title: string; subtitle: string }> = [];
  activeIndex = 0;
  autoPlayTimer: any;

  ngOnInit(): void {
    this.slides = [
      {
        id: 0,
        src: './assets/images/banners/banner1.jpg',
        title: 'First slide',
        subtitle: 'Nulla vitae elit libero, a pharetra augue mollis interdum.'
      },
      {
        id: 1,
        src: './assets/images/banners/banner2.jpeg',
        title: 'Second slide',
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      },
      {
        id: 2,
        src: './assets/images/banners/banner3.jpeg',
        title: 'Third slide',
        subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
      }
    ];

    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
  }

  nextSlide(): void {
    this.activeIndex = (this.activeIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.activeIndex = (this.activeIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.activeIndex = index;
  }

  private startAutoPlay(): void {
    this.autoPlayTimer = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }
}
