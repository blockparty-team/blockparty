import { Injectable } from '@angular/core';
import { Favorites } from '@app/interfaces/favorites';
import { BehaviorSubject, concat, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DeviceStorageService } from './device-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private initialFavorites: Favorites = {
    artists: [],
    stages: [],
    assets: []
  }

  private _favorites$ = new BehaviorSubject<Favorites>(this.initialFavorites);
  
  public favorites$: Observable<Favorites> = concat(
    this.deviceStorageService.get('favorites').pipe(
      tap(favorites => {
        if (favorites) this._favorites$.next(favorites);
      })
    ),
    this._favorites$.asObservable(),
  )

  constructor(
    private deviceStorageService: DeviceStorageService
  ) { }

  toggleFavorite(type: keyof Favorites, id: string) {
    if (this._favorites$.value[type].includes(id)) {

      const update = {
        ...this._favorites$.value,
        artists: this._favorites$.value[type].filter(typeId => typeId !== id)
      }

      this._favorites$.next(update);
      this.deviceStorageService.set('favorites', update);
    } else {
      const update = {
        ...this._favorites$.value,
        [type]: [...this._favorites$.value[type], id]
      }

      this._favorites$.next(update);
      this.deviceStorageService.set('favorites', update);
    }
  }

  isFavorite(type: keyof Favorites, id: string): boolean {
    return this._favorites$.value[type].includes(id);
  }
}
