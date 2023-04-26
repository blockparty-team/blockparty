import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, concat, merge } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Favorite, FavoriteEntity } from '@app/interfaces/database-entities';
import { DeviceStorageService } from './device-storage.service';
import { SupabaseService } from './supabase.service';
import { DeviceService } from './device.service';
import { LocalNotificationsService } from './local-notifications.service';
import { TimetableStateService } from '@app/pages/timetable/state/timetable-state.service';
import { ArtistFavorite } from '@app/interfaces/artist';

const initialState: Pick<Favorite, 'entity' | 'ids'>[] = [
  {
    entity: 'artist',
    ids: []
  }
]

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  // private timetableService = inject(TimetableStateService);
  private deviceStorageService = inject(DeviceStorageService);
  private deviceService = inject(DeviceService);
  private supabase = inject(SupabaseService);
  private localNotifications = inject(LocalNotificationsService);
  

  private _artistFavoriteChanged$ = new Subject<ArtistFavorite>();
  public artistFavoriteChanged$ = this._artistFavoriteChanged$.asObservable();

  private _favorites$ = new BehaviorSubject<Partial<Favorite>[]>(initialState);
  public favorites$: Observable<Favorite[]> = concat(
    this.deviceStorageService.get('favorites').pipe(
      filter(favorites => !!favorites),
      tap(favorites => this._favorites$.next(favorites))
    ),
    this._favorites$.asObservable(),
  )

  public artistIds$ = this.favorites$.pipe(
    filter(favorites => !!favorites),
    map(favorites => favorites.some(fav => fav.entity === 'artist')
      ? favorites.find(favorite => favorite.entity === 'artist').ids
      : []
    )
  );

  scheduleNotification(): void {

  }

  removeNotification(artist_id: string): void {
    this.localNotifications.getNotificationIdFromArtistId(artist_id).then(id => 
      this.localNotifications.cancelNotification(id))

  } 

  createNotificationMessage(): void {
    
  }

  toggleFavorite(entity: FavoriteEntity, id: string) {

    let update: Partial<Favorite>[];
    let isFavorite: boolean;

    isFavorite = this._favorites$.value.find(favorite => favorite.entity === entity).ids?.includes(id);
    this._artistFavoriteChanged$.next({"artist_id": id, isFavorite: !isFavorite})  

    // let message = this.createNotificationMessage();
    // this.localNotifications.scheduleNotification("1", "HEY", new Date(Date.now()+ 15000));
    if (this._favorites$.value.length === 0) {
      update = [{ entity, ids: [id] }];
    } else {
      update = this._favorites$.value.map(favorite => favorite.entity === entity
        ? {
          ...favorite,
          ids: favorite.ids.includes(id)
            ? favorite.ids.filter(ids => ids !== id)
            : [...favorite.ids, id]
        }
        : favorite
        );
    }

    this._favorites$.next(update);
    this.deviceStorageService.set('favorites', update);

    const favoriteIds = update.find(favorite => favorite.entity === entity).ids;

    this.deviceService.deviceId.pipe(
      switchMap(deviceId => {
        return this.supabase.upsertFavorites(
          deviceId,
          'artist',
          favoriteIds,
        )
      })
    ).subscribe()

    this.artistFavoriteChanged$.pipe(
      map(artistFavorite => {
        console.log(artistFavorite);
      })
    ).subscribe()
  }

  isFavorite(entity: FavoriteEntity, id: string): boolean {
    return this._favorites$.value
      .find(favorite => favorite.entity === entity).ids
      .includes(id);
  }

}
