import { Injectable, inject } from "@angular/core";
import { TimetableStateService } from "@app/pages/timetable/state/timetable-state.service";
import { FavoritesService } from "@app/services/favorites.service";
import { combineLatest } from "rxjs";
import { filter, map, skip, take, tap } from "rxjs/operators";
import { LocalNotificationsService } from "./local-notifications.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationSchedulingService {

  private timetableStateService = inject(TimetableStateService);
  private favoritesService = inject(FavoritesService);
  private localNotificationService = inject(LocalNotificationsService)

  rescheduleAllArtistNotifications() {
    combineLatest([
      this.timetableStateService.timetableArtistNotification$,
      this.favoritesService.favorites$.pipe(map(favs => favs.find(fav => fav.entity === 'artist').ids))
    ]).pipe(
      // Skip first coming from local storage
      skip(1),
      take(1),
      filter(([artists, favoriteIds]) => !!artists && !!favoriteIds),
      map(([artists, favoriteIds]) => artists.filter(artist => favoriteIds.includes(artist.artistId))),
      tap(async artists => {
        // Cancel all notification
        this.localNotificationService.cancelAllNotifications();

        // Reschedule notificationns
        const notifications = await Promise.all(
          artists.map(async (artist, index) => {
            return this.localNotificationService.artistNotificationPayload(index, artist)
          })
        );

        if (notifications.length > 0) this.localNotificationService.schedule(notifications);
      })
    ).subscribe()
  }
}