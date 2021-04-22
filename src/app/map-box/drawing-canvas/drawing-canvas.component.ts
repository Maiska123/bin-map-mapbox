
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-drawing-canvas',
  templateUrl: './drawing-canvas.component.html',
  styleUrls: ['./drawing-canvas.component.scss']
})
export class DrawingCanvasComponent implements OnInit {
  public innerWidth: any;
  public innerHeight: any;
  x: any;
  y: any;
  // @ViewChild('canvas') canvas: any;
  @ViewChild('canvas', {static: true}) canvas: ElementRef;

  ctx: CanvasRenderingContext2D;

  @Input('paintingToggle') PaintingToggle: boolean = false;
  @Input('brushColor') brushColor: string = '';


  painting: boolean = false;

  // imageData.data[0] -> pixel1 red value
  // imageData.data[1] -> pixel1 green value
  // imageData.data[2] -> pixel1 blue value
  // imageData.data[3] -> pixel1 alpha value
  // imageData.data[4] -> pixel2 red value
  // ...
  // So pixels are stored in sets of 4. If you want the entire Canvas then we do:

  // ctx.getImageData(0, 0, canvas.width, canvas.height)


//   var img1Data = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
// var img2Data = ctx2.getImageData(0,0,canvas2.width,canvas2.height);

// var X = 0, Y = 0;

// for(var i = 0; i < img1Data.data.length; i += 4) {
//     if(img1Data.data[i] != img2Data.data[i] ||
//     img1Data.data[i+1] != img2Data.data[i+1] ||
//     img1Data.data[i+2] != img2Data.data[i+2] ||
//     img1Data.data[i+3] != img2Data.data[i+3]) {
//         ctx_diff.fillRect( X, Y, 1, 1 );
//     }
//     X += 1;
//     if(X >= canvas1.width) { Y+=1; X = 0 }
// }

  @Output() delete:EventEmitter<any> = new EventEmitter<any>();
  @Output() createPoint:EventEmitter<any> = new EventEmitter<any>();


  constructor() { }

  @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.innerWidth = event.target.innerWidth;
      this.innerHeight = event.target.innerHeight;
      console.log('Width: '+ this.innerWidth +' Height: '+ this.innerHeight);
      this.canvas.nativeElement.width = this.innerWidth;
      this.canvas.nativeElement.height = this.innerHeight;
      console.log(this.ctx);
      console.log(this.canvas);
    }

  onCanvasDrawn() {
    //you need to emit event
    this.delete.emit(false);
    // this can be done from button click mostly, which i am guessing is your case
  }

  startPosition(e){
    this.painting = true;
    this.x = e.pageX;
    this.y = e.pageY;
    this.draw(e);
  }

  finishedPosition(){
    this.painting = false;
    this.ctx.beginPath();

    var drawData = this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    console.log(drawData);
    this.onCanvasDrawn();
    //this.PaintingToggle = !this.PaintingToggle;
  }

  draw(e){
    if(!this.painting) return;
    this.ctx.lineWidth = 10;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.brushColor;
    // this.ctx. = 'black';

    this.ctx.lineTo(e.clientX, e.clientY);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(e.clientX,e.clientY);

    var math = Math.round(Math.sqrt(Math.pow(this.y - e.clientY, 2) +
    Math.pow(this.x - e.clientX, 2)));

    if (math > 9){

      this.createPoint.emit(e);

      this.x = e.pageX;
      this.y = e.pageY;
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // this.ctx = Array.from(document.getElementsByClassName('mapboxgl-ctrl-bottom-right') as HTMLCollectionOf<HTMLElement>);
    this.ctx = this.canvas.nativeElement.getContext('2d');
    // this.context = this.myCanvas.nativeElement.getContext('2d');

    this.canvas.nativeElement.width = document.body.getAttribute('width');
    this.canvas.nativeElement.height = document.body.getAttribute('height');

    this.canvas.nativeElement.width = document.body.clientWidth;
    this.canvas.nativeElement.height = document.body.clientHeight;

    this.canvas.nativeElement.addEventListener('mousedown', (e) => {
      console.log('Button clicked' + name);
      this.startPosition(e);
    });
    this.canvas.nativeElement.addEventListener('mouseup', (e) => {
      console.log('Button clicked' + name);
      this.finishedPosition();
    });
    this.canvas.nativeElement.addEventListener('mousemove', (e) => {
      // console.log('Button clicked' + name);
      this.draw(e);
    });

    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;


  }
}
