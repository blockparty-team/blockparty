import { Injectable, OnDestroy, inject, isDevMode } from "@angular/core";
import { FavoriteStateService } from "@app/pages/favorite/state/favorite-state.service";
import { Observable, Subject, combineLatest, defer, from } from "rxjs";
import { filter, find, map, mergeMap, skip, switchMap, take, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { LocalNotificationsService } from "./local-notifications.service";
import { sub } from 'date-fns'
import { enableProdMode } from "@angular/core";
import { ArtistStateService } from "@app/pages/artist/state/artist-state.service";
import { TimetableSharedStateService } from "@app/pages/timetable/state/timetable-shared-state.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationSchedulingService implements OnDestroy {

  // Later this could retrieved from settings state
  private MINUTES_BEFORE = 60;

  private timetableSharedStateService = inject(TimetableSharedStateService);
  private favoritesStateService = inject(FavoriteStateService);
  private localNotificationService = inject(LocalNotificationsService);

  private destroyed$: Subject<void> = new Subject<void>();

  constructor() {

    this.favoritesStateService.artistFavoriteChanged$.pipe(
      takeUntil(this.destroyed$),
      switchMap(({ artistId, isFavorite }) => {
        if (isFavorite) {
          return from(this.localNotificationService.getNextId()).pipe(
            switchMap(id => this.timetableSharedStateService.timetableArtistNotification$.pipe(
              map( artistNotifications  => artistNotifications.find(artist => artist.artistId === artistId && artist.startTime != undefined)),
              filter(artistNotificaton => !!artistNotificaton),
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
      )
    ).subscribe();
  }
  
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();  
  }


  rescheduleAllArtistNotifications(): void {
    combineLatest([
      this.timetableSharedStateService.timetableArtistNotification$,
      this.favoritesStateService.favorites$.pipe(map(favs => favs.find(fav => fav.entity === 'artist').ids))
    ]).pipe(
      // Skip first coming from local storage
      skip(1),
      take(1),
      filter(([artists, favoriteIds]) => !!artists && !!favoriteIds),
      switchMap(([artists, favoriteIds]) =>
        from(this.localNotificationService.cancelAllNotifications(this.MINUTES_BEFORE)).pipe(
          switchMap(_ => {
            let favoriteArtists = artists.filter(artist => favoriteIds.includes(artist.artistId));
            const now = new Date();
            const notifications = favoriteArtists
              .map((artist, index) => this.localNotificationService.artistNotificationPayload(index, artist, this.MINUTES_BEFORE))
              .filter(n => {
                return sub(n.schedule.at, { minutes: this.MINUTES_BEFORE }) >= now
              });
            if (notifications.length > 0) {
              console.log(notifications);
              this.localNotificationService.schedule(notifications).then(result => {
                this.localNotificationService.getAllNotifications().then(notifications => console.log("HEY", notifications))
              })
            }
            return ([favoriteArtists, favoriteIds])
          })))).subscribe(d => d)
  };
}