import { inject, Injectable } from '@angular/core';
import { FavoritesService } from '@app/services/favorites.service';
import { ArtistSharedStateService } from './artist-shared-state.service';
import { Observable } from 'rxjs';
import { SimilarArtist } from '@app/interfaces/artist';


@Injectable({
  providedIn: 'root'
})
export class ArtistStateService {

  private artistSharedStateService = inject(ArtistSharedStateService);
  private favoritesService = inject(FavoritesService);

  public artists$ = this.artistSharedStateService.artists$;

  public toggleArtistFavorite(id: string): void {
    this.favoritesService.toggleFavorite('artist', id);
  }

  public similarArtists(artistId: string): Observable<SimilarArtist[]> {
    return this.artistSharedStateService.similarArtists(artistId);
  }
}
