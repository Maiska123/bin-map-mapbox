import { PaintingMenuComponent } from './map-box/painting-menu/painting-menu.component';
import { DrawingCanvasComponent } from './map-box/drawing-canvas/drawing-canvas.component';
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
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
// import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
// import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from "@angular/cdk/overlay";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AngularFireModule } from '@angular/fire/compat';

@NgModule({
  declarations: [
    AppComponent,
    MapBoxComponent,
    HelloComponent,
    DistanceComponent,
    HamburgerMenuComponent,
    DrawingMenuComponent,
    DrawingCanvasComponent,
    PaintingMenuComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatSidenavModule,
    MatSlideToggleModule,
    OverlayModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    SweetAlert2Module.forRoot(),
  ],
  providers: [MapService, AngularFirestoreModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
