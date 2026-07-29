import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { BannerComponent } from '../../layouts/full/banner/banner.component';
declare var $: any;
interface StoryItem {
  title: string;
  summary: string;
  tag: string;
  image: string;
}

interface CarouselItem {
  title: string;
  text: string;
  tag: string;
  image: string;
  button: string;
  link: string;
}

interface NoticeItem {
  id: number;
  title: string;
  link: string;
  date?: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, MaterialModule, BannerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  readonly stories: StoryItem[] = [
    {
      title: 'Designing calm for busy teams',
      summary:
        'A closer look at how thoughtful layouts reduce friction and keep work feeling clear.',
      tag: 'Product',
      image: '/assets/images/blog/blog-img1.jpg',
    },
    {
      title: 'Why storytelling still matters',
      summary:
        'The simple habits that help ideas land with more confidence and less noise.',
      tag: 'Culture',
      image: '/assets/images/blog/blog-img2.jpg',
    },
    {
      title: 'Launching with momentum',
      summary:
        'Practical ways to turn small wins into an experience people want to share.',
      tag: 'Growth',
      image: '/assets/images/blog/blog-img3.jpg',
    },
    {
      title: 'Why storytelling still matters',
      summary:
        'The simple habits that help ideas land with more confidence and less noise.',
      tag: 'Culture',
      image: '/assets/images/blog/blog-img2.jpg',
    },
    {
      title: 'Launching with momentum',
      summary:
        'Practical ways to turn small wins into an experience people want to share.',
      tag: 'Growth',
      image: '/assets/images/blog/blog-img3.jpg',
    }
  ];

  readonly carouselItems: CarouselItem[] = [
    {
      title: 'Community health camps',
      text: 'Free clinics and outreach programs bringing medical care directly to remote families.',
      tag: 'Health',
      image: '/assets/images/banners/banner4.jpg',
      button: 'Learn more',
      link: '#',
    },
    {
      title: 'Education support',
      text: 'Scholarships and after-school training that empower children to keep learning.',
      tag: 'Education',
      image: '/assets/images/blog/blog-img1.jpg',
      button: 'Discover',
      link: '#',
    },
    {
      title: 'Environmental restoration',
      text: 'Grassroots projects improving local water sources and community forests.',
      tag: 'Sustainability',
      image: '/assets/images/blog/blog-img2.jpg',
      button: 'See details',
      link: '#',
    },
  ];

  readonly advertisements: NoticeItem[] = [
    {
      id: 1,
      title: 'New Training Programme: Digital Skills for Communities',
      link: '#',
      date: '2024-07-28',
    },
    {
      id: 2,
      title: 'Recruitment: Join Our Team as Program Coordinator',
      link: '#',
      date: '2024-07-25',
    },
    {
      id: 3,
      title: 'Scholarship Opportunities: Apply Now for Academic Year 2024-25',
      link: '#',
      date: '2024-07-20',
    },
    {
      id: 4,
      title: 'Partnership Announcement: Collaboration with Health Ministry',
      link: '#',
      date: '2024-07-18',
    },
  ];

  readonly tendersNotice: NoticeItem[] = [
    {
      id: 1,
      title: 'Tender for Supply of Educational Materials and Stationery',
      link: '#',
      date: '2024-07-29',
    },
    {
      id: 2,
      title: 'RFP: Construction Services for New Community Center',
      link: '#',
      date: '2024-07-26',
    },
    {
      id: 3,
      title: 'Bid Invitation: Medical Equipment and Healthcare Supplies',
      link: '#',
      date: '2024-07-22',
    },
    {
      id: 4,
      title: 'Expression of Interest: Environmental Conservation Projects',
      link: '#',
      date: '2024-07-19',
    },
  ];

  readonly newsAndEvents: NoticeItem[] = [
    {
      id: 1,
      title: 'Upcoming Event: Community Health Camp on August 5th',
      link: '#',
      date: '2024-07-27',
    },
    {
      id: 2,
      title: 'News: NSP Receives Credibility Alliance Award for Excellence',
      link: '#',
      date: '2024-07-24',
    },
    {
      id: 3,
      title: 'Workshop: Sustainable Development Skills Training - Register Now',
      link: '#',
      date: '2024-07-21',
    },
    {
      id: 4,
      title: 'Event Report: Annual Donor Appreciation Gala 2024',
      link: '#',
      date: '2024-07-17',
    },
  ];

  ngAfterViewInit() {
    $(document).ready(function () {
      $(".owl-carousel").owlCarousel({
        loop: true,
        margin: 14,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 2800,
        autoplayHoverPause: true,
        responsive: {
          0: {
            items: 1
          },
          700: {
            items: 2
          },
          1024: {
            items: 4
          }
        }
      });
    });
  }
}
