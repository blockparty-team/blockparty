import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Favorites } from '@app/interfaces/favorites';

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
  favorites$: Observable<Favorites> = this._favorites$.asObservable();

  constructor() { }

  toggleArtistsFavorites(id: string) {
    if (this._favorites$.value.artists.includes(id)) {
      this._favorites$.next({
        ...this._favorites$.value,
        artists: this._favorites$.value.artists.filter(artistId => artistId !== id)
      });
    } else {
      this._favorites$.next({
        ...this._favorites$.value,
        artists: [...this._favorites$.value.artists, id]
      });
    }
  }
}
