import {skipWaiting, clientsClaim} from 'workbox-core';
import {precacheAndRoute, cleanupOutdatedCaches} from 'workbox-precaching';
declare const self: ServiceWorkerGlobalScope;
skipWaiting();
clientsClaim();
cleanupOutdatedCaches();
/**
* The workboxSW.precacheAndRoute() method efficiently caches and responds to
* requests for URLs in the manifest.
* See https://goo.gl/S9QRab
*/
precacheAndRoute(self.__WB_MANIFEST);
