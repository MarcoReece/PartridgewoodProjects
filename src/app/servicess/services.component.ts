import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  @ViewChild('paintingSection') paintingSection!: ElementRef;
  @ViewChild('dampSection') dampSection!: ElementRef;
  @ViewChild('buildingSection') buildingSection!: ElementRef;
  @ViewChild('guttersSection') guttersSection!: ElementRef;
  @ViewChild('tilingSection') tilingSection!: ElementRef;
  @ViewChild('doorSection') doorSection!: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  scrollToPainting() {
    const element = this.paintingSection.nativeElement;
    const elementPosition = element.getBoundingClientRect();
    const offset = elementPosition.top - (window.innerHeight - elementPosition.height) / 2;
    element.scrollIntoView({ behavior: 'smooth' });
    window.scrollBy(0, offset);
  }

  scrollToDamp() {
    const element = this.dampSection.nativeElement;
    const elementPosition = element.getBoundingClientRect();
    const offset = elementPosition.top - (window.innerHeight - elementPosition.height) / 2;
    window.scrollBy(0, offset);
  }

  scrollToBuilding() {
    const element = this.buildingSection.nativeElement;
    const elementPosition = element.getBoundingClientRect();
    const offset = elementPosition.top - (window.innerHeight - elementPosition.height) / 2;
    element.scrollIntoView({ behavior: 'smooth' });
    window.scrollBy(0, offset);
  }

  scrollToGutters() {
    const element = this.guttersSection.nativeElement;
    const elementPosition = element.getBoundingClientRect();
    const offset = elementPosition.top - (window.innerHeight - elementPosition.height) / 2;
    element.scrollIntoView({ behavior: 'smooth' });
    window.scrollBy(0, offset);
  }

  scrollToTiling() {
    const element = this.tilingSection.nativeElement;
    const elementPosition = element.getBoundingClientRect();
    const offset = elementPosition.top - (window.innerHeight - elementPosition.height) / 2;
    element.scrollIntoView({ behavior: 'smooth' });
    window.scrollBy(0, offset);
  }

  scrollToDoor() {
    const element = this.doorSection.nativeElement;
    const elementPosition = element.getBoundingClientRect();
    const offset = elementPosition.top - (window.innerHeight - elementPosition.height) / 2;
    element.scrollIntoView({ behavior: 'smooth' });
    window.scrollBy(0, offset);
  }

}