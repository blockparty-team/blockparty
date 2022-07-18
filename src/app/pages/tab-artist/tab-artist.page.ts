import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { pathToImageUrl } from '@app/shared/utils';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { StoreService } from '@app/store/store.service';
import { debounceTime, filter, map, startWith, tap } from 'rxjs/operators';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { FormControl } from '@angular/forms';
import { ArtistStateService } from './state/artist-state.service';

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
  showSearch$ = new BehaviorSubject(false);
  showFavorites$ = new BehaviorSubject(false);

  searchTerm = new FormControl('');

  constructor(
    private store: StoreService,
    private artistStateService: ArtistStateService
  ) { }

  ngOnInit() {

    const searchTerm$ = this.searchTerm.valueChanges.pipe(startWith(''))
    const favorites$ = this.artistStateService.favourites$
    const filteredArtists$ = combineLatest([
      this.store.artists$,
      searchTerm$
    ]).pipe(
      debounceTime(100),
      map(([artists, term]) => {
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
  }

  toggleFavorites(): void {
    this.showFavorites$.next(!this.showFavorites$.value)
  }

  imgUrl(path: string): string {
    return path ? pathToImageUrl(path) : 'assets/distortion_logo.png';
  }

}
