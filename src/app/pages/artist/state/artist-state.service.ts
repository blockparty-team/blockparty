import { Injectable } from '@angular/core';
import { combineLatest, concat, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, tap } from 'rxjs/operators';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { FavoritesService } from '@app/services/favorites.service';
import { pathToImageUrl } from '@app/shared/utils';
import { SupabaseService } from '@app/services/supabase.service';
import { DeviceStorageService } from '@app/services/device-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistStateService {

  artists$: Observable<ArtistWithRelations[]> = concat(
    this.deviceStorageService.get('artists').pipe(
      filter(artists => !!artists)
    ),
    this.supabase.artists$.pipe(
      filter(artists => !!artists),
      tap(artists => this.deviceStorageService.set('artists', artists))
    )
  ).pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  artistsWithFavorites$: Observable<ArtistWithRelations[]> = combineLatest([
    this.artists$,
    this.favoritesService.favorites$
  ]).pipe(
    filter(([artists, favorites]) => !!artists && !!favorites ),
    map(([artists, favorites]) => artists.map(artist => ({
      ...artist,
      imgUrl: this.imgUrl(artist.storage_path),
      // Favorites only exists if user added artists to favorites
      isFavorite: favorites
        .find(favorite => favorite.entity === 'artist').ids
        .includes(artist.id)
    }))),
    distinctUntilChanged(),
    shareReplay()
  )

  constructor(
    private supabase: SupabaseService,
    private deviceStorageService: DeviceStorageService,
    private favoritesService: FavoritesService,
  ) { }

  public toggleArtistFavorite(id: string): void {
    this.favoritesService.toggleFavorite('artist', id);
  }

  private imgUrl(path: string): string {
    // TODO don't use hard coded fall back logo 
    return path ? pathToImageUrl(path) : 'assets/distortion_logo.png';
  }
}
