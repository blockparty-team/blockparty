import { Injectable, inject } from "@angular/core";
import { TimetableStateService } from "@app/pages/timetable/state/timetable-state.service";
import { FavoritesService } from "@app/services/favorites.service";
import { combineLatest } from "rxjs";
import { last, map, skip, take, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NotificationSchedulingService {

  private timetableStateService = inject(TimetableStateService);
  private favoritesService = inject(FavoritesService);

  rescheduleAllArtistNotifications() {
    combineLatest([
      this.timetableStateService.timetableArtistNotification$,
      this.favoritesService.favorites$.pipe(map(favs => favs.find(fav => fav.entity === 'artist')))
    ]).pipe(
      // Skip first coming from local storage
      skip(1),
      take(1),
      map(([artists, favorites]) => artists.filter(artist => favorites.ids.includes(artist.artistId))),
      tap(artists => {
        // Delete exsiting notification

        // Reschedule 
        artists.forEach(artist => {
          console.log(artist)
        })
      })
    ).subscribe()
  }
}