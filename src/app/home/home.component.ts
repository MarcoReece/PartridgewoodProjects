import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit() {
    this.title.setTitle('Partridgewood Projects | Building & Renovation Services Johannesburg');
    this.meta.updateTag({ name: 'description', content: 'Professional building, painting, damp proofing, tiling, gutter installation, and door & window fitting in Johannesburg. 20+ years experience. Free quotes. Call 061 428 4712.' });
    this.meta.updateTag({ property: 'og:title', content: 'Partridgewood Projects | Building & Renovation Services Johannesburg' });
    this.meta.updateTag({ property: 'og:description', content: 'Professional building, painting, damp proofing, tiling, gutter installation, and door & window fitting in Johannesburg. 20+ years experience.' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Partridgewood Projects | Building & Renovation Services Johannesburg' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Professional building, painting, damp proofing, tiling, gutter installation, and door & window fitting in Johannesburg.' });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
