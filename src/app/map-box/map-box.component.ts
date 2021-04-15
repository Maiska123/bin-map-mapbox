import { Coordinate } from './../utils/interfaces';

import { MapService } from './../map.service';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { GeoJson, FeatureCollection } from '../map';
import { Observable, pipe } from 'rxjs'
import { environment } from '../../environments/environment';
import {OverlayModule} from '@angular/cdk/overlay';
import { AngularFireList } from '@angular/fire/database';
import { Coordinate } from "../utils/interfaces";
//import * as proj4 from "proj4";

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})

export class MapBoxComponent implements OnInit{

  /// default settings



  public map: mapboxgl.Map;

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

  offlineData: FeatureCollection;
  offlineMarkerData: any[] = [];

  distanceToRoskis: number;
  userLocations: any;
  routeData: any[] = [];
  routeDataSet: Set<any> = new Set();
  currentRoskis: any;
  //that = this.map;

  activity: any;
  activityName: string;
  activityComments: string;
  activityDate: Date;
  activityDistance: number;
  gpx: any;


  // data
  source: any;
  markers: AngularFireList<any>;
  markersToDisplay: Set<any> = new Set();

  // const overlayRef = overlay.create();
  // const userProfilePortal = new ComponentPortal(UserProfile);
  // overlayRef.attach(userProfilePortal);

  isOpen = true;


  roskisUrl = 'https://geodata.tampere.fi/geoserver/maankaytto/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=maankaytto:WFS_ROSKIS&outputFormat=json'

  // Tampereen kaupungin alueella olevat roskakorit. Ominaisuustietona löytyy esimerkiksi tarkenne, jossa kuvattu roskakorin malli ja tyhjennysväli. Aineisto ei ole kaikilta osin täysin kattavaa. Päivittäminen tapahtuu kausittain eivätkä kaikki kohteet ole sen vuoksi välttämättä ajan tasalla. Muutokset vuosittain ovat kuitenkin suhteellisen pieniä.

  // Ominaisuustiedot:

  // ROSKIS_ID: Roskakorin tunniste esim. "441040"
  // TYYPPI_KOODI: Roskakorin tyyppikoodi esim. "4"
  // TYYPPI: Tyyppikoodin selkokielinen nimi esim. "ROSKA-ASTIA"
  // TARKENNE_KOODI: Roskakorin tarkennekoodi esim. "08"
  // TARKENNE: Roskakorin tarkennekoodin selkokielinen nimi esim. "SYVÄKERÄYSASTIA" tai "ROSKIS KOIRAJÄTEPUSSI AUTOMAATTI"
  // Aineiston geometriatyyppinä piste. Data on saatavissa rasterikuvina WMS- rajapintapalvelun kautta sekä raakadatana WFS-rajapintapalvelun avulla. WMS- ja WFS- palveluiden kautta dataa voi pyytää useammissa eri formaatissa. WFS-palvelun kautta aineistoa voidaan kutsua useissa eri formaateissa osoitteen outputFormat-parametrilla. Vaihtoehtoina ovat muun muassa: JSON, GML2, GML32, SHAPE-ZIP, CSV.
  // Aineiston natiivi koordinaattijärjestelmä on ETRS-GK24 (EPSG:3878).

  // 24488332.847 23.780908282
  // 6821391.3616 61.50144998

  // EPSG:3878
  // ETRS89 / GK24FIN

  // Taustajärjestelmänä toimii GeoServer, jonka WFS/WMS -rajapintojen ominaisuuksista on olemassa tarkempi englanninkielinen dokumentaatio.

  // Geoserverin käyttöön löytyy myös pikaohje dataportaalin ohjeet -osiosta.

  // Sama sisältö on katseltavissa kartat.tampere.fi -palvelun tai kansallisen paikkatietoikkunan kautta.


