 My friend once asked me,


>    "Would it be much nicer if i KNEW where the nearest litter bin is, rather than eg. leaving dog poo at the streets or carrying it to home etc..."


...then world gave birth to



# BinMapMapbox


| Frontend | Map Library | Online Database | Tested On |
|--|--|--|--|
| ![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white) | <img src="https://assets.website-files.com/5d3ef00c73102c436bc83996/5d3ef00c73102c893bc83a28_logo-regular.png" data-canonical-src="https://assets.website-files.com/5d3ef00c73102c436bc83996/5d3ef00c73102c893bc83a28_logo-regular.png" width="120" height="50" /> | ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase) | ![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white) |

![image](https://user-images.githubusercontent.com/42906162/199644443-9642a0bc-eeba-419a-b9f4-499575ac07cf.png)

## Few demonstrations of the app

https://user-images.githubusercontent.com/42906162/199641994-55bfb98f-4060-46e8-bf05-502bbd7a36a8.mp4




https://user-images.githubusercontent.com/42906162/199643977-9e0e585a-e226-4d8a-b4b0-5a794b82ac9d.mp4



https://user-images.githubusercontent.com/42906162/199643993-24265373-2997-43c2-ac7a-154613de1d87.mp4




This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.8.

AND STAYS LIKE THAT BECAUSE 3rd PARTY LIBRARIES! :/

## Api keys & configs

You need configurations AT LEAST for mapbox, firebase is just handy way to retrieve and store all bin informations with locations.

Your environment.ts should include,
<hr>

```
  firebaseConfig: { // Google firebase project with realtime database 
    apiKey: "<apiKey>",
    authDomain: "<authDomain>",
    databaseURL: "<databaseURL>",
    projectId: "<projectId>",
    storageBucket: "<storageBucket>",
    messagingSenderId: "<messagingSenderId>",
    appId: "<appId>",
    measurementId: "<measurementId>"
  },

  mapbox: { // general accestoken from mapbox
    accessToken: '<accessToken>'
  }
```

<hr>

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
