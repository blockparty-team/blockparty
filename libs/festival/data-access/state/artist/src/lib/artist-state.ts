import { inject, Injectable } from '@angular/core';
import { ArtistSharedStateService } from '@blockparty/festival/data-access/state/artist-shared';
import { FavoriteStateService } from '@blockparty/festival/data-access/state/favorite';

@Injectable({
  providedIn: 'root',
})
export class ArtistStateService {
  private artistSharedStateService = inject(ArtistSharedStateService);
  private favoriteStateService = inject(FavoriteStateService);

  public artists$ = this.artistSharedStateService.artists$;

  public toggleArtistFavorite(id: string): void {
    this.favoriteStateService.toggleFavorite('artist', id);
  }
}