  constructor(private mapService: MapService) {
  //   mapService.itemValue.subscribe((nextValue) => {
  //     alert(nextValue);  // this will happen on every change
  //     this.markers = this.mapService.getMarkers();
  //  })

  // proj4.defs("SR-ORG:7787", "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=24500000 +y_0=0 +ellps=GRS80 +towgs84=0.0,0.0,0.0,0.0,0.0,0.0,0.0 +units=m +no_defs");
  // proj4.defs("SR-ORG:6864", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
  }

  // universal style getJson
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
    // Get markers from mapService

    this.mapService.getLocation().subscribe(rep => {
      // do something with Rep, Rep will have the data you desire.
      this.flyToUserService(rep);
   });

    this.initializeMap()

    // to get data from URL as JSON
//     this.getJSON(this.roskisUrl,
//     (err, data) => {
//       if (err !== null) {
//         console.log('Something went wrong: ' + err);
//       } else {
//         console.log(data);
//         console.log('raw data: ' + data.features[0].geometry.coordinates);
//         console.log('raw data: ' + data.features[0].properties.TARKENNE);

//                   //Initialization of object to save
//           var objectToSave= data.features ;//{first:'string', second: function(){}};
//           //Start of saving method
//           var textToSave='';//String to be saved
//           var count=0;
//           var tempData = {
//             id: 0,
//             coords: [],
//             desc: ''
//           };
//           var kuvaus: string;
//           for(var i in objectToSave){
//             var tempData = {
//               id: 0,
//               coords: [],
//               desc: ''
//             };
//            kuvaus = data.features[count].properties.TARKENNE != null ? data.features[count].properties.TARKENNE : data.features[count].properties.TYYPPI;



//             //for ( var index in data ) {
//               //if ( data[index].Status == "Valid" ) {
//                 tempData.coords = data.features[count].geometry.coordinates;
//                 tempData.desc = kuvaus;
//                 tempData.id = count;
//                 this.roskisData.push(tempData);

//               //}
//             //}
//             //data = tempData;
//           //Adding every key name + type + text value to string

//           textToSave+=data.features[count].geometry.coordinates + '\n';//objectToSave[i].constructor.name+' '+ Object.keys(objectToSave)[count]+' = '+objectToSave[i]+'\n';

//           //textToSave+=objectToSave[i].constructor.name+' '+ Object.keys(objectToSave)[count]+' = '+objectToSave[i]+'\n';
//           count++;
//           }

//           //Saving string to file using html clicking trick
//           var hiddenElement = document.createElement('a');
//           hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
//           hiddenElement.target = '_blank';
//           hiddenElement.download = 'myFile.txt';
//          // hiddenElement.click();
//          //console.log(this.roskisData);
//          //console.log(tempData);


//   //         fetch('http://localhost/coords.txt')
//   // .then(response => response.text())
//   // .then((data) => {
//   //   console.log(data)
//   // })

// //   document.getElementById('inputfile')
// //   .addEventListener('change', function() {
// //     let files;
// //   var fr=new FileReader();
// //   fr.onload=()=>{
// //     console.log(fr.result);
// //   }

// //   //fr.readAsText(this.files[0]);
// // })

//   let input = document.querySelector('input')

//   let textarea = document.querySelector('textarea')

//   // This event listener has been implemented to identify a
//   // Change in the input section of the html code
//   // It will be triggered when a file is chosen.
//   input.addEventListener('change', () => {



//     let reader = new FileReader();


//       let files = input.files;
//       console.log(files);
//       console.log(files[0]);
//  const file = files[0];
//       //if (files.length == 0) return;

//       /* If any further modifications have to be made on the
//          Extracted text. The text can be accessed using the
//          file variable. But since this is const, it is a read
//          only variable, hence immutable. To make any changes,
//          changing const to var, here and In the reader.onload
//          function would be advisible */
//          reader.readAsText(file);
//          var roskisdatat: any[] = [];

//       reader.onload = (e) => {
//           const file = e.target.result;

//           // This is a regular expression to identify carriage
//           // Returns and line breaks
//           //console.log(file);

//           //const lines = file.split(/\r\n|\n/);
//           var coords: String = '';
//           coords += file.toString();
//           //console.log(coords)

//           textarea.value = file.toString();//lines.join('\n');

//           let coordints = coords.split('\n');
//          // this.roskisCoordData.push('[')

//           for (i in coordints) {
//            //if (i == '\n') this.roskisCoordData.push(']');
//            this.roskisCoordData.push(coordints[i])
//           }
//           //this.roskisCoordData.push('['+coords.slice('\n')+']') ;

//           console.log(this.roskisCoordData);
//         };
//       //reader.onerror = (e) => alert(e.target.error.name);

//   });
//         // console.log('proj4: ' + proj4("SR-ORG:7787","SR-ORG:6864",data.features[0].geometry.coordinates));
//       }
//     });

  }

  makeObject(){

    console.log(this.roskisCoordData);
    let splitted: any[];

    this.roskisData.forEach( (value,i) => {
      splitted = this.roskisCoordData[i].split(',')
      value.coords = [Number(splitted[1]),Number(splitted[0])];
      }
    )
    console.log(this.roskisData);

  }

  sendToSpace(){
    let set: Set<any> = new Set();
    //vanhat
    var coordinates = [this.lng, this.lat]
    var newMarker   = new GeoJson(coordinates, { message: this.message })
    // uudet

    this.roskisData.forEach((value,i) => {
      coordinates = value.coords;
      newMarker = new GeoJson(coordinates, { message: value.desc })
      set.add(value.desc)
      //this.mapService.createMarker(newMarker);  //<--- lähettää databaseen!
      // ÄLÄ LÄHETÄ ISOA MÄÄRÄÄ ENNENKU ESTÄT DATABASE CHANGE SUBSCRIBEN!
      // tekee jokasesta insertistä callbäkin koska data muuttunut

    });
    console.log(set);
  }

  ngAfterViewInit(): void {


    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // find these and hide
// class="mapboxgl-ctrl mapboxgl-ctrl-attrib"
// class="mapboxgl-ctrl-bottom-left"
    var stuff1 = Array.from(document.getElementsByClassName('mapboxgl-ctrl-bottom-right') as HTMLCollectionOf<HTMLElement>);
    var stuff2 = Array.from(document.getElementsByClassName('mapboxgl-ctrl-bottom-left') as HTMLCollectionOf<HTMLElement>);


    stuff1[0].style.visibility = "hidden";
    stuff2[0].style.visibility = "hidden";

    // this.rotateCamera(0);
  }


  private initializeMap() {
    /// locate the user
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        })
      });
    }

    this.currentPosition = [this.lng, this.lat];

    this.buildMap()

  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 16,
      maxZoom: 19,
      minZoom: 10,
      minPitch: 0,
      maxPitch: 67,
      center: [this.lng, this.lat]
    });


    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());


    //// Add Marker on Click -- ONCLICK ADD MARKER
    // this.map.on('click', (event) => {
    //   const coordinates = [event.lngLat.lng, event.lngLat.lat]
    //   const newMarker   = new GeoJson(coordinates, { message: this.message })
    //   console.log(newMarker)
    //   this.mapService.createMarker(newMarker)
    // })

    //// Add Marker on Click -- ONCLICK GET ROUTE
    this.map.on('click', (event) => {


        // var features = this.map.queryRenderedFeatures(bbox, {
        // layers: ['counties']
        // });

        // Run through the selected features and set a filter
        // to match features with unique FIPS codes to activate
        // the `counties-highlighted` layer.
        // var filter = features.reduce(
        //   function (memo, feature) {
        //   memo.push(feature.properties.FIPS);
        //   return memo;
        //   },
        //   ['in', 'FIPS']
        // );

        //map.setFilter('counties-highlighted', filter);




      const coordinates = [event.lngLat.lng, event.lngLat.lat]
      const newMarker   = new GeoJson(coordinates, { message: this.message })
      //console.log(newMarker)

      // set bbox as 5px reactangle area around clicked point
      var bbox = [
        // [event.point.x - 5, event.point.y - 5],
        // [event.point.x + 5, event.point.y + 5]
        [event.lngLat.lng - 0.0005, event.lngLat.lat - 0.0005],
        [event.lngLat.lng + 0.0005, event.lngLat.lat + 0.0005]
        ];

      //console.log(bbox);

      var bboxCoord1: Coordinate = {
        lon: bbox[0][0],
        lat: bbox[0][1]
      }

      var bboxCoord2: Coordinate = {
        lon: bbox[1][0],
        lat: bbox[1][1]
      }


      // 0: (2) [23.84848426640055, 61.44414624556565]
      // 1: (2) [23.849484266400548, 61.44514624556565]
      var countInside: number = 0;
      var markerIndex: Set<any> = new Set();

      this.offlineMarkerData.forEach(element => {

        var elementCoords: Coordinate = {
          lon: element.geometry.coordinates[0],
          lat: element.geometry.coordinates[1]
        }

       if (this.inBoundingBox(bboxCoord1,bboxCoord2,elementCoords)) {
         console.log(element);
         console.log('true: ' + countInside);
         markerIndex.add(countInside);
       };
       countInside++;
      //  console.log(element.geometry.coordinates);
        // 0: 23.76598724
        // 1: 61.50039711
      });


      //var description = "<button class='btn btn-dark' onclick='+${this.getRoute(coordinates)}+'>Button</button>"

      const name = '';
      const innerHtmlContent = `<div style="font-size: large;color : black;background: rgba(#2EC4B6, 0.75);
      border-top: 5px solid rgba(#2EC4B6,0.75)">
                  <h4 class="h4Class">${name} </h4> </div>`;

      const divElement = document.createElement('div');
      const routeBtn = document.createElement('div');
      const markerNewBtn = document.createElement('div');
      const assignBtn = document.createElement('div');
      var coords: any;

      routeBtn.innerHTML = `<button class="btn btn-success btn-simple text-white" >Get Route</button>`;
      markerNewBtn.innerHTML = `<button class="btn btn-success btn-simple text-white" >New Marker</button>`;

      if (Array.from(markerIndex)[0]) {
        var nearestPointIndex = this.getNearestPoint(Array.from(markerIndex),coordinates);
        coords = this.offlineMarkerData[nearestPointIndex].geometry.coordinates;
      assignBtn.innerHTML = `<button class="btn btn-primary" (click)="flyToCoords(coords)">${ this.offlineMarkerData[Array.from(markerIndex)[0]].properties.message } : ${nearestPointIndex}</button>`;
      this.flyToCoords(coords);
      }

      // markerIndex.forEach(index => {
      //   console.log(index);

      //   // jokaista napinpainalluksen alueelle sisältyvää kohden fly to nappi
      //   coords = this.offlineMarkerData[index].geometry.coordinates;

      //   console.log(coords);
      //   this.messageInBubble = this.offlineMarkerData[index].properties.message;
      //   //assignBtn.innerHTML = `<button class="btn btn-primary" (click)="flyTo(coords)">noh</button>`;
      //   assignBtn.innerHTML = `<button class="btn btn-primary" (click)="flyToCoords(coords)">${ this.messageInBubble }</button>`;
      //   // assignBtn.innerHTML = `<button class="btn btn-success btn-simple text-white" >Do Something</button>`;
      //   divElement.appendChild(assignBtn);
      //   console.log(assignBtn);

      // });

      divElement.innerHTML = innerHtmlContent;
      divElement.appendChild(routeBtn);

      divElement.appendChild(assignBtn);

      // btn.className = 'btn';


      // const popup = new mapboxgl.Popup({
      //     offset: 25
      //   })
      //   .setDOMContent(divElement);



      var popup = new mapboxgl.Popup()
        .setLngLat(this.clickedBinCoords(markerIndex, coords, coordinates)) // eslint-disable-line no-use-before-define
        //.setHTML(description)
        .addTo(this.map)
        .setDOMContent(divElement);

        //console.log(description);
        //console.log();

        if (!Array.from(markerIndex)[0]) {

          divElement.appendChild(markerNewBtn);

          markerNewBtn.addEventListener('click', (e) => {
            console.log('Button clicked' + name);
            this.mapService.createMarker(newMarker)
            popup.remove();
          });
        }

      routeBtn.addEventListener('click', (e) => {
        // console.log('Button clicked' + name);
        this.getRoute(coordinates);
        popup.remove();
      });

      assignBtn.addEventListener('click', (e) => {
        // console.log('Button clicked' + name);
        this.flyToCoords(coords);
        popup.remove();
      });


      //this.getRoute(coordinates);// mapService.createMarker(newMarker)
    })


    /// Add realtime firebase data on map load
    this.map.on('load', (event) => {



      this.map.touchZoomRotate.enable();
      this.map.dragPan.enable({
        linearity: 0.3, // eslint-disable-line no-use-before-define
        // easing: bezier(0, 0, 0.3, 1), // eslint-disable-line no-use-before-define
        maxSpeed: 2000, // eslint-disable-line no-use-before-define
        deceleration: 1500, // eslint-disable-line no-use-before-define
        }); // eslint-disable-line no-use-before-define
        this.map.keyboard.enable();

        var noLocalData:boolean = localStorage.getItem('markers') == null;
        // console.log(noLocalData);

        if (noLocalData){
          this.markers = this.mapService.getMarkers()

          //localStorage.setItem("markers", JSON.stringify(this.markers));
          console.log('did fetch markers from online');
        } else {
          this.markers = null;
          this.offlineMarkerData = JSON.parse(localStorage.getItem('markers'));
          this.offlineData = new FeatureCollection(this.offlineMarkerData);

          //this.source.setData(offlineData)
          console.log('markers from offline');
        }

      /// register source
      this.map.addSource('firebase', {
         type: 'geojson',
         data: {
           type: 'FeatureCollection',
           features: []
         }
      });

      /// get source
      this.source = this.map.getSource('firebase')

      // täytyy laittaa tämä data localstorageen ja jos se löytyy sieltä niin
      // OLLA PÄIVITTÄMÄTTÄ UUDESTAAN KAIKKEA


      if (noLocalData) {
        /// subscribe to realtime database and set data source
        this.markers.valueChanges().subscribe(markers => {

          var valueChanged: boolean = false;

            let data = new FeatureCollection(markers)

            this.source.setData(data)


          markers.forEach((value) => {
            //console.log(this.markersToDisplay.findIndex(x => x==value.value));
            !this.markersToDisplay.has(value) ? (this.markersToDisplay.add(value), valueChanged = true) : console.log("object already exists");
            // console.log(this.markersToDisplay);
            // console.log(value.geometry.coordinates);
          })
            localStorage.setItem("markers", JSON.stringify(markers));
            valueChanged ? (localStorage.removeItem("markers") , localStorage.setItem("markers", JSON.stringify(markers)))  : console.log('values didnt change');
        //console.log(this.markersToDisplay)

        })
      }

      if (!noLocalData){
        this.source.setData(this.offlineData)

        this.offlineMarkerData.forEach((value) => {
          //console.log(this.markersToDisplay.findIndex(x => x==value.value));
          !this.markersToDisplay.has(value) ? (this.markersToDisplay.add(value)) : console.log("object already exists");
          // console.log(this.markersToDisplay);
          // console.log(value.geometry.coordinates);
        })
      }

      /// create map layers with realtime data
      this.map.addLayer({
        id: 'firebase',
        source: 'firebase',
        type: 'symbol',
        layout: {
          'text-field': '{message}',
          'text-size': 24,
          'text-transform': 'uppercase',
          'icon-image': 'bin',
          'text-offset': [0, 1.5]
        },
        paint: {
          'text-color': '#f16624',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      })


      // add markers to map
      // geojson.features.forEach(function (marker) {
      //   // create a DOM element for the marker
      //   var el = document.createElement('div');
      //   el.className = 'marker';
      //   el.style.backgroundImage =
      //   'url(https://placekitten.com/g/' +
      //   marker.properties.iconSize.join('/') +
      //   '/)';
      //   el.style.width = marker.properties.iconSize[0] + 'px';
      //   el.style.height = marker.properties.iconSize[1] + 'px';
      //   el.style.backgroundSize = '100%';

      //   el.addEventListener('click', function () {
      //   window.alert(marker.properties.message);
      //   });

      //   // add marker to map
      //   new mapboxgl.Marker(el)
      //   .setLngLat(marker.geometry.coordinates)
      //   .addTo(map);
      //   });

      // make an initial directions request that
      // starts and ends at the same location
      var start = [this.lng, this.lat];
      this.getRoute(start);

      // Add starting point to the map
      this.map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: start
              }
            }
            ]
          }
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#3887be',
          'circle-stroke-color': 'black',
          'circle-stroke-width': 1,
        }
      });
      // this is where the code from the next step will go

    })

  }


  /// Helpers

  removeMarker(marker) {
    this.mapService.removeMarker(marker.$key)
  }

  flyTo(data: GeoJson) {
    this.cameraRotate = !this.cameraRotate;
    this.map.flyTo({
      center: data.geometry.coordinates, // eslint-disable-line no-use-before-define
      zoom: 17
    })
  }

  flyToCoords(coords: any[]) {
    this.cameraRotate = !this.cameraRotate;
    this.map.flyTo({
      center: coords, // eslint-disable-line no-use-before-define
      zoom: 17
    })
  }

  flyToCurrentRoskis() {
    this.cameraRotate = !this.cameraRotate;
    this.map.flyTo({
      center: this.currentRoskis, // eslint-disable-line no-use-before-define
      zoom: 17
    })
  }

  flyToUserService(rep){

    // console.log(rep.coords.latitude);
    // console.log(rep.coords.longitude);

    this.flyToCoords([rep.coords.longitude,rep.coords.latitude])
  }

  flyToUser() {
    this.cameraRotate = !this.cameraRotate;
    var start: any[] = [];
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      start = [this.lng, this.lat]


      this.map.removeLayer('point');
      this.map.removeSource('point');

        // Add starting point to the map
        this.map.addLayer({
          id: 'point',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: start
                }
              }
              ]
            }
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#3887be',
            'circle-stroke-color': 'black',
            'circle-stroke-width': 1,
          }
        });



      this.map.flyTo({
        center: [this.lng, this.lat],
        zoom: 17
      })
    });

    }
  }



