import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('About Us | Partridgewood Projects - Building & Renovation Johannesburg');
    this.meta.updateTag({ name: 'description', content: 'Learn about Partridgewood Projects - 20+ years of building, painting, damp proofing, and renovation experience in Johannesburg, South Africa. Founded 2015.' });
    this.meta.updateTag({ property: 'og:title', content: 'About Us | Partridgewood Projects - Building & Renovation Johannesburg' });
    this.meta.updateTag({ property: 'og:description', content: 'Learn about Partridgewood Projects - 20+ years of building and renovation experience in Johannesburg.' });
    this.meta.updateTag({ name: 'twitter:title', content: 'About Us | Partridgewood Projects - Building & Renovation Johannesburg' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Learn about Partridgewood Projects - 20+ years of building and renovation experience in Johannesburg.' });
  }
}
