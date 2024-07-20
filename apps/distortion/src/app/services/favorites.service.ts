import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  concat,
  merge,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
  takeLast,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Favorite, FavoriteEntity } from '@blockparty/festival/types';
import { LocalNotificationsService } from '@blockparty/festival/service/local-notifications-service';
import { NotificationSchedulingService } from './notification-scheduling.service';
import { FavoriteStateService } from '@distortion/app/pages/favorite/state/favorite-state.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private localNotifications = inject(LocalNotificationsService);
  private notificationSchedulingService = inject(NotificationSchedulingService);
  private favoriteStateService = inject(FavoriteStateService);

  public favorites$ = this.favoriteStateService.favorites$;
  public artistFavoriteChanged$ =
    this.favoriteStateService.artistFavoriteChanged$;

  constructor() {
    // this.artistFavoriteChanged$.pipe(
    //   tap(d => this.notificationSchedulingService.toggleArtistNotification())
    //   ).subscribe();
  }

  scheduleNotification(): void { }

  removeNotification(artist_id: string): void {
    this.localNotifications
      .getNotificationIdFromArtistId(artist_id)
      .then((id) => this.localNotifications.cancelNotification(id));
    this.localNotifications.getAllNotifications();
  }

  createNotificationMessage(): void { }

  toggleFavorite(entity: FavoriteEntity, id: string) {
    this.favoriteStateService.toggleFavorite(entity, id);
    // this.notificationSchedulingService.toggleArtistNotification();
  }

  rescheduleAllNotifications(): void {
    this.notificationSchedulingService.rescheduleAllArtistNotifications();
  }
}
