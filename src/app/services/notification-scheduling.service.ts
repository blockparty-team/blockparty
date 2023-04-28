import { Injectable, inject } from "@angular/core";
import { TimetableStateService } from "@app/pages/timetable/state/timetable-state.service";
import { FavoritesService } from "@app/services/favorites.service";
import { combineLatest } from "rxjs";
import { filter, map, skip, take, tap } from "rxjs/operators";
import { LocalNotificationsService } from "./local-notifications.service";
import { sub } from 'date-fns'

@Injectable({
  providedIn: 'root'
})
export class NotificationSchedulingService {

  // Later this could retrieved from settings state
  private MINUTES_BEFORE = 60;

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
      tap(artists => {
        // Cancel all notifications
        this.localNotificationService.cancelAllNotifications(this.MINUTES_BEFORE);

        // Reschedule notifications
        const now = new Date();
        const notifications = artists
          .map((artist, index) => this.localNotificationService.artistNotificationPayload(index, artist, this.MINUTES_BEFORE))
          .filter(n => sub(n.schedule.at, { minutes: this.MINUTES_BEFORE }) >= now);

        if (notifications.length > 0) this.localNotificationService.schedule(notifications);
      })
    ).subscribe()
  }
}