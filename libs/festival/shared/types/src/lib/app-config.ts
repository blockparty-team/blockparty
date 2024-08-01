export type TimetableMode = 'gantt' | 'list';
export type ListMode = 'byStage' | 'byTime';

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
    listMode: ListMode;
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
  };
};
