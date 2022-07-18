import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Favorites } from '@app/interfaces/favorites';

@Injectable({
  providedIn: 'root'
})
export class ArtistStateService {

  private _favourites$ = new BehaviorSubject<Favorites>(null);
  favourites$: Observable<Favorites> = this._favourites$.asObservable();

  constructor() { }
}
