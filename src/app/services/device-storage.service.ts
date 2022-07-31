import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type StorageKeys = 'artists' | 'favorites' | 'timetable';

@Injectable({
  providedIn: 'root'
})
export class DeviceStorageService {

  set(key: StorageKeys, value: any): void {
    Storage.set({
      key,
      value: JSON.stringify(value)
    });
  }

  get(key: StorageKeys): Observable<any> {
    return from(Storage.get({ key })).pipe(
      map(prop => JSON.parse(prop.value))
    );
  }
}
