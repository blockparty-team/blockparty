import { Injectable } from '@angular/core';
import { Favorite, FavoriteEntity } from '@app/interfaces/database-entities';
// import { Favorites } from '@app/interfaces/favorites';
// import { StoreService } from '@app/store/store.service';
import { BehaviorSubject, combineLatest, concat, iif, merge, Observable, of, Subject } from 'rxjs';
import { delay, distinctUntilChanged, filter, first, map, mapTo, mergeMap, scan, share, shareReplay, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { DeviceStorageService } from './device-storage.service';
import { SupabaseService } from './supabase.service';

type ToggledFavoritePayload = { entity: FavoriteEntity, id: string }

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private _favorites$ = new BehaviorSubject<Partial<Favorite>[]>([]);

  // Only fetch favorites from Supabase if authenticated
  private supaFavorites$ = this.authService.authenticated$.pipe(
    switchMap(favorites =>
      iif(() => favorites, this.supabase.favorites$, of([]))
    ),
    shareReplay(1)
  );

  private localFavorites$: Observable<Partial<Favorite>[]> = this.deviceStorageService.get('favorites')
    .pipe(
      map((favs: Partial<Favorite>[]) => favs ? favs : [])
    );

  // Favorites from Local Storage and Supabase are merged depending on
  // the two states. If favorites are stored in both Local Storage and 
  // Supabase the union of favorites is returned. This is done to make
  // sure that the user doesn't lose any added favorites when loggin in/out.
  private unionedFavorites$ = combineLatest([
    this.supaFavorites$,
    this.localFavorites$
  ]).pipe(
    map(([supaFavs, localFavs]) => {

      if (localFavs.length > 0 && supaFavs.length === 0) {
        return localFavs;
      }

      if (localFavs.length === 0 && supaFavs.length > 0) {
        return supaFavs;
      }

      if (localFavs.length > 0 && supaFavs.length > 0) {
        // TODO: This might not cover if multible enities can be favorites
        return supaFavs.map(supaFav => ({
          ...supaFav,
          ids: [...new Set([
            ...supaFav.ids,
            ...localFavs.find(localFav => localFav.entity === supaFav.entity)
              ? localFavs.find(localFav => localFav.entity === localFav.entity).ids
              : []
          ])]
        }));
      }

      return [];
    }),
    tap(unionFavorites => {
      this._favorites$.next(unionFavorites);
      this.deviceStorageService.set('favorites', unionFavorites);
    })
  )

  // Start with Local Storage favorites to give user immediate UI update
  public favorites$: Observable<Partial<Favorite>[]> = merge(
    this.localFavorites$,
    this.unionedFavorites$,
    this._favorites$.asObservable()
  );

  public artistIds$ = this.favorites$.pipe(
    filter(favorites => !!favorites),
    map(favorites => favorites.some(fav => fav.entity === 'artist')
      ? favorites.find(favorite => favorite.entity === 'artist').ids
      : []
    )
  );

  constructor(
    private deviceStorageService: DeviceStorageService,
    private authService: AuthService,
    private supabase: SupabaseService,
  ) { }

  toggleFavorite(entity: FavoriteEntity, id: string) {

    const update = this._favorites$.value.map(favorite => favorite.entity === entity
      ? {
        ...favorite,
        ids: favorite.ids.includes(id)
          ? favorite.ids.filter(ids => ids !== id)
          : [...favorite.ids, id]
      }
      : favorite
    );

    this._favorites$.next(update);
    this.deviceStorageService.set('favorites', update);

    this.authService.authenticated$.pipe(
      first(),
      filter(authenticated => authenticated),
      switchMap(() => this.supabase.upsertFavorites(
        'artist',
        update.find(favorite => favorite.entity === entity).ids
      ))
    ).subscribe()
  }

  isFavorite(entity: FavoriteEntity, id: string): boolean {
    return this._favorites$.value
      .find(favorite => favorite.entity === entity).ids
      .includes(id);
  }

}
