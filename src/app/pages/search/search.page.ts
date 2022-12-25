import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EntityDistanceSearchResult, EntityFreeTextSearchResult } from '@app/interfaces/entity-search-result';
import { MapService } from '@app/services/map.service';
import { SearchService } from '@app/services/search.service';
import { getBucketAndPath } from '@app/shared/functions/storage';
import { IonSearchbar } from '@ionic/angular';
import { SegmentCustomEvent } from '@ionic/core';
import { Point } from 'geojson';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { SupabaseService } from '../../services/supabase.service';
import { ArtistStateService } from '../artist/state/artist-state.service';

enum Entity {
  artist = 'artist',
  stage = 'stage',
  asset = 'asset'
}

enum EntityBadgeColor {
  artist = 'primary',
  stage = 'secondary',
  asset = 'tertiary'
}

enum SearchMode {
  FreeText = 'FREE_TEXT',
  NearBy = 'NEAR_BY'
}

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPage implements OnInit {

  searchTerm = new FormControl('');
  @ViewChild('search') searchElement: IonSearchbar;

  entity = Entity;
  searchMode = SearchMode;
  badgeColor = EntityBadgeColor;

  private _selectedSearchMode$ = new BehaviorSubject<SearchMode>(SearchMode.FreeText);
  selectedSearchMode$: Observable<SearchMode> = this._selectedSearchMode$.asObservable();

  searchResults$: Observable<EntityFreeTextSearchResult[]>;
  nearBy$: Observable<EntityDistanceSearchResult[]>;

  constructor(
    private router: Router,
    private supabase: SupabaseService,
    private searchService: SearchService,
    private mapService: MapService,
    private artistSateService: ArtistStateService,
  ) { }

  ngOnInit() {
    this.searchResults$ = this.searchTerm.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.supabase.textSearch(term)),
      withLatestFrom(this.artistSateService.artists$),
      map(([results, artists]) => results.map(result => {
        return result.entity === Entity.artist ? 
          { ...result, artist: artists.find(artist => artist.id === result.id) } :
          result
      
      }))
    );

    this.nearBy$ = combineLatest([
      this.searchService.nearBy$,
      this._selectedSearchMode$
    ]).pipe(
      filter(([, mode]) => mode === SearchMode.NearBy),
      map(([nearBy,]) => nearBy)
    );
  }

  ionViewDidEnter(): void {
    setTimeout(() => {
      this.searchElement.setFocus();
    }, 150);
  }

  imgUrl(path: string): string {
    const [bucket, p] = getBucketAndPath(path)
    return bucket && p ? this.supabase.publicImageUrl(bucket, p) : 'assets/distortion_logo.png';
  }

  onSearchModeChange(ev: Event): void {
    this._selectedSearchMode$.next(
      (ev as SegmentCustomEvent).detail.value as SearchMode
    )
  }

  onShowOnMap(geom: Point) {
    this.router.navigate(['tabs', 'map']);
    this.mapService.flyTo(geom.coordinates as [number, number]);
  }
}
