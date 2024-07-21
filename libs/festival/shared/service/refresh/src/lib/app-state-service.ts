import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, merge, Observable, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshService {
  private _reloadData$ = new BehaviorSubject<null>(null);
  reloadData$: Observable<number | null> = merge(
    this._reloadData$.asObservable().pipe(startWith(null)),
    // Refresh data every hour
    interval(1000 * 60 * 60),
  );

  reloadData(): void {
    this._reloadData$.next(null);
  }
}
