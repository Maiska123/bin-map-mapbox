import { Coordinate } from './../utils/interfaces';

import { MapService } from './../map.service';
import {
  Component,
  ElementRef,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { GeoJson, FeatureCollection } from '../map';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { AngularFireList } from '@angular/fire/database';
import Swal from 'sweetalert2';
import { MatSidenav } from '@angular/material/sidenav';
import { FormControl } from '@angular/forms';

import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss'],
})
export class MapBoxComponent implements OnInit {
  MapboxDirections = MapboxDirections;

  directions;
  directionsOff: boolean = true;
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('sidenav1') sidenav1: MatSidenav;
  @ViewChild('sidenav2') sidenav2: MatSidenav;
  @ViewChild('paintingToggle') paintToggle: MatSlideToggle;

  public map: mapboxgl.Map;
  toogle = new FormControl('', []);
  i: any;

  turf: any;
  brushColor: string = '#000000';

  style = 'mapbox://styles/maiska/ckn5ni6gd0q1a17oykioohezf/draft';
  lat = 61.498643;
  lng = 23.762814;
  message = 'Roskis';
  messageInBubble: string = '';
  currentPosition: any[] = [];
  currentDestination: any[] = [];
  latestReq: any;
  cameraRotate: boolean = false;
  roskisData: any[] = [];
  roskisCoordData: any[] = [];
  @Output('destination') destination: string = '';

