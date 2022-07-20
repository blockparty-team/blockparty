import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { pathToImageUrl } from '@app/shared/utils';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { StoreService } from '@app/store/store.service';
import { debounceTime, filter, map, startWith, tap } from 'rxjs/operators';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { FormControl } from '@angular/forms';
import { ArtistStateService } from './state/artist-state.service';
import { Favorites } from '@app/interfaces/favorites';
import { MenuController } from '@ionic/angular';

interface GroupedArtists {
  letter: string;
  artists: ArtistWithRelations[];
}

@Component({
  selector: 'app-tab-artist',
  styleUrls: ['./tab-artist.page.scss'],
  templateUrl: './tab-artist.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabArtistPage implements OnInit {

  groupedArtists$: Observable<GroupedArtists[]>;
  favoriteArtists$: Observable<ArtistWithRelations[]>;
  favorites$: Observable<Favorites>;
  showSearch$ = new BehaviorSubject(false);

  searchTerm = new FormControl('');
  @ViewChild('search') searchElement: any;

  constructor(
    private store: StoreService,
    private artistStateService: ArtistStateService,
    private menu: MenuController
  ) { }

  ngOnInit() {

    this.favorites$ = this.artistStateService.favorites$;

    this.favoriteArtists$ = combineLatest([
      this.store.artists$,
      this.artistStateService.favorites$,
    ]).pipe(
      map(([artists, favorites]) => artists.filter(artist => favorites.artists.includes(artist.id)))
    )

    const filteredArtists$ = combineLatest([
      this.store.artists$,
      this.searchTerm.valueChanges.pipe(startWith(''))
    ]).pipe(
      debounceTime(100),
      filter(([artists, ]) => !!artists),
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

    // reset filter when search is removed and focus if shown
    if (!this.showSearch$.value) {
      this.searchTerm.setValue('');
    } else {
      setTimeout(() => {
        this.searchElement.setFocus();
      }, 150);
    }
  }

  toggleFavorites(): void {
    this.menu.toggle('end');
  }

  addRemoveFavorites(id: string): void {
    this.artistStateService.toggleArtistsFavorites(id);
  }

  isFavorite(id: string): boolean {
    return this.artistStateService.isFavorite(id);
  }

  imgUrl(path: string): string {
    return path ? pathToImageUrl(path) : 'assets/distortion_logo.png';
  }

  trackItems(index: number, item: GroupedArtists) {
    return item.letter;
  }
}
