import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  EntityDistanceSearchResult,
  EntityFreeTextSearchResult,
  RouteName,
} from '@blockparty/festival/shared/types';
import { MapService } from '@blockparty/festival/shared/service/map';
import { SearchService } from '@blockparty/festival/shared/service/search';
import { SegmentCustomEvent } from '@ionic/core';
import { Point } from 'geojson';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import {
  SupabaseService,
  getBucketAndPath,
} from '@blockparty/shared/data-access/supabase-service';
import { EntityBadgeColor } from './entity-badge-color';
import { RouteHistoryService } from '@blockparty/festival/shared/service/route-history';
import { AssetItemComponent } from './asset-item/asset-item.component';
import { StageItemComponent } from './stage-item/stage-item.component';
import { EventItemComponent } from './event-item/event-item.component';
import { ArtistItemComponent } from './artist-item/artist-item.component';
import { AsyncPipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSearchbar,
  IonContent,
  IonList,
  IonItem,
  IonBadge,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';

enum Entity {
  artist = 'artist',
  stage = 'stage',
  asset = 'asset',
  event = 'event',
}

enum SearchMode {
  FreeText = 'FREE_TEXT',
  NearBy = 'NEAR_BY',
}

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ArtistItemComponent,
    EventItemComponent,
    StageItemComponent,
    AssetItemComponent,
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSearchbar,
    IonContent,
    IonList,
    IonItem,
    IonBadge,
    IonIcon,
    IonSpinner
],
})
export class SearchPage {
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private searchService = inject(SearchService);
  private mapService = inject(MapService);
  private routeHistoryService = inject(RouteHistoryService);

  routeName = RouteName;
  entity = Entity;
  searchMode = SearchMode;
  // badgeColor = EntityBadgeColor;

  searchTerm = new FormControl('');
  @ViewChild(IonSearchbar) searchElement!: IonSearchbar;

  private _selectedSearchMode$ = new BehaviorSubject<SearchMode>(
    SearchMode.FreeText,
  );
  selectedSearchMode$: Observable<SearchMode> =
    this._selectedSearchMode$.asObservable();

  previousRoute$ = this.routeHistoryService.history$.pipe(
    map((history) => (history.previous ? history.previous : '/')),
  );

  searchResults$: Observable<EntityFreeTextSearchResult[]> =
    this.searchTerm.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchService.textSearch(term!)),
    );

  nearBy$: Observable<EntityDistanceSearchResult[]> = combineLatest([
    this.searchService.nearBy$,
    this._selectedSearchMode$,
  ]).pipe(
    filter(([, mode]) => mode === SearchMode.NearBy),
    map(([nearBy]) => nearBy),
  );

  ionViewDidEnter(): void {
    if (this._selectedSearchMode$.value === SearchMode.FreeText) {
      setTimeout(() => {
        this.searchElement.setFocus();
      }, 150);
    }
  }

  entityBadgeColor(entity: string | null): string {
    if (!entity) return '';

    return EntityBadgeColor[entity as Entity];
  }

  imgUrl(storagePath: string): string {
    const [bucket, path] = getBucketAndPath(storagePath);
    return bucket && path
      ? this.supabase.publicImageUrl(bucket, path)
      : 'assets/distortion_logo.png';
  }

  onSearchModeChange(ev: Event): void {
    this._selectedSearchMode$.next(
      (ev as SegmentCustomEvent).detail.value as SearchMode,
    );
  }

  onShowOnMap(geom: Point) {
    this.router.navigate(['tabs', RouteName.Map]);
    this.mapService.flyTo(geom.coordinates as [number, number]);
  }
}
