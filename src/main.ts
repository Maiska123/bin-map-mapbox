import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

import {Workbox} from 'workbox-window'

function loadServiceWorker() {
 if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');
  wb.register();
 }
}

platformBrowserDynamic().bootstrapModule(AppModule)
.then( _=> loadServiceWorker())
.catch(err => console.error(err));