// create a function to make a directions request

  getRoute(end: any) {
  // make a directions request using walking profile
  // an arbitrary start will always be the same
  // only the end or destination will change
  this.currentRoskis = end;
  if (localStorage.getItem("routeData")  !== null ) var obj = (localStorage.getItem("routeData"));


  // console.log(obj);

  navigator.geolocation.getCurrentPosition(position => {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
  });



  var start = [this.lng, this.lat];


  // this.map.addLayer({
  //   id: 'point',
  //   type: 'circle',
  //   source: {
  //     type: 'geojson',
  //     data: {
  //       type: 'FeatureCollection',
  //       features: [{
  //         type: 'Feature',
  //         properties: {},
  //         geometry: {
  //           type: 'Point',
  //           coordinates: start
  //         }
  //       }
  //       ]
  //     }
  //   },
  //   paint: {
  //     'circle-radius': 10,
  //     'circle-color': '#3887be',
  //     'circle-stroke-color': 'black',
  //     'circle-stroke-width': 1,
  //   }
  // });

///////////////////////////////////////////////////
  // Täytyy katsoa distance dataa ja päätellä mikä roskis on lähinnä
  // tään jälkeen valita se reitiksi ja esittää  reitti



//   console.log(start);
//   console.log(this.currentPosition);
// console.log(end);
// console.log(this.currentDestination);
  if (!(this.currentPosition == start && this.currentDestination == end)) {
    this.currentPosition = start;

    var url = 'https://api.mapbox.com/directions/v5/mapbox/walking/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + environment.mapbox.accessToken;
    //var bool: Observable<boolean>;


    // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = () => {
      //console.log(req)
      //test(req)
      this.routeFunction(req);
      //bool.
      // Do something with the retrieved data ( found in xmlhttp.response )
    };
    req.send();

    this.latestReq = req;

  }
  else { this.routeFunction(this.latestReq); }
  this.currentDestination = end;
}

