import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bin-map-mapbox';

  lat;
  lng;
  zoom;
  origin;
  destination

  ngOnInit() {
    this.getUserLocation();
  }

  getUserLocation() {
    // get Users current position

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 16;
        console.log("position", position)
      });
    }
  }

  async getDirection() {

    if (typeof this.lat === "undefined" || typeof this.lng === "undefined" || typeof this.zoom === "undefined") {
      await this.getUserLocation();
    }
    this.origin = { lat: this.lat, lng: this.lng };

    this.destination = { lat: 61.446345, lng: 23.845872 };
    console.log(this.origin);

  }
}
