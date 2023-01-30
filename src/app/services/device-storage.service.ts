import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type StorageKeys =
  'days' |
  'artists' |
  'favorites' |
  'timetable' |
  'events' |
  'eventsGroupedByType' |
  'mapLayers';

@Injectable({
  providedIn: 'root'
})
export class DeviceStorageService {

  set(key: StorageKeys, value: any): void {
    Preferences.set({
      key,
      value: JSON.stringify(value)
    });
  }

  get(key: StorageKeys): Observable<any> {
    return from(Preferences.get({ key })).pipe(
      map(prop => JSON.parse(prop.value))
    );
  }

  // Methods below is used by supabase client to persist login in IOS/Android app
  getItem(key: string): Promise<string> {
    return Preferences.get({key}) as Promise<any>;
  }

  setItem(key: string, value: string): Promise<void> {
    return Preferences.set({key, value});
  }

  removeItem(key: string): Promise<void> {
    return Preferences.remove({key});
  }

}