routeFunction(req) {
  //console.log(this.map);
  //console.log(this.map);
  var json = JSON.parse(req.response);
  // console.log(req.response);
  // console.log(json);
  // console.log(json.routes[0]);

  if (!this.routeDataSet.has(json.routes[0])) {
    this.routeData.push(json.routes[0]);
    localStorage.setItem("routeData", JSON.stringify(this.routeData));
  }






  var data = json.routes[0];
  // data.distance: 926.09
  // console.log(Math.ceil(Math.round(data.distance)/5)*5);
  // Math.ceil(Math.round(data.distance)/5)*5: 930
  this.distanceToRoskis = Math.ceil(Math.round(data.distance)/5)*5;
  var route = data.geometry.coordinates;
  var geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  };
  // if the route already exists on the map, reset it using setData
  if (this.map.getSource('route')) {
    this.map.getSource('route').setData(geojson); // eslint-disable-line no-use-before-define
  } else { // otherwise, make a new request
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
            coordinates: geojson // eslint-disable-line no-use-before-define
          }
        }
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        // 'line-color': '#3887be',
        'line-color': '#ffc107',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });
  }
  // add turn instructions here at the end

  }


  // find these and hide
  // class="mapboxgl-ctrl mapboxgl-ctrl-attrib"
  // class="mapboxgl-ctrl-bottom-left"

