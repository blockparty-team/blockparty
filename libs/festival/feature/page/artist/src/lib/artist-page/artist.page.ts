import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map, startWith } from 'rxjs/operators';
import { ArtistViewModel } from '@blockparty/festival/data-access/supabase';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArtistStateService } from '@blockparty/festival/data-access/state/artist';
import { ArtistCardComponent } from '@blockparty/festival/ui/artist-card';
import {
  CdkVirtualScrollViewport,
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
} from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonSearchbar,
  IonContent,
  IonSpinner,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-artist',
  styleUrls: ['./artist.page.scss'],
  templateUrl: './artist.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    ArtistCardComponent,
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonSearchbar,
    IonContent,
    IonSpinner,
  ],
})
export class ArtistPage {
  private artistStateService = inject(ArtistStateService);

  @ViewChild(IonSearchbar) searchElement!: IonSearchbar;

  searchTerm = new FormControl('');

  filteredArtists$: Observable<ArtistViewModel[]> = combineLatest([
    this.artistStateService.artists$,
    this.searchTerm.valueChanges.pipe(startWith('')),
  ]).pipe(
    debounceTime(100),
    filter(([artists, ,]) => !!artists),
    map(([artists, term]) =>
      artists
        .filter((artist) => artist.is_visible)
        .filter((artist) =>
          artist.name!.toLowerCase().includes(term!.toLowerCase()),
        ),
    ),
  );

  toggleFavorite(id: string): void {
    this.artistStateService.toggleArtistFavorite(id);
  }

  trackArtist(index: number, item: ArtistViewModel) {
    return item.id;
  }
}
