
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
      // console.log('Width: '+ this.innerWidth +' Height: '+ this.innerHeight);
      this.canvas.nativeElement.width = this.innerWidth;
      this.canvas.nativeElement.height = this.innerHeight;
      // console.log(this.ctx);
      // console.log(this.canvas);
    }

  onCanvasDrawn() {
    //you need to emit event
    this.delete.emit(false);
    // this can be done from button click mostly, which i am guessing is your case
  }

  startPosition(e){
    // Draw a dot if the mouse button is currently being pressed

    this.painting = true;

    // separated mouse and touch events (mousedown is for emulating mouse for touch)
    if (this.mouseDown) {

      this.getMousePos(e);
      var f = e.changedTouches[0];
      this.x = f.screenX;
      this.y = f.screenY;
      this.drawTouch(e);

    } else {

      this.x = e.pageX;
      this.y = e.pageY;
      this.draw(e);

    }
  }

  finishedPosition(){
    this.painting = false;
    this.ctx.beginPath();

    var drawData = this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    // console.log(drawData);
    this.onCanvasDrawn();
    //this.PaintingToggle = !this.PaintingToggle;
  }

  positionMove(e){
    this.getMousePos(e);

    // Draw a dot if the mouse button is currently being pressed
    if (this.mouseDown) {
        //this.drawDot(ctx,mouseX,mouseY,12);
        this.drawTouch(e);
    }
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
    this.ctx.moveTo(e.clientX, e.clientY);


    // Jokaista 10px kohden emitoidaan eventti parentille
    // tarkoitus on luoda custom-route pisteillä
    var math = Math.round(Math.sqrt(Math.pow(this.y - e.clientY, 2) +
    Math.pow(this.x - e.clientX, 2)));

    if (math > 9){

      this.createPoint.emit(e);

      this.x = e.pageX;
      this.y = e.pageY;
    }
  }

  drawTouch(e){
    if(!this.painting) return;
    this.ctx.lineWidth = 10;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.brushColor;
    // this.ctx. = 'black';

    // console.log('mouseX: ' + this.mouseX + ' mouseY: ' + this.mouseY);

    this.ctx.lineTo(this.mouseX, this.mouseY);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(this.mouseX, this.mouseY);

    e = e.changedTouches[0];
    // Jokaista 10px kohden emitoidaan eventti parentille
    // tarkoitus on luoda custom-route pisteillä
    var math = Math.round(Math.sqrt(Math.pow(this.y - e.screenY, 2) +
    Math.pow(this.x - e.screenX, 2)));
    // console.log('--------MATH----------');
    // console.log(math);
    // console.log(this.y);
    // console.log(e.screenY);
    // console.log(this.x);
    // console.log(e.screenX);

    if (math > 9){

      this.createPoint.emit(e);

      this.x = e.screenX;
      this.y = e.screenY;
    }
  }

  ngOnInit() {
  }
    // Variables for referencing the canvas and 2dcanvas context
    // canvas,ctx;

    // Variables to keep track of the mouse position and left-button status
    mouseX:any;
    mouseY:any;
    mouseDown:boolean=false;

    // Draws a dot at a specific position on the supplied canvas name
    // Parameters are: A canvas context, the x position, the y position, the size of the dot

      // Keep track of the mouse button being pressed and draw a dot at current location
    sketchpad_mouseDown(e) {
        this.mouseDown=true;
        // this.drawDot(ctx,mouseX,mouseY,12);
        this.draw(e);
    }

    // Keep track of the mouse button being released
    sketchpad_mouseUp() {
        this.mouseDown=false;
    }

    // Keep track of the mouse position and draw a dot if mouse button is currently pressed
    sketchpad_mouseMove(e) {
        // Update the mouse co-ordinates when moved
        this.getMousePos(e);

        // Draw a dot if the mouse button is currently being pressed
        if (this.mouseDown) {
            //this.drawDot(ctx,mouseX,mouseY,12);
            this.draw(e);
        }
    }

    // Get the current mouse position relative to the top-left of the canvas
    getMousePos(e:any) {
      // console.log(e);
      e = e.changedTouches[0];

        if (!e)
            var e:any = window.event;

        if (e.offsetX) {
          this.mouseX = e.offsetX;
          this.mouseY = e.offsetY;
        } else if (e.clientX) {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
        } else if (e.pageX) {
          this.mouseX = e.pageX;
          this.mouseY = e.pageY;
        } else if (e.screenX) {
          this.mouseX = e.screenX;
          this.mouseY = e.screenY;
        } else if (e.layerX) {
          this.mouseX = e.layerX;
          this.mouseY = e.layerY;
        }
        // this.x = e.pageX;
        // this.y = e.pageY;


    // console.log('offset, mouseX: ' + e.offsetX + ' mouseY: ' + e.offsetY);

    // console.log('screen, mouseX: ' + e.screenX + ' mouseY: ' + e.screenY);

    // console.log('layer, mouseX: ' + e.layerX + ' mouseY: ' + e.layerY);

    // console.log('client, mouseX: ' + e.clientX + ' mouseY: ' + e.clientY);

    // console.log('page, mouseX: ' + e.pageX + ' mouseY: ' + e.pageY);

     }


  ngAfterViewInit(): void {
    // this.ctx = Array.from(document.getElementsByClassName('mapboxgl-ctrl-bottom-right') as HTMLCollectionOf<HTMLElement>);
    this.ctx = this.canvas.nativeElement.getContext('2d');
    // this.context = this.myCanvas.nativeElement.getContext('2d');

    this.canvas.nativeElement.width = document.body.getAttribute('width');
    this.canvas.nativeElement.height = document.body.getAttribute('height');

    this.canvas.nativeElement.width = document.body.clientWidth;
    this.canvas.nativeElement.height = document.body.clientHeight;

    this.canvas.nativeElement.addEventListener('touchstart', (e) => {
      // console.log('Button clicked' + ' touchstart');

      this.mouseDown = true;
      this.startPosition(e);
    });
    this.canvas.nativeElement.addEventListener('touchend', (e) => {
      // console.log('Button clicked' + ' touchend');

      this.mouseDown = false;
      this.finishedPosition();
    });
    this.canvas.nativeElement.addEventListener('touchmove', (e) => {
      // console.log('Button clicked' + ' touchmove');

      this.positionMove(e);
    });


    this.canvas.nativeElement.addEventListener('mousedown', (e) => {
      // console.log('Button clicked' + ' mousedown');
      this.startPosition(e);
    });
    this.canvas.nativeElement.addEventListener('mouseup', (e) => {
      // console.log('Button clicked' + ' mouseup');
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
