import { Injectable } from '@angular/core';
import { combineLatest, concat, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, tap } from 'rxjs/operators';
import { ArtistViewModel } from '@app/interfaces/artist';
import { FavoritesService } from '@app/services/favorites.service';
import { SupabaseService } from '@app/services/supabase.service';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { getBucketAndPath } from '@app/shared/functions/storage';
import { FileService } from '@app/services/file.service';
import { FavoriteStateService } from '@app/pages/favorite/state/favorite-state.service';


@Injectable({
  providedIn: 'root'
})
export class ArtistStateService {

  private _artists$: Observable<ArtistViewModel[]> = concat(
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

  // Enriched artist with favorite status and img/srcset
  artists$: Observable<ArtistViewModel[]> = combineLatest([
    this._artists$,
    this.favoriteStateService.artistIds$
  ]).pipe(
    filter(([artists, favoriteArtistIds]) => !!artists && !!favoriteArtistIds),
    map(([artists, favoriteArtistIds]) => artists.map(artist => {

      const [bucket, path] = getBucketAndPath(artist.storage_path);

      const srcset = bucket && path
        ? this.fileService.imageSrcset(bucket, path)
        : 'assets/distortion_logo.png';

      return {
        ...artist,
        imgUrl: bucket && path
          ? this.supabase.publicImageUrl(bucket, path)
          : 'assets/distortion_logo.png',
        srcset,
        // Favorites only exists if user added artists to favorites
        isFavorite: favoriteArtistIds.includes(artist.id)
      };
    })),
    distinctUntilChanged(),
    shareReplay(1)
  )

  constructor(
    private supabase: SupabaseService,
    private deviceStorageService: DeviceStorageService,
    private favoritesService: FavoritesService,
    private favoriteStateService: FavoriteStateService,
    private fileService: FileService
  ) { }

  public toggleArtistFavorite(id: string): void {
    this.favoritesService.toggleFavorite('artist', id);
  }
}
