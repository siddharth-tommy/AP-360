// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
 //apiOrigin:'http://ec2-18-191-180-119.us-east-2.compute.amazonaws.com/',
  apiOrigin:'http://101.53.152.203:81/', //Internel
  //apiOrigin:'http://192.168.1.197:81/', //UAT
  //apiOrigin:'http://4597e03c.ngrok.io/',
  // apiOrigin:'http://52.45.186.126:81/',
  // apiOrigin:'http://dev.assetor.net:3000/', //UAT
  AuthorizationToken:'',
  mapbox: {
    accessToken: 'YOUR_TOKEN'
  }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
