import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-drawing-menu',
  templateUrl: './drawing-menu.component.html',
  styleUrls: ['./drawing-menu.component.scss'],
})
export class DrawingMenuComponent implements OnInit {
  constructor() {}

  @ViewChild('hamburger') hamburger: ElementRef;
  @Input() isClosed: boolean = false;
  // isClosed: boolean = true;

  ngOnInit() {
    // this.isClosed = true;
  }

  burgerTime() {
    this.isClosed = !this.isClosed;
  }

}
