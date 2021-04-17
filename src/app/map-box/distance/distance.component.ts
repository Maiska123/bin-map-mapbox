import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-distance',
  templateUrl: './distance.component.html',
  styleUrls: ['./distance.component.scss']
})
export class DistanceComponent implements OnInit {


  @Input() duration: number;
  @Input() digit: number;
  @Input() steps: number;
  @ViewChild("animatedDigit") animatedDigit: ElementRef;

  lastDigit: number;
    // counter animation
    @Input() distance: number;
    // digit: number;
    // steps: number;

  constructor() { }

  ngOnInit() {
    if (this.digit) {
      this.lastDigit = this.digit;
      this.animateCount();
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // console.log(getComputedStyle(document.getElementById("distance")).getPropertyValue('--percent'));

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["digit"]) {
      // this.lastDigit = this.digit;
      this.animateCount();
    }
    // console.log('from distance: '+ this.digit)
    // console.log('from distance: '+ this.distance)
  }

  animateCount() {
    if (!this.duration) {
      this.duration = 1000;
    }

    if (typeof this.digit === "number") {
      this.counterFunc(this.digit, this.duration, this.animatedDigit);
    }
  }

  counterFunc(endValue, durationMs, element) {
    if (!this.steps) {
      this.steps = 12;
    }

    const stepCount = Math.abs(durationMs / this.steps);
    const valueIncrement = (endValue - 0) / stepCount;
    const sinValueIncrement = Math.PI / stepCount;

    let currentValue = this.digit;
    let currentSinValue = 0;

    if (this.lastDigit < this.digit) {
    function stepUp() {
      currentSinValue += sinValueIncrement;
      currentValue += valueIncrement * Math.sin(currentSinValue) ** 2 * 2;

      element.nativeElement.textContent = Math.abs(Math.floor(currentValue));

      if (currentSinValue < Math.PI) {
        window.requestAnimationFrame(stepUp);
      }
    }
    stepUp();
  } else {
    function stepDown() {
      currentSinValue += sinValueIncrement;
      currentValue += valueIncrement * Math.sin(currentSinValue) ** 2 * 2;

      element.nativeElement.textContent = Math.abs(Math.floor(currentValue));

      if (currentSinValue < Math.PI) {
        window.requestAnimationFrame(stepDown);
      }
    }
    stepDown();

  }



  }

  genNumber = () => {
    document.getElementById("distance").style.setProperty("--percent", Math.random());
// console.log(getComputedStyle(document.getElementById("distance")).getPropertyValue('--percent'));

  };


  animateCount1() {
    if (!this.distance) {
      this.distance = 0;
    }

    if (typeof this.digit === "number") {
      this.counterFunc1(this.digit, this.duration, this.animatedDigit);
    }
  }

  counterFunc1(endValue, durationMs, element) {
    if (!this.steps) {
      this.steps = 12;
    }

    const stepCount = Math.abs(durationMs / this.steps);
    const valueIncrement = (endValue - 0) / stepCount;
    const sinValueIncrement = Math.PI / stepCount;

    let currentValue = 0;
    let currentSinValue = 0;

    function step() {
      currentSinValue += sinValueIncrement;
      currentValue += valueIncrement * Math.sin(currentSinValue) ** 2 * 2;

      element.nativeElement.textContent = Math.abs(Math.floor(currentValue));

      if (currentSinValue < Math.PI) {
        window.requestAnimationFrame(step);
      }
    }

    step();
  }

}
