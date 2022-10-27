import { Injectable } from '@angular/core';
import { Favorite, FavoriteEntity } from '@app/interfaces/database-entities';
// import { Favorites } from '@app/interfaces/favorites';
// import { StoreService } from '@app/store/store.service';
import { BehaviorSubject, combineLatest, concat, Observable } from 'rxjs';
import { filter, mapTo, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { DeviceStorageService } from './device-storage.service';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private initialFavorites: Partial<Favorite>[] = [
    {
      entity: 'artist',
      ids: []
    }
  ]

  private _favorites$ = new BehaviorSubject<Partial<Favorite>[]>(this.initialFavorites);

  public favorites$: Observable<Partial<Favorite>[]> = concat(
    this.deviceStorageService.get('favorites').pipe(
      tap(favorites => {
        if (favorites) this._favorites$.next(favorites);
      })
    ),
    this._favorites$.asObservable(),
  )

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
    )

    this._favorites$.next(update);
    this.deviceStorageService.set('favorites', update);

    // Todo move this sideeffect
    this.authService.authenticated$.pipe(
      filter(auth => auth),
      mapTo(this._favorites$.value.find(favorite => favorite.entity === entity).id),
      tap(favoriteId => {

        if (favoriteId) {
          this.supabase.upsertFavorites(
            favoriteId,
            entity,
            this._favorites$.value.find(favorite => favorite.entity === entity).ids
          ).subscribe(favorites => {
            this._favorites$.next(favorites)
          });
        } else {
          this.supabase.addFavorites(
            entity, this._favorites$.value.find(favorite => favorite.entity === entity).ids
          ).subscribe(favorites => {
            this._favorites$.next(favorites)
          })
        }
      })

    ).subscribe()
  }

  isFavorite(entity: FavoriteEntity, id: string): boolean {
    return this._favorites$.value
      .find(favorite => favorite.entity === entity).ids
      .includes(id);
  }
}
