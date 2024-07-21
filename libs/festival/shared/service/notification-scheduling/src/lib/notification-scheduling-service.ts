import { Injectable, OnDestroy, inject } from '@angular/core';
import { FavoriteStateService } from '@blockparty/festival/data-access/state/favorite';
import { Subject, combineLatest, from } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  skip,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';
import { LocalNotificationsService } from '@blockparty/festival/shared/service/local-notifications';
import { TimetableSharedStateService } from '@blockparty/festival/data-access/state/timetable-shared';

@Injectable({
  providedIn: 'root',
})
export class NotificationSchedulingService implements OnDestroy {
  // Later this could retrieved from settings state
  private MINUTES_BEFORE = 60;

  private timetableSharedStateService = inject(TimetableSharedStateService);
  private favoritesStateService = inject(FavoriteStateService);
  private localNotificationService = inject(LocalNotificationsService);

  private destroyed$: Subject<void> = new Subject<void>();

  constructor() {
    this.favoritesStateService.artistFavoriteChanged$
      .pipe(
        takeUntil(this.destroyed$),
        switchMap(({ artistId, isFavorite }) => {
          if (isFavorite) {
            return from(this.localNotificationService.getNextId()).pipe(
              switchMap((id) =>
                this.timetableSharedStateService.timetableArtistNotification$.pipe(
                  map((artistNotifications) =>
                    artistNotifications.find(
                      (artist) =>
                        artist.artistId === artistId &&
                        artist.startTime != undefined,
                    ),
                  ),
                  filter((artistNotificaton) => !!artistNotificaton),
                  map((artistNotification) => [
                    this.localNotificationService.artistNotificationPayload(
                      id,
                      artistNotification,
                      60,
                    ),
                  ]),
                  mergeMap((notifications) =>
                    this.localNotificationService.schedule(notifications),
                  ),
                ),
              ),
            );
          } else {
            return from(
              this.localNotificationService.getNotificationIdFromArtistId(
                artistId,
              ),
            ).pipe(
              switchMap((notificationId) =>
                this.localNotificationService.cancelNotification(
                  notificationId!,
                ),
              ),
            );
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  rescheduleAllArtistNotifications(): void {
    combineLatest([
      this.timetableSharedStateService.timetableArtistNotification$,
      this.favoritesStateService.favorites$.pipe(
        map((favs) => favs.find((fav) => fav.entity === 'artist')!.ids),
      ),
    ])
      .pipe(
        // Skip first coming from local storage
        skip(1),
        take(1),
        filter(([artists, favoriteIds]) => !!artists && !!favoriteIds),
        switchMap(([artists, favoriteIds]) =>
          from(
            this.localNotificationService.cancelAllNotifications(
              this.MINUTES_BEFORE,
            ),
          ).pipe(
            switchMap((_) => {
              let favoriteArtists = artists.filter((artist) =>
                favoriteIds.includes(artist.artistId),
              );
              const now = new Date();
              const notifications = favoriteArtists
                .map((artist, index) =>
                  this.localNotificationService.artistNotificationPayload(
                    index,
                    artist,
                    this.MINUTES_BEFORE,
                  ),
                )
                .filter((n) => {
                  return n.schedule!.at! >= now;
                });
              if (notifications.length > 0) {
                this.localNotificationService
                  .schedule(notifications)
                  .then(() => {
                    this.localNotificationService
                      .getAllNotifications()
                      .then((notifications) =>
                        console.info(
                          'Rescheduled notifications:',
                          notifications,
                        ),
                      );
                  });
              }
              return [favoriteArtists, favoriteIds];
            }),
          ),
        ),
      )
      .subscribe();
  }
}
