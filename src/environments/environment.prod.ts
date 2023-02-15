import { Environment } from "./environment.model";

export const environment: Environment = {
  production: true,
  festivalName: 'Distortion Festival',
  appUrl: 'https://distortioncph.vercel.app',
  supabaseUrl: 'https://kutgkjqbdasprmpugfyi.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dGdranFiZGFzcHJtcHVnZnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTU2MjExNDQsImV4cCI6MTk3MTE5NzE0NH0.d_DBRZQaIrQDgRhTC8LB35YHy279FVn4vs1L4uTp11k',
  maptilerStyleJson: 'https://api.maptiler.com/maps/decadbf9-1a07-4b7b-9726-fed2f003b673/style.json?key=MZCjtFvEvhy0zEdhtmhp',
  mapView: {
    center: [12.547927, 55.667071],
    zoom: 14,
    pitch: 0
  },
  oneSignalAppId: '1c3348ed-5747-4c3d-89f1-f6ad3049c0a0',
  featureToggle: {
    enableLogin: false
  }
};
