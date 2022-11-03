import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-distance',
  templateUrl: './distance.component.html',
  styleUrls: ['./distance.component.scss'],
})
export class DistanceComponent implements OnInit {
  @Input() duration: number;
  @Input() digit: number;
  @Input() steps: number;
  @Input() destination: string;
  @Input() hideDistance: boolean;
  @ViewChild('animatedDigit') animatedDigit: ElementRef;

  lastDigit: number;
  // counter animation
  @Input() distance: number;
  // digit: number;
  // steps: number;

  constructor() {}

  ngOnInit() {
    if (this.digit) {
      this.lastDigit = this.digit;
      this.animateCount();
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['digit']) {
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

    if (typeof this.digit === 'number') {
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

    let currentValue = 0;
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
  };

  animateCount1() {
    if (!this.distance) {
      this.distance = 0;
    }

    if (typeof this.digit === 'number') {
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
