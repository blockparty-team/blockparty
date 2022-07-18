import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { pathToImageUrl } from '@app/shared/utils';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { StoreService } from '@app/store/store.service';
import { debounceTime, filter, map, startWith, tap } from 'rxjs/operators';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { FormControl } from '@angular/forms';
import { ArtistStateService } from './state/artist-state.service';
import { Favorites } from '@app/interfaces/favorites';

interface GroupedArtists {
  letter: string;
  artists: ArtistWithRelations[];
}

@Component({
  selector: 'app-tab-artist',
  templateUrl: './tab-artist.page.html',
  styleUrls: ['./tab-artist.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabArtistPage implements OnInit {

  groupedArtists$: Observable<GroupedArtists[]>;
  favorites$: Observable<Favorites>;
  showSearch$ = new BehaviorSubject(false);
  showFavorites$ = new BehaviorSubject(false);

  searchTerm = new FormControl('');

  constructor(
    private store: StoreService,
    private artistStateService: ArtistStateService
  ) { }

  ngOnInit() {

    this.favorites$ = this.artistStateService.favorites$

    const filteredArtists$ = combineLatest([
      this.store.artists$,
      this.searchTerm.valueChanges.pipe(startWith('')),
      this.showFavorites$,
      this.artistStateService.favorites$
    ]).pipe(
      debounceTime(100),
      map(([artists, term, showFavorites, favorites]) => {
        if (showFavorites) {
          return artists.filter(artist => favorites.artists.includes(artist.id))
        }
        return artists.filter(artist => artist.name.toLowerCase().includes(term.toLowerCase()))
      }),
    );

    this.groupedArtists$ = filteredArtists$.pipe(
      map(artists => {
        return artists.reduce((acc: GroupedArtists[], artist) => {

          const letter = artist.name[0].toUpperCase();

          if (acc.find(group => group.letter === letter) === undefined) {
            acc.push({ letter, artists: [] })
          };

          acc.find(group => group.letter == letter).artists.push(artist);

          return acc;
        }, [])
      })
    );
  }

  toggleSearch(): void {
    this.showSearch$.next(!this.showSearch$.value)

    // reset filter when search is removed
    if (!this.showSearch$.value) {
      this.searchTerm.setValue('')
    }
  }

  addRemoveFavorites(id: string): void {
    this.artistStateService.toggleArtistsFavorites(id);
  }

  toggleFavorites(): void {
    this.showFavorites$.next(!this.showFavorites$.value)
  }

  isFavorite(id: string, favorites: string[]): boolean {
    return favorites.includes(id);
  }

  imgUrl(path: string): string {
    return path ? pathToImageUrl(path) : 'assets/distortion_logo.png';
  }

}
