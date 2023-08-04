import { Environment } from "./environment.model";

export const environment: Environment = {
  production: true,
  festivalName: 'Karrusel Festival',
  appUrl: 'https://karrusel.vercel.app',
  supabaseUrl: 'https://ystloacekpukmliuuvrr.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzdGxvYWNla3B1a21saXV1dnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA5MTM2NTUsImV4cCI6MjAwNjQ4OTY1NX0.Nda_3UWl_Atu3Y7ogfKtVR2sDwAgyZjOPCA7Nedt-7c',
  maptilerStyleJson: 'https://api.maptiler.com/maps/62517ef6-259e-4ecc-a9df-6b330f8b5092/style.json?key=IFNEgQuIP7z1PzGMheNY',
  maptilerApiKey: 'IFNEgQuIP7z1PzGMheNY',
  mapView: {
    center: [12.618371, 55.690323],
    zoom: 16.5,
    pitch: 0
  },
  oneSignalAppId: '1c3348ed-5747-4c3d-89f1-f6ad3049c0a0',
  featureToggle: {
    enableLogin: false
  }
};
