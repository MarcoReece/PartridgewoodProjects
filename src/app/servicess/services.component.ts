import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent implements OnInit {
  @ViewChild('paintingSection') paintingSection!: ElementRef;
  @ViewChild('dampSection') dampSection!: ElementRef;
  @ViewChild('buildingSection') buildingSection!: ElementRef;
  @ViewChild('guttersSection') guttersSection!: ElementRef;
  @ViewChild('tilingSection') tilingSection!: ElementRef;
  @ViewChild('doorSection') doorSection!: ElementRef;

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('Services | Partridgewood Projects - Painting, Damp Proofing, Tiling & More in Johannesburg');
    this.meta.updateTag({ name: 'description', content: 'Professional building services in Johannesburg: painting, damp proofing, tiling, gutter installation, building alterations, and door & window fitting. Free quotes. Call 061 428 4712.' });
    this.meta.updateTag({ property: 'og:title', content: 'Services | Partridgewood Projects - Painting, Damp Proofing, Tiling & More' });
    this.meta.updateTag({ property: 'og:description', content: 'Professional building services in Johannesburg: painting, damp proofing, tiling, gutter installation, building alterations, and door & window fitting.' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Services | Partridgewood Projects - Painting, Damp Proofing, Tiling & More' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Professional building services in Johannesburg: painting, damp proofing, tiling, gutter installation, building alterations, and door & window fitting.' });
  }

  scrollToPainting() {
    this.paintingSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  scrollToDamp() {
    this.dampSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  scrollToBuilding() {
    this.buildingSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  scrollToGutters() {
    this.guttersSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  scrollToTiling() {
    this.tilingSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  scrollToDoor() {
    this.doorSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
