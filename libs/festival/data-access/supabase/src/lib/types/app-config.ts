export type TimetableMode = 'gantt' | 'list';
export type TimetableListMode = 'byStage' | 'byTime';

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
  timetable: {
    mode: TimetableMode;
    listMode: TimetableListMode;
  };
  favorites: {
    simpleLabel: boolean;
  };
  dayChangeDelay: number;
  supabase: {
    url: string;
    anonKey: string;
  };
  oneSignalAppId: string;
  featureToggle: {
    enableLogin: boolean;
  };
  eventFilter: {
    showDays: boolean;
    showEventTypes: boolean;
    showEvents: boolean;
    showOnMap: boolean;
  };
  iosAppId: string;
  /**
   * ISO 3166-1 alpha-2 country code used when querying the iOS App Store
   * for available app updates (e.g. 'dk', 'us'). Defaults to 'us' when omitted.
   *
   * Passed as the `country` option to `AppUpdate.getAppUpdateInfo()`.
   * @see https://capawesome.io/plugins/app-update/#getappupdateinfooptions
   */
  iosAppStoreCountry?: string;
};