getNearestPoint(fromCoordindexes: any[],pointCoordinates: any[]): number{

      // Return index of nearest point
  var arrayOfMatches = [];
  var routeLengths: any[] = [[],[]]; //: Set<any> = new Set();
  var arrayOfMarkers = Array.from(this.markersToDisplay);

  fromCoordindexes.forEach((element) => {
    arrayOfMatches.push(arrayOfMarkers[element]);
    routeLengths[0].push(element);
  });
  // var arrayOfMarkers = Array.from(JSON.parse(localStorage.getItem('markers')));
  // console.log(fromCoordindexes);
  // console.log(arrayOfMatches);

  for (let value of arrayOfMatches) {
    // console.log('value');

    // console.log(value);
  // this.markersToDisplay.forEach(function (value, index) {


    // console.log('pointCoordinates');
    // console.log(pointCoordinates);

    const R = 6371e3; // metres
    const φ1 = pointCoordinates[0] * Math.PI/180; // φ, λ in radians
    const φ2 = value.geometry.coordinates[0] * Math.PI/180;
    const Δφ = (value.geometry.coordinates[0]-pointCoordinates[0]) * Math.PI/180;
    const Δλ = (value.geometry.coordinates[1]-pointCoordinates[1]) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres
      // console.log(element.geometry.coordinates);
      // console.log(d);
      // routeLengths.add([index, d]);
      routeLengths[1].push(d);
  } //)
  ;

  // console.log(routeLengths);
  var arrayOfLenghts = routeLengths; // etäisyys bboxin sisällä olevista roskiksista
  //var markersOfLenghts = Array.from(this.markersToDisplay);
  var shortest = Math.min(...routeLengths[1]);
  var indexOfShortest = arrayOfLenghts[1].findIndex(x => x == shortest);

  // console.log(arrayOfLenghts);
  // console.log(markersOfLenghts);
  // console.log(shortest);
  // console.log(indexOfShortest);
  // console.log(arrayOfLenghts[1].findIndex(x => x == shortest));
  // console.log(arrayOfLenghts[0][indexOfShortest]);

  return arrayOfLenghts[0][indexOfShortest]
}

  getNearestRoskis() {



    var routeLengths: any[] = []; //: Set<any> = new Set();
    var arrayOfMarkers = Array.from(this.markersToDisplay);
    // var arrayOfMarkers = Array.from(JSON.parse(localStorage.getItem('markers')));

    for (let [index, value] of arrayOfMarkers.entries()) {
    // this.markersToDisplay.forEach(function (value, index) {


      const R = 6371e3; // metres
      const φ1 = this.lat * Math.PI/180; // φ, λ in radians
      const φ2 = value.geometry.coordinates[1] * Math.PI/180;
      const Δφ = (value.geometry.coordinates[1]-this.lat) * Math.PI/180;
      const Δλ = (value.geometry.coordinates[0]-this.lng) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      const d = R * c; // in metres
        // console.log(element.geometry.coordinates);
        // console.log(d);
        // routeLengths.add([index, d]);
        routeLengths.push(d);
    } //)
    ;

    // console.log(routeLengths);
    var arrayOfLenghts = routeLengths;
    var markersOfLenghts = Array.from(this.markersToDisplay);
    var shortest = Math.min(...Array.from(routeLengths));

    // console.log(arrayOfLenghts);
    // console.log(markersOfLenghts);
    // console.log(shortest);
    // console.log(markersOfLenghts[arrayOfLenghts.findIndex(x => x == shortest)].geometry.coordinates);
    // console.log(arrayOfLenghts.findIndex(x => x == shortest));
    //console.log(arrayOfLenghts.findIndex(x =>  Math.round(x) == Math.round(shortest)));
    // console.log(arrayOfLenghts.findIndex(x => x == shortest));
    // console.log(markersOfLenghts[arrayOfLenghts.findIndex(x => x == shortest)]);
    // console.log(markersOfLenghts[7].geometry.coordinates);

    this.getRoute(markersOfLenghts[arrayOfLenghts.findIndex(x => x == shortest)].geometry.coordinates);
    // console.log(arrayOfLenghts[7]);
    // console.log(Math.round(shortest));

  }

  cameraMovement() {

    this.cameraRotate = !this.cameraRotate;
    // console.log(this.map.getBearing());
    // console.log(this.map.getPitch());
    if (this.cameraRotate) this.rotateCamera(this.map.getBearing()*100)

    //this.rotateCamera(0);
  }

  rotateCamera = (bearing) => {
    if (this.cameraRotate) { requestAnimationFrame(this.rotateCamera)
    //this.map.setPitch(60);
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    this.map.rotateTo((bearing / 100) % 360, { duration: 0  });
    // Request the next frame of the animation.
    }
  }

  inBoundingBox(bl/*bottom left*/: Coordinate, tr/*top right*/: Coordinate, p: Coordinate): Boolean {
    // in case longitude 180 is inside the box
    var isLongInRange = (tr.lon < bl.lon) ?
        p.lon >= bl.lon || p.lon <= tr.lon
      :
        p.lon >= bl.lon && p.lon <= tr.lon;

    return p.lat >= bl.lat  &&  p.lat <= tr.lat  &&  isLongInRange
  }

  clickedBinCoords(markerIndex: any, coords: any, coordinates: any){
    if (Array.from(markerIndex)[0]) { return coords;
    } else { return coordinates;}
  }

}
