import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { Favorites } from '@app/interfaces/favorites';
import { definitions } from '@app/interfaces/supabase';
import { SupabaseService } from '@app/services/supabase.service';
import { pathToImageUrl } from '@app/shared/utils';
import { StoreService } from '@app/store/store.service';
import { Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ArtistStateService } from '../tab-artist/state/artist-state.service';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.page.html',
  styleUrls: ['./artist-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistDetailPage implements OnInit {

  artist$: Observable<ArtistWithRelations> = this.activatedRoute.paramMap.pipe(
    map(paramMap => paramMap.get('id')),
    switchMap(id => this.store.artists$.pipe(
      map(artists => artists.find(artist => artist.id === id))
    ))
  );

  favorites$: Observable<Favorites>;


  constructor(
    private activatedRoute: ActivatedRoute,
    private store: StoreService,
    private artistStateService: ArtistStateService
  ) { }

  ngOnInit() {
    this.favorites$ = this.artistStateService.favorites$
  }

  imgUrl(path: string): string {
    return path ? pathToImageUrl(path) : 'assets/distortion_logo.png';
  }

  addRemoveFavorites(id: string): void {
    console.log('OI', id)
    this.artistStateService.toggleArtistsFavorites(id);
  }

  isFavorite(id: string, favorites: string[]): boolean {
    return favorites.includes(id);
  }

}
