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
    
    // Calculate the scroll position to center the element in the viewport
    const offset = elementPosition.top - (window.innerHeight - elementPosition.height) / 2;
    
    // Use scrollIntoView with behavior 'smooth' to scroll to the element
    element.scrollIntoView({ behavior: 'smooth' });
    
    // Adjust the scroll position to make it more precise
    window.scrollBy(0, offset);
  }

  scrollToDamp() {
    const element = this.dampSection.nativeElement;
    const elementPosition = element.getBoundingClientRect();
    
    // Calculate the scroll position to center the element in the viewport
    const offset = elementPosition.top - (window.innerHeight - elementPosition.height) / 2;
    
    // Use scrollIntoView with behavior 'smooth' to scroll to the element
    element.scrollIntoView({ behavior: 'smooth' });
    
    // Adjust the scroll position to make it more precise
    window.scrollBy(0, offset);
  }

  scrollToBuilding() {
    const element = this.buildingSection.nativeElement;
    const elementPosition = element.getBoundingClientRect();
    
    // Calculate the scroll position to center the element in the viewport
    const offset = elementPosition.top - (window.innerHeight - elementPosition.height) / 2;
    
    // Use scrollIntoView with behavior 'smooth' to scroll to the element
    element.scrollIntoView({ behavior: 'smooth' });
    
    // Adjust the scroll position to make it more precise
    window.scrollBy(0, offset);
  }

  scrollToGutters() {
    const element = this.guttersSection.nativeElement;
    const elementPosition = element.getBoundingClientRect();
    
    // Calculate the scroll position to center the element in the viewport
    const offset = elementPosition.top - (window.innerHeight - elementPosition.height) / 2;
    
    // Use scrollIntoView with behavior 'smooth' to scroll to the element
    element.scrollIntoView({ behavior: 'smooth' });
    
    // Adjust the scroll position to make it more precise
    window.scrollBy(0, offset);
  }

  scrollToTiling() {
    const element = this.tilingSection.nativeElement;
    const elementPosition = element.getBoundingClientRect();
    
    // Calculate the scroll position to center the element in the viewport
    const offset = elementPosition.top - (window.innerHeight - elementPosition.height) / 2;
    
    // Use scrollIntoView with behavior 'smooth' to scroll to the element
    element.scrollIntoView({ behavior: 'smooth' });
    
    // Adjust the scroll position to make it more precise
    window.scrollBy(0, offset);
  }

  scrollToDoor() {
    const element = this.doorSection.nativeElement;
    const elementPosition = element.getBoundingClientRect();
    
    // Calculate the scroll position to center the element in the viewport
    const offset = elementPosition.top - (window.innerHeight - elementPosition.height) / 2;
    
    // Use scrollIntoView with behavior 'smooth' to scroll to the element
    element.scrollIntoView({ behavior: 'smooth' });
    
    // Adjust the scroll position to make it more precise
    window.scrollBy(0, offset);
  }

}