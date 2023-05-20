import { Environment } from "./environment.model";

export const environment: Environment = {
  production: true,
  festivalName: 'Distortion Festival',
  appUrl: 'https://distortioncph.vercel.app',
  supabaseUrl: 'https://uvyohxoytqcqogahbcwo.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2eW9oeG95dHFjcW9nYWhiY3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzkyMzAxNzUsImV4cCI6MTk5NDgwNjE3NX0.3B8cKWbwLGPVQsAas1ZmhEtp4WsnSOMTfmEAhFz6wvg',
  maptilerStyleJson: 'https://api.maptiler.com/maps/62517ef6-259e-4ecc-a9df-6b330f8b5092/style.json?key=IFNEgQuIP7z1PzGMheNY',
  mapView: {
    center: [12.57632, 55.68215],
    zoom: 11.5,
    pitch: 0
  },
  oneSignalAppId: '1c3348ed-5747-4c3d-89f1-f6ad3049c0a0',
  featureToggle: {
    enableLogin: false
  }
};