  geojsonPaint: GeoJSON.FeatureCollection<any> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [],
        },
        properties: {},
      },
    ],
  };

  geojson = {
    name: 'NewFeatureType',
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [],
        },
        properties: null,
      },
    ],
  };

  paintingChecked: boolean = false;
  paintingSwitchDisabled: boolean = false;
  paintingOn: boolean = false;
  paintCoords: any[] = [];
  eventData: any;

  @ViewChild('animatedDigit') animatedDigit: ElementRef;
  @ViewChild('mapdiv') mapdiv: ElementRef;

  offlineData: FeatureCollection;
  offlineMarkerData: any[] = [];

  distanceToRoskis: string;
  userLocations: any;
  routeData: any[] = [];
  routeDataSet: Set<any> = new Set();
  currentRoskis: any;
  distance: number;
  activity: any;
  activityName: string;
  activityComments: string;
  activityDate: Date;
  activityDistance: number;
  gpx: any;
  routeActivated: boolean = false;
  source: any;
  markers: AngularFireList<any>;
  markersToDisplay: Set<any> = new Set();
  flyToNearestBin: boolean = true;
  flyToBinChecked: boolean = true;
  flyToBinButtonDisabled: boolean = false;
  waypoints: string[] = [];
  isOpen = true;
  burgermenu1: any;
  burgermenu2: any;
  burgermenu3: any;

  roskisUrl =
    'https://geodata.tampere.fi/geoserver/maankaytto/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=maankaytto:WFS_ROSKIS&outputFormat=json';
  nums: Array<number> = [25, 76, 48];

  @ViewChild('oneItem') oneItem: ElementRef;
  @ViewChildren('count') count: QueryList<any>;
  @Output('digit') digit: number = 0;
  @Output('duration') duration: number = 1000;
  @Output('hideDistance') hideDistance: boolean = false;
  @Output('burgertime') burgertime: boolean = true;
  @Output('burgertime2') burgertime2: boolean = true;
  @Output('burgertime3') burgertime3: boolean = true;
  clicked: any;

  private subscription: Subscription;

  createPoint(event: any, i: any) {
    var x, y;
    this.eventData = event;
    (x = event.pageX), (y = event.pageY);

    this.simulatedClick(document.getElementsByClassName('mapboxgl-canvas')[0], {
      clientX: x,
      clientY: y,
    });
  }

  simulatedClick(target, options?) {
    var event = target.ownerDocument.createEvent('MouseEvents'),
      options = options || {},
      opts = {
        type: 'click',
        canBubble: true,
        cancelable: true,
        view: target.ownerDocument.defaultView,
        detail: 1,
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: null,
      };

    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        opts[key] = options[key];
      }
    }

    event.initMouseEvent(
      opts.type,
      opts.canBubble,
      opts.cancelable,
      opts.view,
      opts.detail,
      opts.screenX,
      opts.screenY,
      opts.clientX,
      opts.clientY,
      opts.ctrlKey,
      opts.altKey,
      opts.shiftKey,
      opts.metaKey,
      opts.button,
      opts.relatedTarget
    );

    target.dispatchEvent(event);
  }

  eventFire(el, etype) {
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }

  deleteQuote(event: any, i: any) {
    this.paintToggle.toggle();
    this.paintingOn = false;

    if (this.map.getLayer('canvas-layer')) {
      this.map.removeLayer('canvas-layer');
      this.map.removeSource('canvas-source');
    }
    var bounds: any[][] = this.map.getBounds().toArray();

    var boundsArray: any[] = [
      [bounds[0][0], bounds[1][1]],
      [bounds[1][0], bounds[1][1]],
      [bounds[1][0], bounds[0][1]],
      [bounds[0][0], bounds[0][1]],
    ];

    this.map.addSource('canvas-source', {
      type: 'canvas',
      canvas: 'canvasID',
      coordinates: boundsArray,
      animate: true,
    });

    this.map.addLayer({
      id: 'canvas-layer',
      type: 'raster',
      source: 'canvas-source',
    });

    this.createGeoJSONLine(this.geojson);

    this.getDistanceOfCoordsArray(
      this.geojsonPaint.features[0].geometry.coordinates
    );

    this.paintCoords = [];
  }

  changeBrushColor(color: string) {
    this.brushColor = color;
  }

  paintingEvent(e) {
    if (
      e.type == 'touchstart' ||
      e.type == 'touchmove' ||
      e.type == 'touchend' ||
      e.type == 'touchcancel'
    ) {
      this.sidenav2.toggle();
    } else if (
      e.type == 'mousedown' ||
      e.type == 'mouseup' ||
      e.type == 'mousemove' ||
      e.type == 'mouseover' ||
      e.type == 'mouseout' ||
      e.type == 'mouseenter' ||
      e.type == 'mouseleave'
    ) {
      this.sidenav2.toggle();
    }

    setTimeout(() => {
      this.sidenav2.toggle();
    }, 500);
  }

  paintToggleChange() {
    var max = 255;
    var min = 0;

    var R = (Math.random() * (max - min + 1)) << 0;
    var G = (Math.random() * (max - min + 1)) << 0;
    var B = (Math.random() * (max - min + 1)) << 0;

    this.map.getLayer('canvas-layer')
      ? this.changeBrushColor(`rgba(${R},${G},${B},1)`)
      : this.changeBrushColor('rgba(0,0,0,1)');

    this.paintingOn = !this.paintingOn;
  }

  deletePainting() {
    if (this.map.getLayer('canvas-layer')) {
      this.map.removeLayer('canvas-layer');
      this.map.removeSource('canvas-source');
    }
  }

  constructor(private mapService: MapService, private elRef: ElementRef) {
    this.subscription = new Subscription();
  }

  sidenavClose() {
    this.sidenav.toggle();
  }

  sidenavClose2() {
    this.sidenav1.toggle();
  }

  burgerTime() {
    this.sidenav.toggle();
  }

  burgerTime2() {
    this.sidenav1.toggle();
  }

  burgerTime3() {
    this.sidenav2.toggle();
  }

  backToUser = false;
  doAsyncTask() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.backToUser) {
          reject('error');
          return;
        }

        resolve('done');
      }, 100);
    });
  }

  loadingTimed(): void {
    Swal.queue([
      {
        title: 'Getting Back To User',
        didOpen: () => {
          Swal.showLoading();
        },
        preConfirm: () => {
          Swal.showLoading();
          return this.doAsyncTask()
            .then((data) => Swal.insertQueueStep(data))
            .catch(() => {
              Swal.insertQueueStep({
                icon: 'error',
                title: 'Unable to get to your position',
              });
            })
            .finally(() =>
              Swal.fire('Done!', 'We are back in business.', 'success')
            );
        },
      },
    ]);
  }

  getJSON = (url, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = () => {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
  };

  ngOnInit() {
    this.subscription.add(
      this.mapService.getLocation().subscribe((rep) => {
        this.flyToUserService(rep);
      })
    );

    this.initializeMap();
  }

  makeObject() {
    let splitted: any[];

    this.roskisData.forEach((value, i) => {
      splitted = this.roskisCoordData[i].split(',');
      value.coords = [Number(splitted[1]), Number(splitted[0])];
    });
  }

  sendToSpace() {
    let set: Set<any> = new Set();

    var coordinates = [this.lng, this.lat];
    var newMarker = new GeoJson(coordinates, { message: this.message });

    this.roskisData.forEach((value, i) => {
      coordinates = value.coords;
      newMarker = new GeoJson(coordinates, { message: value.desc });
      set.add(value.desc);
    });
  }

  animateCount() {
    let _this = this;

    let single = this.oneItem.nativeElement.innerHTML;

    this.counterFunc(single, this.oneItem, 7000);

    this.count.forEach((item) => {
      _this.counterFunc(item.nativeElement.innerHTML, item, 2000);
    });
  }

  counterFunc(end: number, element: any, duration: number) {
    let range, current: number, step, timer;

    range = end - 0;
    current = 0;
    step = Math.abs(Math.floor(duration / range));

    timer = setInterval(() => {
      current += 1;
      element.nativeElement.textContent = current;
      if (current == end) {
        clearInterval(timer);
      }
    }, step);
  }

  ngAfterViewInit(): void {
    this.burgermenu1 = Array.from(
      document.getElementsByClassName(
        'burgermenu1'
      ) as HTMLCollectionOf<HTMLElement>
    );
    this.burgermenu2 = Array.from(
      document.getElementsByClassName(
        'burgermenu2'
      ) as HTMLCollectionOf<HTMLElement>
    );
    this.burgermenu3 = Array.from(
      document.getElementsByClassName(
        'burgermenu3'
      ) as HTMLCollectionOf<HTMLElement>
    );

    this.subscription.add(
      this.sidenav.openedChange.subscribe(() => {
        (this.burgertime = !this.burgertime),
          !this.burgertime
            ? ((this.burgermenu2[0].style.transform = 'translateX(-100px)'),
              (this.burgermenu3[0].style.transform = 'translateX(-100px)'),
              (this.burgermenu1[0].style.zIndex = '100'))
            : ((this.burgermenu2[0].style.transform = 'translateX(0px)'),
              (this.burgermenu3[0].style.transform = 'translateX(0px)'),
              (this.burgermenu1[0].style.zIndex = '2'));
      })
    );

    this.subscription.add(
      this.sidenav1.openedChange.subscribe(() => {
        (this.burgertime2 = !this.burgertime2),
          !this.burgertime2
            ? ((this.burgermenu1[0].style.transform = 'translateX(-100px)'),
              (this.burgermenu3[0].style.transform = 'translateX(-100px)'),
              (this.burgermenu2[0].style.zIndex = '100'))
            : ((this.burgermenu1[0].style.transform = 'translateX(0px)'),
              (this.burgermenu3[0].style.transform = 'translateX(0px)'),
              (this.burgermenu2[0].style.zIndex = '2'));
      })
    );

    this.subscription.add(
      this.sidenav2.openedChange.subscribe(() => {
        (this.burgertime3 = !this.burgertime3),
          !this.burgertime3
            ? ((this.burgermenu1[0].style.transform = 'translateX(-100px)'),
              (this.burgermenu2[0].style.transform = 'translateX(-100px)'),
              (this.burgermenu3[0].style.zIndex = '100'))
            : ((this.burgermenu1[0].style.transform = 'translateX(0px)'),
              (this.burgermenu2[0].style.transform = 'translateX(0px)'),
              (this.burgermenu3[0].style.zIndex = '2'));
      })
    );

    var stuff1 = Array.from(
      document.getElementsByClassName(
        'mapboxgl-ctrl-attrib'
      ) as HTMLCollectionOf<HTMLElement>
    );
    var stuff2 = Array.from(
      document.getElementsByClassName(
        'mapboxgl-ctrl-bottom-left'
      ) as HTMLCollectionOf<HTMLElement>
    );
    var stuff3 = Array.from(
      document.getElementsByClassName(
        'mapboxgl-ctrl-top-right'
      ) as HTMLCollectionOf<HTMLElement>
    );
    var stuff4 = Array.from(
      document.getElementsByClassName(
        'mat-drawer-inner-container'
      ) as HTMLCollectionOf<HTMLElement>
    );
    var stuff5 = Array.from(
      document.getElementsByClassName(
        'mapboxgl-ctrl-directions mapboxgl-ctrl'
      ) as HTMLCollectionOf<HTMLElement>
    );

    stuff5.forEach((elem) => {
      elem.style.visibility = 'hidden';
      elem.style.transform = 'translateX(400px);';
      elem.style.transition = 'all 0.5s ease-in-out;';
    });

    stuff1[0].style.visibility = 'hidden';
    stuff2[0].style.visibility = 'hidden';
    stuff4.forEach((element) => {
      element.style.overflow = 'visible';
    });
    stuff3[0].style.zIndex = '999';
    stuff3[0].style.transform = 'scale(1.5) translate(-10px, 40px)';

    this.animateCount();

    this.directions;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initializeMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat],
        });
      });
    }

    this.currentPosition = [this.lng, this.lat];

    this.buildMap();
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 16,
      maxZoom: 19,
      minZoom: 13,
      minPitch: 0,
      maxPitch: 67,
      center: [this.lng, this.lat],
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('click', (event) => {
      if (!this.paintingOn) {
        const coordinates = [event.lngLat.lng, event.lngLat.lat];
        const newMarker = new GeoJson(coordinates, { message: this.message });

        var bboxClick = [
          [event.lngLat.lng - 0.0005, event.lngLat.lat - 0.0005],
          [event.lngLat.lng + 0.0005, event.lngLat.lat + 0.0005],
        ];

        var bboxCoord1: Coordinate = {
          lon: bboxClick[0][0],
          lat: bboxClick[0][1],
        };

        var bboxCoord2: Coordinate = {
          lon: bboxClick[1][0],
          lat: bboxClick[1][1],
        };

        var countInside: number = 0;
        var markerIndex: Set<any> = new Set();

        this.offlineMarkerData.forEach((element) => {
          var elementCoords: Coordinate = {
            lon: element.geometry.coordinates[0],
            lat: element.geometry.coordinates[1],
          };

          if (this.inBoundingBox(bboxCoord1, bboxCoord2, elementCoords)) {
            markerIndex.add(countInside);
          }
          countInside++;
        });

        const name = '';
        const innerHtmlContent = `<div style="font-size: large;color : black;background: rgba(#2EC4B6, 0.75);
      border-top: 5px solid rgba(#2EC4B6,0.75)">
                  <h4 class="h4Class">${name} </h4> </div>`;

        const divElement = document.createElement('div');
        const routeBtn = document.createElement('div');
        const markerNewBtn = document.createElement('div');
        const assignBtn = document.createElement('div');
        const addToWaypoints = document.createElement('div');
        var coords: any;

        addToWaypoints.innerHTML = `<button class="btn btn-success btn-simple text-white" style="border-radius:40px;animation: come-up 0.5s ease forwards;" >Add a Waypoint</button>`;
        routeBtn.innerHTML = `<button class="btn btn-success btn-simple text-white" style="border-radius:40px;animation: come-up 0.5s ease forwards;" >Get Route</button>`;
        markerNewBtn.innerHTML = `<button class="btn btn-success btn-simple text-white" style="border-radius:40px;animation: come-up 0.5s ease forwards;" >New Marker</button>`;

        if (Array.from(markerIndex)[0]) {
          var nearestPointIndex = this.getNearestPoint(
            Array.from(markerIndex),
            coordinates
          );
          coords =
            this.offlineMarkerData[nearestPointIndex].geometry.coordinates;
          assignBtn.innerHTML = `<button class="btn btn-primary" (click)="flyToCoords(coords)">${
            this.offlineMarkerData[Array.from(markerIndex)[0]].properties
              .message
          } : ${nearestPointIndex}</button>`;

          if (this.flyToBinChecked) {
            this.flyToCoords(coords);
          }
        } /*else {this.clicked = !this.clicked}*/

        divElement.innerHTML = innerHtmlContent;
        divElement.setAttribute(
          'style',
          'row-gap:10px;column-gap:10px;display:flex;flex-direction:row;flex-wrap:nowrap;align-content:space-around;justify-content:space-between;animation:up-n-down 3s ease-in-out infinite; '
        );
        divElement.appendChild(routeBtn);
        divElement.appendChild(addToWaypoints);
        divElement.appendChild(assignBtn);

        const popUps = document.getElementsByClassName('mapboxgl-popup');
        console.table(popUps);
        /** Check if there is already a popup on the map and if so, remove it */
        if (popUps[0]) popUps[0].remove();

        var popup;

        popup = new mapboxgl.Popup({ className: 'popup-custom-content' })
          .setLngLat(
            this.flyToBinChecked
              ? this.clickedBinCoords(markerIndex, coords, coordinates)
              : coordinates
          )

          .addTo(this.map)
          .setDOMContent(divElement)
          .addTo(this.map);

        const popupContent = document
          .getElementsByClassName('mapboxgl-popup-content')
          .item(0)!
          .setAttribute(
            'style',
            'background: rgba(76, 228, 119, 0.0) !important;box-shadow: 2px 4px 2px rgba(0, 0, 0, 0) !important;'
          );

        this.clicked = true;

        if (!Array.from(markerIndex)[0]) {
          divElement.appendChild(markerNewBtn);

          markerNewBtn.addEventListener('click', (e) => {
            this.mapService.createMarker(newMarker);
            popup.remove();
            this.clicked = false;
          });
        }

        addToWaypoints.addEventListener('click', (e) => {
          this.waypoints.push(coordinates.toString());

          popup.remove();
          this.clicked = false;
        });

        routeBtn.addEventListener('click', (e) => {
          this.getRoute(coordinates);
          popup.remove();
          this.clicked = false;
        });

        assignBtn.addEventListener('click', (e) => {
          this.flyToCoords(coords);
          popup.remove();
          this.clicked = false;
        });

        var closebtn = document.getElementsByClassName(
          'mapboxgl-popup-close-button'
        );
        closebtn[0].setAttribute(
          'style',
          'transform:scale(3)translate(0%,-47px);left:50%;position:relative;'
        );
        closebtn[0].addEventListener('click', (e) => {
          this.clicked = false;
        });
      } else {
        const coordinates = [event.lngLat.lng, event.lngLat.lat];
        this.paintCoords.push(coordinates);

        this.geojsonPaint.features[0].geometry.coordinates.push(coordinates);
      }
    });

    this.map.on('foo', (event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat];
      this.paintCoords.push(coordinates);

      this.geojsonPaint.features[0].geometry.coordinates.push(coordinates);
    });

    this.map.on('load', (event) => {
      this.map.touchZoomRotate.enable();
      this.map.dragPan.enable();
      this.map.keyboard.enable();

      var noLocalData: boolean = localStorage.getItem('markers') == null;

      if (noLocalData) {
        this.markers = this.mapService.getMarkers();

        console.log('did fetch markers from online');
      } else {
        this.markers = null;
        this.offlineMarkerData = JSON.parse(localStorage.getItem('markers'));
        this.offlineData = new FeatureCollection(this.offlineMarkerData);

        console.log('markers from offline');
      }

      this.map.addSource('firebase', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      this.source = this.map.getSource('firebase');

      if (noLocalData) {
        this.markers.valueChanges().subscribe((markers) => {
          var valueChanged: boolean = false;

          let data = new FeatureCollection(markers);

          this.source.setData(data);

          markers.forEach((value) => {
            !this.markersToDisplay.has(value)
              ? (this.markersToDisplay.add(value), (valueChanged = true))
              : console.log('object already exists');
          });
          localStorage.setItem('markers', JSON.stringify(markers));
          valueChanged
            ? (localStorage.removeItem('markers'),
              localStorage.setItem('markers', JSON.stringify(markers)))
            : console.log('values didnt change');
        });
      }

      if (!noLocalData) {
        this.source.setData(this.offlineData);

        this.offlineMarkerData.forEach((value) => {
          !this.markersToDisplay.has(value)
            ? this.markersToDisplay.add(value)
            : console.log('object already exists');
        });
      }

      this.map.addLayer({
        id: 'firebase',
        source: 'firebase',
        type: 'symbol',
        layout: {
          'text-field': '{message}',
          'text-size': 24,
          'text-transform': 'uppercase',
          'icon-image': 'bin',
          'text-offset': [0, 1.5],
        },
        paint: {
          'text-color': '#f16624',
          'text-halo-color': '#fff',
          'text-halo-width': 2,
        },
      });

      var start = [this.lng, this.lat];

      this.map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: start,
                },
              },
            ],
          },
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#3887be',
          'circle-stroke-color': 'black',
          'circle-stroke-width': 1,
        },
      });
    });
  }

  emptyGeoJSONLine() {
    this.geojsonPaint = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
          properties: {},
        },
      ],
    };

    if (this.map.getLayer('route')) {
      this.map.removeLayer('route');
    }
    if (this.map.getSource('route')) {
      this.map.removeSource('route');
    }
  }

  createGeoJSONLine(coords?: any) {
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }

    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: this.geojsonPaint.features[0].geometry.coordinates,
          },
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#ffc107',
        'line-width': 5,
        'line-opacity': 0.75,
      },
    });
  }

  removeMarker(marker) {
    this.mapService.removeMarker(marker.$key);
  }

  flyTo(data: GeoJson) {
    this.cameraRotate = !this.cameraRotate;
    this.map.flyTo({
      center: data.geometry.coordinates as mapboxgl.LngLatLike,
      zoom: 17,
    });
  }

  flyToCoords(coords: any[]) {
    this.cameraRotate = !this.cameraRotate;
    this.map.flyTo({
      center: coords as mapboxgl.LngLatLike,
      zoom: 17,
    });
  }

  flyToCurrentRoskis() {
    this.cameraRotate = !this.cameraRotate;
    this.map.flyTo({
      center: this.currentRoskis,
      zoom: 17,
    });
  }

  flyToUserService(rep) {
    this.flyToCoords([rep.coords.longitude, rep.coords.latitude]);
  }

  waitForOneSecond(distance: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('I promise to return after one second!');
      }, 10);
    });
  }

  rotateUser() {
    this.map.rotateTo(0, { duration: 500 });
  }

  flyToBinToggle() {
    this.flyToBinChecked = !this.flyToBinChecked;
  }

  hideDistanceToggle() {
    this.hideDistance = !this.hideDistance;
  }

  getToWaypoint(i: number) {
    var waypointArray: string[] = this.waypoints[i].split(',');

    var waypointNumber = [
      Number.parseFloat(waypointArray[0]),
      Number.parseFloat(waypointArray[1]),
    ];
    this.flyToCoords(waypointNumber);
  }

  deleteWaypoint(i: number) {
    this.waypoints.splice(i, 1);
  }

  addWaypoint(i: number) {
    var waypointArray: string[] = this.waypoints[i].split(',');

    var waypointNumber = [
      Number.parseFloat(waypointArray[0]),
      Number.parseFloat(waypointArray[1]),
    ];
    this.directions.addWaypoint(1, waypointNumber);
  }

  getDirectionsWaypoints() {
    console.table(this.directions.getWaypoints());
  }

  confirmTimeout() {
    if (this.map.isMoving()) {
      this.waitForOneSecond(100).then(() => {
        this.confirmTimeout();
      });
    } else {
      this.rotateUser();
      this.backToUser = true;
      Swal.clickConfirm();
    }
  }

  applyWaypoints() {
    this.directionsWithWaypoints();
    console.log('Route with waypoints queried');
  }

  directionsWithWaypoints() {
    this.destination = 'Destination';

    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });

    var start = [this.lng, this.lat];

    var endString: string[] =
      this.waypoints[this.waypoints.length - 1].split(',');

    var end = [
      Number.parseFloat(endString[0]),
      Number.parseFloat(endString[1]),
    ];

    var waypointsToUrl: string = '';

    if (this.waypoints.length > 0) {
      this.waypoints.forEach((value, index) => {
        waypointsToUrl += value + ';';
      });

      this.currentPosition = start;

      var url =
        'https://api.mapbox.com/directions/v5/mapbox/walking/' +
        start[0] +
        ',' +
        start[1] +
        ';' +
        waypointsToUrl +
        end[0] +
        ',' +
        end[1] +
        '?steps=true&geometries=geojson&access_token=' +
        environment.mapbox.accessToken;

      var req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.onload = () => {
        this.routeFunction(req);
      };
      req.send();

      this.latestReq = req;
    } else {
      this.routeFunction(this.latestReq);
    }
    this.currentDestination = end;
  }

  flyToUser() {
    this.backToUser = false;

    this.loadingTimed();

    this.waitForOneSecond(100)
      .then(() => {
        this.map.flyTo({
          center: [this.lng, this.lat],
          zoom: 17,
        });
      })
      .finally(() => {
        this.confirmTimeout();
      });

    this.cameraRotate = false;

    var start: any[] = [];
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        start = [this.lng, this.lat];

        this.map.removeLayer('point');
        this.map.removeSource('point');

        this.map.addLayer({
          id: 'point',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: start,
                  },
                },
              ],
            },
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#3887be',
            'circle-stroke-color': 'black',
            'circle-stroke-width': 1,
          },
        });
      });
    }
  }

  getRoute(end: any) {
    this.currentRoskis = end;

    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });

    var start = [this.lng, this.lat];

    if (!(this.currentPosition == start && this.currentDestination == end)) {
      this.currentPosition = start;

      var url =
        'https://api.mapbox.com/directions/v5/mapbox/walking/' +
        start[0] +
        ',' +
        start[1] +
        ';' +
        end[0] +
        ',' +
        end[1] +
        '?steps=true&geometries=geojson&access_token=' +
        environment.mapbox.accessToken;

      var req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.onload = () => {
        this.routeFunction(req);
      };
      req.send();

      this.latestReq = req;
    } else {
      this.routeFunction(this.latestReq);
    }
    this.currentDestination = end;
    this.destination = 'Roskis';
  }

  routeFunction(req) {
    var json = JSON.parse(req.response);

    if (!this.routeDataSet.has(json.routes[0])) {
      this.routeData.push(json.routes[0]);
      localStorage.setItem('routeData', JSON.stringify(this.routeData));
    }

    this.routeActivated = true;

    var data = json.routes[0];

    this.distance = Math.ceil(Math.round(data.distance) / 5) * 5;

    this.distanceToRoskis = this.distance.toString();

    if (this.distance > 2500) {
      this.distanceToRoskis = (data.distance / 1000).toFixed(2);
    }

    this.digit = Math.round(Number.parseInt(this.distanceToRoskis));

    var route = data.geometry.coordinates;

    const geojsonFeature = {
      type: 'Feature' as const,
      properties: {
        name: 'route',
        amenity: 'Custom Route',
        popupContent: 'Route',
      },
      geometry: {
        type: 'LineString' as const,
        coordinates: route,
      },
    };

    if (this.map.getSource('route')) {
      const source: mapboxgl.GeoJSONSource = this.map.getSource(
        'route'
      ) as mapboxgl.GeoJSONSource;
      source.setData(geojsonFeature);
    } else {
      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route,
            },
          },
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#ffc107',
          'line-width': 5,
          'line-opacity': 0.75,
        },
      });
    }
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  getDistance(pair1, pair2) {
    const [lat1, lon1] = pair1,
      [lat2, lon2] = pair2;
    const R = 6371;

    var dLat = this.deg2rad(lat2 - lat1);
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  getDistanceOfCoordsArray(coords: any[]) {
    const data = coords;

    var lenght: number = 0;

    // console.log(data);
    var init: any;
    var pair2: any;
    data.forEach((element, i) => {
      pair2 = [element[0], element[1]];

      if (!init) {
        init = pair2;
      }

      lenght += this.getDistance(init, pair2);
      init = pair2;
    });

    // console.log(length);

    this.distance = Math.ceil(Math.round(lenght) / 5) * 5;

    this.distanceToRoskis = this.distance.toString();

    if (this.distance > 2500) {
      this.distanceToRoskis = (lenght / 1000).toFixed(2);
    }

    this.digit = Math.round(Number.parseInt(this.distanceToRoskis));
  }

  getNearestPoint(fromCoordindexes: any[], pointCoordinates: any[]): number {
    var arrayOfMatches = [];
    var routeLengths: any[] = [[], []];
    var arrayOfMarkers = Array.from(this.markersToDisplay);

    fromCoordindexes.forEach((element) => {
      arrayOfMatches.push(arrayOfMarkers[element]);
      routeLengths[0].push(element);
    });

    for (let value of arrayOfMatches) {
      const R = 6371e3;
      const φ1 = (pointCoordinates[0] * Math.PI) / 180;
      const φ2 = (value.geometry.coordinates[0] * Math.PI) / 180;
      const Δφ =
        ((value.geometry.coordinates[0] - pointCoordinates[0]) * Math.PI) / 180;
      const Δλ =
        ((value.geometry.coordinates[1] - pointCoordinates[1]) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const d = R * c;

      routeLengths[1].push(d);
    }

    var arrayOfLenghts = routeLengths;

    var shortest = Math.min(...routeLengths[1]);
    var indexOfShortest = arrayOfLenghts[1].findIndex((x) => x == shortest);

    return arrayOfLenghts[0][indexOfShortest];
  }

  getNearestRoskis() {
    var routeLengths: any[] = [];
    var arrayOfMarkers = Array.from(this.markersToDisplay);

    for (let [index, value] of arrayOfMarkers.entries()) {
      const R = 6371e3;
      const φ1 = (this.lat * Math.PI) / 180;
      const φ2 = (value.geometry.coordinates[1] * Math.PI) / 180;
      const Δφ = ((value.geometry.coordinates[1] - this.lat) * Math.PI) / 180;
      const Δλ = ((value.geometry.coordinates[0] - this.lng) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const d = R * c;

      routeLengths.push(d);
    }

    var arrayOfLenghts = routeLengths;
    var markersOfLenghts = Array.from(this.markersToDisplay);
    var shortest = Math.min(...Array.from(routeLengths));

    this.getRoute(
      markersOfLenghts[arrayOfLenghts.findIndex((x) => x == shortest)].geometry
        .coordinates
    );
  }

  cameraMovement() {
    this.cameraRotate = !this.cameraRotate;

    if (this.cameraRotate) this.rotateCamera(this.map.getBearing() * 100);
  }

  rotateCamera = (bearing) => {
    if (this.cameraRotate) {
      requestAnimationFrame(this.rotateCamera);

      this.map.rotateTo((bearing / 100) % 360, { duration: 0 });
    }
  };

  inBoundingBox(
    bl: /*bottom left*/ Coordinate,
    tr: /*top right*/ Coordinate,
    p: Coordinate
  ): Boolean {
    var isLongInRange =
      tr.lon < bl.lon
        ? p.lon >= bl.lon || p.lon <= tr.lon
        : p.lon >= bl.lon && p.lon <= tr.lon;

    return p.lat >= bl.lat && p.lat <= tr.lat && isLongInRange;
  }

  clickedBinCoords(markerIndex: any, coords: any, coordinates: any) {
    if (Array.from(markerIndex)[0]) {
      return coords;
    } else {
      return coordinates;
    }
  }
}
