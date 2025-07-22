import { inject, Injectable } from '@angular/core';
import { combineLatest, concat, Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ArtistViewModel } from '@blockparty/festival/shared/types';
import {
  SupabaseService,
  getBucketAndPath,
} from '@blockparty/festival/data-access/supabase';
import { DeviceStorageService } from '@blockparty/shared/data-access/device-storage';
import { FileService } from '@blockparty/festival/data-access/file-service';
import { FavoriteStateService } from '@blockparty/festival/data-access/state/favorite';
import { RefreshService } from '@blockparty/festival/shared/service/refresh';

@Injectable({
  providedIn: 'root',
})
export class ArtistSharedStateService {
  private deviceStorageService = inject(DeviceStorageService);
  private supabase = inject(SupabaseService);
  private favoriteStateService = inject(FavoriteStateService);
  private fileService = inject(FileService);
  private refreshService = inject(RefreshService);

  private _artists$: Observable<ArtistViewModel[]> =
    this.refreshService.reloadData$.pipe(
      switchMap(() =>
        concat(
          this.deviceStorageService
            .get('artists')
            .pipe(filter((artists) => !!artists)),
          this.supabase.artists$.pipe(
            filter((artists) => !!artists),
            tap((artists) => this.deviceStorageService.set('artists', artists)),
          ),
        ),
      ),
      shareReplay(1),
    );

  // Enriched artist with favorite status and img/srcset
  artists$: Observable<ArtistViewModel[]> = combineLatest([
    this._artists$,
    this.favoriteStateService.artistIds$,
  ]).pipe(
    filter(([artists, favoriteArtistIds]) => !!artists && !!favoriteArtistIds),
    map(([artists, favoriteArtistIds]) =>
      artists.map((artist) => {
        const [bucket, path] = getBucketAndPath(artist.storage_path!);
        const imgUrl =
          bucket && path
            ? this.supabase.publicImageUrl(bucket, path)
            : 'assets/distortion_logo.png';

        const srcset =
          bucket && path
            ? this.fileService.imageSrcset(bucket, path)
            : 'assets/distortion_logo.png';

        const isFavorite = favoriteArtistIds.includes(artist.id!);

        return {
          ...artist,
          imgUrl,
          srcset,
          isFavorite,
        };
      }),
    ),
    // Mainly to ensure shared favorites state across the app
    shareReplay(1),
  );
}
