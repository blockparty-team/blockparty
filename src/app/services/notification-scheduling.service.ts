import { Injectable, OnDestroy, inject, isDevMode } from "@angular/core";
import { TimetableStateService } from "@app/pages/timetable/state/timetable-state.service";
import { FavoriteStateService } from "@app/pages/favorite/state/favorite-state.service";
import { Observable, Subject, combineLatest, defer, from } from "rxjs";
import { filter, find, map, mergeMap, skip, switchMap, take, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { LocalNotificationsService } from "./local-notifications.service";
import { sub } from 'date-fns'
import { enableProdMode } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NotificationSchedulingService implements OnDestroy {

  // Later this could retrieved from settings state
  private MINUTES_BEFORE = 60;

  private timetableStateService = inject(TimetableStateService);
  private favoritesStateService = inject(FavoriteStateService);
  private localNotificationService = inject(LocalNotificationsService);

  private destroyed$: Subject<void> = new Subject<void>();

  constructor() {

    this.favoritesStateService.artistFavoriteChanged$.pipe(
      takeUntil(this.destroyed$),
      switchMap(({ artistId, isFavorite }) => {
        if (isFavorite) {
          return from(this.localNotificationService.getNextId()).pipe(
            // TODO: Need to check for undefined startTime
            switchMap(id => this.timetableStateService.timetableArtistNotification$.pipe(
              map( artistNotifications  => artistNotifications.find(artist => artist.artistId === artistId && artist.startTime != undefined)),
              map( artistNotification => [this.localNotificationService.artistNotificationPayload(
                  id, artistNotification, 60)]),
              mergeMap(notifications => this.localNotificationService.schedule(notifications)),
            ))
          );
        } else {
          return from(this.localNotificationService.getNotificationIdFromArtistId(artistId)).pipe(
            switchMap(notificationId => this.localNotificationService.cancelNotification(notificationId)),
          )
        }}
      ),
      switchMap(_ => from(this.localNotificationService.getAllNotifications())),
      tap(console.log)
    ).subscribe();
  }
  
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();  
  }

  private init(): void {
    
  };


  rescheduleAllArtistNotifications() {
    return combineLatest([
      this.timetableStateService.timetableArtistNotification$,
      this.favoritesStateService.favorites$.pipe(map(favs => favs.find(fav => fav.entity === 'artist').ids))
    ]).pipe(
      // Skip first coming from local storage
      skip(1),
      take(1),
      filter(([artists, favoriteIds]) => !!artists && !!favoriteIds),
      map(([artists, favoriteIds]) => artists.filter(artist => favoriteIds.includes(artist.artistId))),
      tap(artists => {
        // Cancel all notifications
        this.localNotificationService.cancelAllNotifications(this.MINUTES_BEFORE);

        // Reschedule notifications
        const now = new Date();
        const notifications = artists
          .map((artist, index) => this.localNotificationService.artistNotificationPayload(index, artist, this.MINUTES_BEFORE))
          .filter(n => sub(n.schedule.at, { minutes: this.MINUTES_BEFORE }) >= now);

        if (notifications.length > 0) this.localNotificationService.schedule(notifications);

        // console.log("Dev-mode:", isDevMode());
        // if (isDevMode()) {
        //   const now = new Date();
        //   const notifications = artists
        //     .map((artist, index) => this.localNotificationService.artistNotificationPayload(index, artist, this.MINUTES_BEFORE))
        //     .filter(n => sub(n.schedule.at, { minutes: this.MINUTES_BEFORE }) >= now);

        //   if (notifications.length > 0) this.localNotificationService.schedule(notifications);
        // }
      })
    ).subscribe()
  }
}