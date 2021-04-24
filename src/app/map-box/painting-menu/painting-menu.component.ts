import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-painting-menu',
  templateUrl: './painting-menu.component.html',
  styleUrls: ['./painting-menu.component.scss']
})
export class PaintingMenuComponent implements OnInit {
  constructor() { }

  @ViewChild("hamburger") hamburger: ElementRef;
  @Input() isClosed: boolean = false;
  // isClosed: boolean = true;

  ngOnInit() {

      // this.isClosed = true;

  }

  burgerTime() {
    this.isClosed = !this.isClosed;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes["isClosed"]) {
  //     // this.lastDigit = this.digit;
  //     console.log('isClosed Changed to ' + this.isClosed)
  //   }
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  //}
}
