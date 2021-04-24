import { MapBoxComponent } from './map-box/map-box.component';
import { AngularFireList } from 'angularfire2/database';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { GeoJson } from './map';
import * as mapboxgl from 'mapbox-gl';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { FirebaseApp } from '@angular/fire';
import { BehaviorSubject, Observable, VirtualTimeScheduler } from 'rxjs';

@Injectable()
export class MapService {

  // itemValue = new BehaviorSubject(this.theItem);

  // set theItem(value) {
  //   this.itemValue.next(value); // this will make sure to tell every subscriber about the change.
  //   localStorage.setItem('theItem', value);
  // }

  // get theItem() {
  //   return localStorage.getItem('theItem');
  // }



  constructor(private db: AngularFireDatabase
              /*public app: FirebaseApp*/) {
    // mapboxgl.accessToken= environment.mapbox.accessToken;
      //firebase.initializeApp(environment.firebaseConfig)
  //const firestore = app.firestore();


  // db.list("/real-markers").snapshotChanges().subscribe(() => {
  //   console.log("Current data updated");
  //   //this.itemValue = this.getMarkers();
  // });

  }


  getMarkers(): any {
    return this.db.list('/real-markers')
  }

  createMarker(data: GeoJson) {
    // this.localdb.push(data)
    // console.log(this.localdb)
    return this.db.list('/real-markers')
                  .push(data)
  }

  removeMarker($key: string) {
    return this.db.object('/real-markers/' + $key).remove()
  }

  getLocation(): Observable<any> {
    return Observable.create(observer => {
        if(window.navigator && window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
                (position) => {
                    observer.next(position);
                    observer.complete();
                },
                (error) => observer.error(error)
            );
        } else {
            observer.error('Unsupported Browser');
        }
    });
}

_routeFunction(req, map) {

  var json = JSON.parse(req.response);
  var data = json.routes[0];
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
  if (map.getSource('route')) {
    map.getSource('route').setData(geojson);
  } else { // otherwise, make a new request
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: geojson
          }
        }
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });
  }
  // add turn instructions here at the end

}

}
