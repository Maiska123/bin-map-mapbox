import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';
import { GeoJson } from './map';
import '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable()
export class MapService {

  constructor(private db: AngularFireDatabase) {
  }

  getMarkers(): any {
    return this.db.list('/real-markers');
  }

  createMarker(data: GeoJson) {
    return this.db.list('/real-markers').push(data);
  }

  removeMarker($key: string) {
    return this.db.object('/real-markers/' + $key).remove();
  }

  getLocation(): Observable<any> {
    return Observable.create((observer) => {
      if (window.navigator && window.navigator.geolocation) {
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
        coordinates: route,
      },
    };
    // if the route already exists on the map, reset it using setData
    if (map.getSource('route')) {
      map.getSource('route').setData(geojson);
    } else {
      // otherwise, make a new request
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
              coordinates: geojson,
            },
          },
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75,
        },
      });
    }
    // add turn instructions here at the end
  }
}
