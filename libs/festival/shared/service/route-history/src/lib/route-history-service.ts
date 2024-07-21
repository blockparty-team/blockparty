import { Injectable, inject } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Observable, concat, of } from 'rxjs';
import { filter, map, pairwise, shareReplay } from 'rxjs/operators';

interface RouteHistory {
  previous: string | null;
  current: string;
}

@Injectable({
  providedIn: 'root',
})
export class RouteHistoryService {
  private router = inject(Router);

  private initalHistory$: Observable<RouteHistory> = of({
    previous: null,
    current: '/',
  });

  private historyAfterFirstNavigation$: Observable<RouteHistory> =
    this.router.events.pipe(
      filter((event: any) => event instanceof RoutesRecognized),
      pairwise(),
      map((events: RoutesRecognized[]) => {
        return {
          previous: events[0].urlAfterRedirects,
          current: events[1].urlAfterRedirects,
        };
      }),
    );

  public history$ = concat(
    this.initalHistory$,
    this.historyAfterFirstNavigation$,
  ).pipe(shareReplay(1));

  // TODO: look at APP_INITIALIZER : https://angular.io/api/core/APP_INITIALIZER
  public init(): void {
    // Subsciption for start tracking
    this.history$.subscribe();
  }
}
