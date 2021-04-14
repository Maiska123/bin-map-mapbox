import { AppComponent } from './app.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: "runs", component: AppComponent },
  { path: "map", component: MapBoxComponent },
  { path: "run/:id", component: MapBoxComponent },
  { path: "", redirectTo: "/map", pathMatch: 'full' }

  // { path: "runs", component: ActivityListComponent },
  // { path: "run/:id", component: MapComponent },
  // { path: "", redirectTo: "/runs", pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
