import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map, startWith } from 'rxjs/operators';
import { ArtistViewModel } from '@blockparty/festival/shared/types';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArtistStateService } from '@blockparty/festival/data-access/state/artist';
import { ArtistCardComponent } from './artist-card/artist-card.component';
import {
  CdkVirtualScrollViewport,
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
} from '@angular/cdk/scrolling';
import { NgIf, AsyncPipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonSearchbar,
  IonContent,
  IonSpinner,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-artist',
  styleUrls: ['./artist.page.scss'],
  templateUrl: './artist.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    ArtistCardComponent,
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonSearchbar,
    IonContent,
    IonSpinner,
  ],
})
export class ArtistPage {
  private artistStateService = inject(ArtistStateService);

  @ViewChild(IonSearchbar) searchElement: IonSearchbar;

  showSearch$ = new BehaviorSubject(false);

  searchTerm = new FormControl('');

  filteredArtists$: Observable<ArtistViewModel[]> = combineLatest([
    this.artistStateService.artists$,
    this.searchTerm.valueChanges.pipe(startWith('')),
  ]).pipe(
    debounceTime(100),
    filter(([artists, ,]) => !!artists),
    map(([artists, term]) =>
      artists
        // Only show visible artist but include all on search
        .filter((artist) => (!!term ? true : artist.is_visible))
        .filter((artist) =>
          artist.name.toLowerCase().includes(term.toLowerCase()),
        ),
    ),
  );

  toggleSearch(): void {
    this.showSearch$.next(!this.showSearch$.value);

    // reset filter when search is removed and focus if shown
    if (!this.showSearch$.value) {
      this.searchTerm.setValue('');
    } else {
      setTimeout(() => {
        this.searchElement.setFocus();
      }, 150);
    }
  }

  toggleFavorite(id: string): void {
    this.artistStateService.toggleArtistFavorite(id);
  }

  trackArtist(index: number, item: ArtistViewModel) {
    return item.id;
  }
}
