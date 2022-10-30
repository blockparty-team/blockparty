import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map, startWith } from 'rxjs/operators';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { FormControl } from '@angular/forms';
import { ArtistStateService } from './state/artist-state.service';
import { MenuController } from '@ionic/angular';


interface DayGroupedFavorites {
  day: { name: string, day: string };
  artists: ArtistWithRelations[];
}

@Component({
  selector: 'app-artist',
  styleUrls: ['./artist.page.scss'],
  templateUrl: './artist.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistPage implements OnInit {

  filteredArtists$: Observable<ArtistWithRelations[]>;
  favoriteArtists$: Observable<ArtistWithRelations[]>;
  dayGroupedFavorites$: Observable<DayGroupedFavorites[]>;
  showSearch$ = new BehaviorSubject(false);

  private _showDayGroupedFavorites$ = new BehaviorSubject<boolean>(true);
  showDayGroupedFavorites$: Observable<boolean> = this._showDayGroupedFavorites$.asObservable();

  searchTerm = new FormControl('');
  @ViewChild('search') searchElement: any;

  constructor(
    private artistStateService: ArtistStateService,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.filteredArtists$ = combineLatest([
      this.artistStateService.artistsWithFavorites$,
      this.searchTerm.valueChanges.pipe(startWith('')),
    ]).pipe(
      debounceTime(100),
      filter(([artists, ,]) => !!artists),
      map(([artists, term]) => artists
        .filter(artist => artist.name.toLowerCase()
          .includes(term.toLowerCase())
        )
      )
    );

    this.favoriteArtists$ = this.artistStateService.artistsWithFavorites$.pipe(
      map(artists => artists.filter(artist => artist.isFavorite))
    );

    this.dayGroupedFavorites$ = this.favoriteArtists$.pipe(
      map(artists => {
        return artists
          .reduce((acc: DayGroupedFavorites[], artist) => {

            // TODO: Artists playing multible days will only appear once
            // If artist is not assigned to timetable show TBA - future day is for sorting last
            const day = artist.timetable[0]?.day ?
              artist.timetable[0].day :
              { name: 'TBA', day: '2070-01-01' };

            if (acc.find(group => group.day.name === day.name) === undefined) {
              acc.push({ day, artists: [] })
            };

            acc.find(group => group.day.name == day.name).artists.push(artist);

            acc.forEach(group => {
              group.artists
                .sort((a, b) => (
                  new Date(a.timetable[0]?.start_time).getTime() -
                  new Date(b.timetable[0]?.start_time).getTime()
                ))
            })

            return acc;
          }, [])
          .sort((a, b) => new Date(a.day.day).getTime() - new Date(b.day.day).getTime())
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

  toggleFavoritesSideBar(): void {
    this.menu.toggle('end');
  }

  toggleFavorite(id: string): void {
    this.artistStateService.toggleArtistFavorite(id);
  }

  toggleDayGroupedFavorites(): void {
    this._showDayGroupedFavorites$.next(!this._showDayGroupedFavorites$.value);
  }

  trackArtist(index: number, item: ArtistWithRelations) {
    return item.id;
  }

  trackDay(index: number, item: DayGroupedFavorites) {
    return item.day.day;
  }
}
