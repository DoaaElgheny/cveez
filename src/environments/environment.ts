// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: 'v8.1.6',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  // apiUrl: 'api',
  //  api_url:  'https://api.cveeez.com/',//production
   api_url: 'https://apicveeez.azurewebsites.net/',
    web_url: 'https://pre-cveeez.azurewebsites.net/', //pre
  //  web_url: 'https://www.cveeez.com/',//prod
  // web_url: 'http://localhost:4200/',//locale
  appThemeName: 'Metronic',
  appPurchaseUrl: 'https://1.envato.market/EA4JP',
  appHTMLIntegration:
    'https://preview.keenthemes.com/metronic8/lilac/documentation/base/helpers/flex-layouts.html',
  appPreviewUrl: 'https://preview.keenthemes.com/metronic8/angular/lilac/',
  appPreviewAngularUrl:
    'https://preview.keenthemes.com/metronic8/angular/lilac',
  appPreviewDocsUrl: 'https://preview.keenthemes.com/metronic8/angular/docs',
  BlobUrl: 'https://cveeezstorage.blob.core.windows.net/files/host/',
  appPreviewChangelogUrl:
    'https://preview.keenthemes.com/metronic8/angular/docs/changelog',
  appDemos: {
    lilac: {
      title: 'Demo 1',
      description: 'Default Dashboard',
      published: true,
      thumbnail: './assets/media/demos/lilac.png',
    },
  },
  firebase: {
    apiKey: "AIzaSyA6dndHr2LJPCYcv6orWYW52GlfoNWBOvc",
    authDomain: "cveeez-fc4a1.firebaseapp.com",
    projectId: "cveeez-fc4a1",
    storageBucket: "cveeez-fc4a1.appspot.com",
    messagingSenderId: "355548201259",
    appId: "1:355548201259:web:ef6b504e2f3db99e9b856e",
    measurementId: "G-54PEXBW5M5"

    
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
