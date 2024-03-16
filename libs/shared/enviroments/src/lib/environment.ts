import { Environment } from './environment.model';

/* eslint-disable max-len */
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.

// The list of file replacements can be found in `angular.json`.
export const environment: Environment = {
  production: false,
  festivalName: 'Distortion Festival',
  appUrl: 'http://localhost:8100',
  // supabaseUrl: 'https://uvyohxoytqcqogahbcwo.supabase.co',
  // supabaseAnonKey:
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2eW9oeG95dHFjcW9nYWhiY3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzkyMzAxNzUsImV4cCI6MTk5NDgwNjE3NX0.3B8cKWbwLGPVQsAas1ZmhEtp4WsnSOMTfmEAhFz6wvg',
  supabaseUrl: 'http://localhost:54321',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  maptilerStyleJson:
    'https://api.maptiler.com/maps/62517ef6-259e-4ecc-a9df-6b330f8b5092/style.json?key=IFNEgQuIP7z1PzGMheNY',
  maptilerApiKey: 'IFNEgQuIP7z1PzGMheNY',
  mapView: {
    center: [12.57632, 55.68215],
    zoom: 11.5,
    pitch: 0,
  },
  oneSignalAppId: 'e5df19f0-b1e1-4e2d-bbc0-3e7c8437fdc4',
  featureToggle: {
    enableLogin: false,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
