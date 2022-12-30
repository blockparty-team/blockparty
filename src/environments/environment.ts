import { Environment } from "./environment.model";

/* eslint-disable max-len */
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.

// The list of file replacements can be found in `angular.json`.
export const environment: Environment = {
  production: false,
  festivalName: 'Distortion Festival',
  appUrl: 'http://localhost:8100',
  supabaseUrl: 'https://kutgkjqbdasprmpugfyi.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dGdranFiZGFzcHJtcHVnZnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTU2MjExNDQsImV4cCI6MTk3MTE5NzE0NH0.d_DBRZQaIrQDgRhTC8LB35YHy279FVn4vs1L4uTp11k',
  // supabaseUrl: 'http://localhost:54321',
  // supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs',
  maptilerStyleJson: 'https://api.maptiler.com/maps/decadbf9-1a07-4b7b-9726-fed2f003b673/style.json?key=MZCjtFvEvhy0zEdhtmhp',
  mapView: {
    center: [12.547927, 55.667071],
    zoom: 14,
    pitch: 0
  },
  oneSignalAppId: '32f2edb8-46e9-4eb1-9960-aa9ca8176d72'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
