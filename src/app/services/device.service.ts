import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Device } from '@capacitor/device';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {

    public deviceId: Observable<string> = from(Device.getId()).pipe(
        map(device => device.identifier)
    );
}