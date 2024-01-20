import { inject, Injectable } from '@angular/core';
import { ArtistFavorite } from '@distortion/app/interfaces/artist';
import { Favorite, FavoriteEntity } from '@distortion/app/interfaces/database-entities';
import { DeviceStorageService } from '@distortion/app/services/device-storage.service';
import { DeviceService } from '@distortion/app/services/device.service';
import { SupabaseService } from '@shared/data-access/supabase';
import {
  BehaviorSubject,
  combineLatest,
  concat,
  Observable,
  ReplaySubject,
  Subject,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';

const initialState: Pick<Favorite, 'entity' | 'ids'>[] = [
  {
    entity: 'artist',
    ids: [],
  },
];

@Injectable({
  providedIn: 'root',
})
export class FavoriteStateService {
  private deviceStorageService = inject(DeviceStorageService);
  private deviceService = inject(DeviceService);
  private supabase = inject(SupabaseService);

  private _artistFavoriteChanged$ = new ReplaySubject<ArtistFavorite>();
  public artistFavoriteChanged$ = this._artistFavoriteChanged$.asObservable();

  private _favorites$ = new BehaviorSubject<Partial<Favorite>[]>(initialState);
  public favorites$: Observable<Favorite[]> = concat(
    this.deviceStorageService.get('favorites').pipe(
      filter((favorites) => !!favorites),
      tap((favorites) => this._favorites$.next(favorites))
    ),
    this._favorites$.asObservable()
  );

  public artistIds$ = this.favorites$.pipe(
    filter((favorites) => !!favorites),
    map((favorites) =>
      favorites.some((fav) => fav.entity === 'artist')
        ? favorites.find((favorite) => favorite.entity === 'artist').ids
        : []
    )
  );

  toggleFavorite(entity: FavoriteEntity, id: string) {
    let update: Partial<Favorite>[];
    let isFavorite: boolean;

    isFavorite = this._favorites$.value
      .find((favorite) => favorite.entity === entity)
      .ids?.includes(id);

    this.setArtistFavoriteStateChange(id, !isFavorite);

    if (this._favorites$.value.length === 0) {
      update = [{ entity, ids: [id] }];
    } else {
      update = this._favorites$.value.map((favorite) =>
        favorite.entity === entity
          ? {
              ...favorite,
              ids: favorite.ids.includes(id)
                ? favorite.ids.filter((ids) => ids !== id)
                : [...favorite.ids, id],
            }
          : favorite
      );
    }

    this._favorites$.next(update);
    this.deviceStorageService.set('favorites', update);

    const favoriteIds = update.find(
      (favorite) => favorite.entity === entity
    ).ids;

    this.deviceService.deviceId
      .pipe(
        switchMap((deviceId) => {
          return this.supabase.upsertFavorites(deviceId, 'artist', favoriteIds);
        })
      )
      .subscribe();
  }

  updateFavorites(update: Partial<Favorite[]>): void {
    this._favorites$.next(update);
  }

  setArtistFavoriteStateChange(artistId: string, isFavorite: boolean): void {
    this._artistFavoriteChanged$.next({
      artistId: artistId,
      isFavorite: isFavorite,
    });
    // this._artistFavoriteChanged$.subscribe(d => console.log(d));
  }

  getFavoriteState(entity: FavoriteEntity, id: string): boolean {
    return this._favorites$.value
      .find((favorite) => favorite.entity === entity)
      .ids.includes(id);
  }
}
