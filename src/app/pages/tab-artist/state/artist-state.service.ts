import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, concat, Observable } from 'rxjs';
import { map, pairwise, tap } from 'rxjs/operators'
import { Favorites } from '@app/interfaces/favorites';
import { DeviceStorageService } from '@app/services/device-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistStateService {

  private initialFavorites: Favorites = {
    artists: [],
    stages: [],
    assets: []
  }

  private _favorites$ = new BehaviorSubject<Favorites>(this.initialFavorites);
  favorites$: Observable<Favorites> = concat(
    this.deviceStorageService.get('favorites').pipe(tap(f => this._favorites$.next(f))),
    this._favorites$.asObservable(),
  )

  constructor(
    private deviceStorageService: DeviceStorageService
  ) { }

  toggleArtistsFavorites(id: string) {
    if (this._favorites$.value.artists.includes(id)) {

      const update = {
        ...this._favorites$.value,
        artists: this._favorites$.value.artists.filter(artistId => artistId !== id)
      }

      this._favorites$.next(update);
      this.deviceStorageService.set('favorites', update);
    } else {
      const update = {
        ...this._favorites$.value,
        artists: [...this._favorites$.value.artists, id]
      }

      this._favorites$.next(update);
      this.deviceStorageService.set('favorites', update);
    }
  }
}
