import { Component, OnInit, HostListener } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  images: string[] = [
    'assets/pictures/1.jpg',
    'assets/pictures/2.jpg',
    'assets/pictures/3.jpg',
    'assets/pictures/4.jpg',
    'assets/pictures/5.jpg',
    'assets/pictures/6.jpg',
    'assets/pictures/7.jpg',
    'assets/pictures/9.jpg',
    'assets/pictures/10.jpg',
    'assets/pictures/11.jpg',
    'assets/pictures/12.jpg',
    'assets/pictures/13.jpg',
    'assets/pictures/14.jpg',
    'assets/pictures/15.jpg',
    'assets/pictures/16.jpg',
    'assets/pictures/17.jpg',
    'assets/pictures/18.jpg',
    'assets/pictures/19.jpg',
    'assets/pictures/20.jpg',
    'assets/pictures/21.jpg',
    'assets/pictures/22.jpg',
    'assets/pictures/23.jpg',
    'assets/pictures/24.jpg',
    'assets/pictures/25.jpg',
    'assets/pictures/26.jpg',
    'assets/pictures/27.jpg'
  ];

  currentImageIndex: number = 0;
  isLightboxOpen: boolean = false;

  constructor(private title: Title, private meta: Meta) { }

  ngOnInit() {
    this.title.setTitle('Photo Gallery | Partridgewood Projects - Building & Renovation Work in Johannesburg');
    this.meta.updateTag({ name: 'description', content: 'View our portfolio of building, painting, damp proofing, tiling, and renovation projects in Johannesburg. Partridgewood Projects photo gallery.' });
    this.meta.updateTag({ property: 'og:title', content: 'Photo Gallery | Partridgewood Projects - Building & Renovation Work in Johannesburg' });
    this.meta.updateTag({ property: 'og:description', content: 'View our portfolio of building, painting, damp proofing, tiling, and renovation projects in Johannesburg.' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Photo Gallery | Partridgewood Projects - Building & Renovation Work in Johannesburg' });
    this.meta.updateTag({ name: 'twitter:description', content: 'View our portfolio of building, painting, damp proofing, tiling, and renovation projects in Johannesburg.' });
  }

  openLightbox(index: number) {
    this.currentImageIndex = index;
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.isLightboxOpen = false;
    document.body.style.overflow = 'auto';
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isLightboxOpen) {
      if (event.key === 'Escape') {
        this.closeLightbox();
      } else if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'ArrowLeft') {
        this.prevImage();
      }
    }
  }

  getImagePath(index: number): string {
    return this.images[index];
  }

  getImageIndex(imageName: string): number {
    const match = imageName.match(/(\d+)\.jpg/);
    if (!match) return 0;
    const imageNum = parseInt(match[1], 10);
    const imagePath = `assets/pictures/${imageNum}.jpg`;
    return this.images.indexOf(imagePath);
  }
}
