import { inject, Injectable } from '@angular/core';
import {
  EntityDistanceSearchResult,
  EntityFreeTextSearchResult,
  MapSource,
  StageGeojsonProperties,
  AssetGeojsonProperties,
} from '@blockparty/festival/data-access/supabase';
import { Observable } from 'rxjs';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { GeolocationService } from '@blockparty/shared/service/geolocation';
import { SupabaseService } from '@blockparty/festival/data-access/supabase';
import { ArtistStateService } from '@blockparty/festival/data-access/state/artist';
import { EventStateService } from '@blockparty/festival/data-access/state/event';
import { MapStateService } from '@blockparty/festival/data-access/state/map';
import { Feature, Point } from 'geojson';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private supabase = inject(SupabaseService);
  private geolocationService = inject(GeolocationService);
  private artistSateService = inject(ArtistStateService);
  private eventStateService = inject(EventStateService);
  private mapStateService = inject(MapStateService);

  get nearBy$(): Observable<EntityDistanceSearchResult[]> {
    return this.geolocationService.getCurrentPosition().pipe(
      map((position) => position.coords),
      switchMap((pos) =>
        this.supabase.distanceTo([pos.longitude, pos.latitude], 1000000000),
      ),
    );
  }

  textSearch(term: string): Observable<EntityFreeTextSearchResult[]> {
    return this.supabase.textSearch(term).pipe(
      withLatestFrom(
        this.artistSateService.artists$,
        this.eventStateService.events$,
        this.mapStateService.mapLayers$,
      ),
      filter(([results]) => !!results),
      map(([results, artists, events, mapLayers]) =>
        results.map((result) => {
          switch (result.entity) {
            case 'artist':
              return {
                ...result,
                artist: artists.find((artist) => artist.id === result.id),
              };
            case 'event':
              return {
                ...result,
                event: events.find((event) => event.id === result.id),
              };
            case 'stage':
              const stage = mapLayers
                .find((layer) => layer.mapSource === MapSource.Stage)!
                .geojson.features.find(
                  (feature) => feature.properties.id === result.id,
                ) as Feature<Point, StageGeojsonProperties>;

              return {
                ...result,
                stage: {
                  ...stage,
                  properties: {
                    ...stage.properties,
                    imgUrl: this.supabase.publicImageUrl(
                      'icon',
                      `${stage.properties.icon}.png`,
                    ),
                  },
                },
              };
            case 'asset':
              const asset = mapLayers
                .find((layer) => layer.mapSource === MapSource.Asset)!
                .geojson.features.find(
                  (feature) => feature.properties.id === result.id,
                ) as Feature<Point, AssetGeojsonProperties>;

              return {
                ...result,
                asset: {
                  ...asset,
                  properties: {
                    ...asset.properties,
                    imgUrl: this.supabase.publicImageUrl(
                      'icon',
                      `${asset.properties.icon}.png`,
                    ),
                  },
                },
              };
            default:
              return result;
          }
        }),
      ),
    );
  }
}
