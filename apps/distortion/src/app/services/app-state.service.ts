import { Injectable } from "@angular/core";
import { BehaviorSubject, interval, merge, Observable, of, startWith, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AppStateService {
  private _reloadData$ = new BehaviorSubject<null>(null);
  reloadData$: Observable<number> = merge(
    this._reloadData$.asObservable().pipe(
      startWith(null)
    ),
    // Refresh data every hour
    interval(1000 * 60 * 60),
  )

  reloadData(): void {
    this._reloadData$.next(null);
  }
}
