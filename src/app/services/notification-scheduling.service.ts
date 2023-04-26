import { Injectable, inject } from "@angular/core";
import { TimetableStateService } from "@app/pages/timetable/state/timetable-state.service";
import { FavoritesService } from "@app/services/favorites.service";
import { combineLatest } from "rxjs";
import { map, skip, take, tap } from "rxjs/operators";
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
      this.favoritesService.favorites$.pipe(map(favs => favs.find(fav => fav.entity === 'artist')))
    ]).pipe(
      // Skip first coming from local storage
      skip(1),
      take(1),
      map(([artists, favorites]) => artists.filter(artist => favorites.ids.includes(artist.artistId))),
      tap(async artists => {
        // Cancel all notification
        this.localNotificationService.cancelAllNotifications();

        // Reschedule notificationns
        const notifications = await Promise.all(
          artists.map(async artist => {
            const id = await this.localNotificationService.getNextId();
            return this.localNotificationService.artistNotificationPayload(artist, id)
          })
        );

        this.localNotificationService.schedule(notifications);
      })
    ).subscribe()
  }
}