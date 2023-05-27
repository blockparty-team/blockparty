export interface Environment {
    production: boolean;
    festivalName: string;
    appUrl: string;
    supabaseUrl: string;
    supabaseAnonKey: string;
    maptilerStyleJson: string;
    maptilerApiKey?: string;
    oneSignalAppId: string;
    mapView: {
      center: [number, number];
      zoom: number;
      pitch: number;
    };
    featureToggle: {
      enableLogin: boolean;
    };
  }