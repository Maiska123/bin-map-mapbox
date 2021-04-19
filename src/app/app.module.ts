import { DrawingMenuComponent } from './map-box/drawing-menu/drawing-menu.component';
import { HamburgerMenuComponent } from './map-box/hamburger-menu/hamburger-menu.component';
import { DistanceComponent } from './map-box/distance/distance.component';
import { environment } from './../environments/environment';
import { MapService } from './map.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { FormsModule } from '@angular/forms';
import { HelloComponent } from './hello/hello.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from "@angular/cdk/overlay";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
@NgModule({
  declarations: [
    AppComponent,
    MapBoxComponent,
    HelloComponent,
    DistanceComponent,
    HamburgerMenuComponent,
    DrawingMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    OverlayModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatSlideToggleModule
  ],
  providers: [MapService, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
