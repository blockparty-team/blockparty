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
}
