import { inject, Injectable } from '@angular/core';
import { AppConfig } from '@blockparty/festival/shared/types';
import { DeviceStorageService } from '@blockparty/shared/data-access/device-storage';
import { SupabaseService } from '@blockparty/festival/data-access/supabase';
import { catchError, concat, EMPTY, filter, tap } from 'rxjs';
import { signalState, patchState } from '@ngrx/signals';

const initialAppConfig: AppConfig = {
  app: {
    name: 'Blockparty',
    url: 'https://blockparty.dev',
  },
  map: {
    view: {
      center: [0, 0],
      zoom: 0,
      pitch: 0,
    },
    styleUrl: '',
  },
  timetable: {
    mode: 'gantt',
    listMode: 'byStage',
  },
  favorites: {
    simpleLabel: false,
  },
  supabase: {
    url: '',
    anonKey: '',
  },
  oneSignalAppId: '',
  featureToggle: {
    enableLogin: false,
  },
  dayChangeDelay: 0,
  eventFilter: {
    showDays: true,
    showEventTypes: true,
    showEvents: true,
  },
  iosAppId: '',
};

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private supabase = inject(SupabaseService);
  private deviceStorage = inject(DeviceStorageService);

  readonly appConfig = signalState(initialAppConfig);

  public appConfig$ = concat(
    this.deviceStorage.get('appConfig'),
    this.supabase.appConfig$.pipe(
      filter((config) => !!config),
      tap((config) => this.deviceStorage.set('appConfig', config)),
      catchError((error) => {
        console.error(error);
        return EMPTY;
      }),
    ),
  ).pipe(tap((config) => patchState(this.appConfig, config)));
}
