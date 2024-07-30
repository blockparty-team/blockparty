export type AppConfig = {
  app: {
    name: string;
    url: string;
  };
  map: {
    view: {
      center: [number, number];
      zoom: number;
      pitch: number;
    };
    styleUrl: string;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
  oneSignalAppId: string;
  featureToggle: {
    enableLogin: boolean;
  };
};
