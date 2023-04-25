import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AppService {
    private _appInitialized$ = new Subject<void>();
    appInitialized$: Observable<void> = this._appInitialized$.asObservable();

    appInitialized(): void {
        this._appInitialized$.next();
    }
}