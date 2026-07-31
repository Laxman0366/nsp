import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { BannerComponent } from '../../layouts/full/banner/banner.component';
declare var $: any;
interface StoryItem {
  title: string;
  summary: string;
  tag: string;
  image: string;
}

interface GalleryItem {
  title: string;
  image: string;
}

interface PartnerLogoItem {
  name: string;
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
  description?: string;
  link: string;
  date?: string;
  openingDate?: string;
  closingDate?: string;
  pdfLink?: string;
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

  readonly galleryPhotos: GalleryItem[] = [
    {
      title: 'Community workshop in progress',
      image: '/assets/images/blog/blog-img1.jpg',
    },
    {
      title: 'Children in learning session',
      image: '/assets/images/blog/blog-img2.jpg',
    },
    {
      title: 'Women livelihood training',
      image: '/assets/images/blog/blog-img3.jpg',
    },
    {
      title: 'Health camp outreach',
      image: '/assets/images/banners/banner1.jpg',
    },
    {
      title: 'Village development meeting',
      image: '/assets/images/banners/banner2.jpg',
    },
    {
      title: 'Field volunteers at work',
      image: '/assets/images/banners/banner4.jpg',
    },
  ];

  readonly partnerLogos: PartnerLogoItem[] = [
    {
      name: 'NSP Main Logo',
      image: '/assets/images/logos/nsp_logo.jpeg',
    },
    {
      name: 'NSP Secondary Logo',
      image: '/assets/images/logos/nsp_logo2.jpeg',
    },
    {
      name: 'Brandmark',
      image: '/assets/images/logos/logo.svg',
    },
    {
      name: 'Icon Mark',
      image: '/assets/images/logos/logo-icon.svg',
    },
    {
      name: 'Adminmart',
      image: '/assets/images/logos/logo-adminmart.svg',
    },
    {
      name: 'NSP Main Logo Alternate',
      image: '/assets/images/logos/nsp_logo.jpeg',
    },
    {
      name: 'NSP Secondary Logo Alternate',
      image: '/assets/images/logos/nsp_logo2.jpeg',
    },
    {
      name: 'Brandmark Alternate',
      image: '/assets/images/logos/logo.svg',
    },
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
      description:
        'Announcement for upcoming digital literacy sessions with community-led trainers and support materials.',
      link: '#',
      openingDate: '2024-07-28',
      closingDate: '2024-08-12',
      pdfLink: '#',
    },
    {
      id: 2,
      title: 'Recruitment: Join Our Team as Program Coordinator',
      description:
        'Applications invited for program planning, field coordination, and stakeholder engagement activities.',
      link: '#',
      openingDate: '2024-07-25',
      closingDate: '2024-08-08',
      pdfLink: '#',
    },
    {
      id: 3,
      title: 'Scholarship Opportunities: Apply Now for Academic Year 2024-25',
      description:
        'Financial support for eligible students with preference for underserved and rural backgrounds.',
      link: '#',
      openingDate: '2024-07-20',
      closingDate: '2024-08-05',
      pdfLink: '#',
    },
    {
      id: 4,
      title: 'Partnership Announcement: Collaboration with Health Ministry',
      description:
        'Invitation for partner organizations to join co-implementation of health awareness programs.',
      link: '#',
      openingDate: '2024-07-18',
      closingDate: '2024-08-01',
      pdfLink: '#',
    },
  ];

  readonly tendersNotice: NoticeItem[] = [
    {
      id: 1,
      title: 'Tender for Supply of Educational Materials and Stationery',
      description:
        'Procurement of notebooks, textbooks, and classroom kits for project schools across districts.',
      link: '#',
      openingDate: '2024-07-29',
      closingDate: '2024-08-14',
      pdfLink: '#',
    },
    {
      id: 2,
      title: 'RFP: Construction Services for New Community Center',
      description:
        'Request for qualified contractors to build a multi-use center with sustainable infrastructure.',
      link: '#',
      openingDate: '2024-07-26',
      closingDate: '2024-08-10',
      pdfLink: '#',
    },
    {
      id: 3,
      title: 'Bid Invitation: Medical Equipment and Healthcare Supplies',
      description:
        'Supply of essential diagnostic tools, consumables, and basic treatment support equipment.',
      link: '#',
      openingDate: '2024-07-22',
      closingDate: '2024-08-07',
      pdfLink: '#',
    },
    {
      id: 4,
      title: 'Expression of Interest: Environmental Conservation Projects',
      description:
        'Seeking implementation agencies for watershed, plantation, and biodiversity restoration projects.',
      link: '#',
      openingDate: '2024-07-19',
      closingDate: '2024-08-03',
      pdfLink: '#',
    },
  ];

  readonly newsAndEvents: NoticeItem[] = [
    {
      id: 1,
      title: 'Upcoming Event: Community Health Camp on August 5th',
      description:
        'A free one-day camp offering health checkups, medicines, and awareness sessions for local families.',
      link: '#',
      date: '2024-07-27',
    },
    {
      id: 2,
      title: 'News: NSP Receives Credibility Alliance Award for Excellence',
      description:
        'NSP was recognized for transparent governance, impactful programs, and consistent community outreach.',
      link: '#',
      date: '2024-07-24',
    },
    {
      id: 3,
      title: 'Workshop: Sustainable Development Skills Training - Register Now',
      description:
        'An interactive workshop focused on practical climate action, livelihoods, and grassroots leadership.',
      link: '#',
      date: '2024-07-21',
    },
    {
      id: 4,
      title: 'Event Report: Annual Donor Appreciation Gala 2024',
      description:
        'Highlights from the annual gathering celebrating partners, milestones, and future collaboration plans.',
      link: '#',
      date: '2024-07-17',
    },
  ];

  ngAfterViewInit() {
    $(document).ready(function () {
      $(".stories-carousel").owlCarousel({
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

      $(".partners-logos-carousel").owlCarousel({
        loop: true,
        margin: 16,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 2200,
        autoplayHoverPause: true,
        responsive: {
          0: {
            items: 2
          },
          576: {
            items: 3
          },
          768: {
            items: 4
          },
          1024: {
            items: 6
          }
        }
      });
    });
  }
}
