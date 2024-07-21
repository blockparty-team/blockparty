import { Injectable } from '@angular/core';
import {
  Geolocation,
  PermissionStatus,
  Position,
  PositionOptions,
} from '@capacitor/geolocation';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private positionOptions: PositionOptions = {
    enableHighAccuracy: true,
  };

  constructor() { }

  checkPermissions(): Observable<PermissionStatus> {
    return from(Geolocation.checkPermissions());
  }

  requestPermissions(): Observable<PermissionStatus> {
    return from(Geolocation.requestPermissions());
  }

  getCurrentPosition(): Observable<Position> {
    return from(Geolocation.getCurrentPosition(this.positionOptions));
  }

  watchPosition(): any {
    Geolocation.watchPosition(this.positionOptions, (position, err) => { });
  }
}
