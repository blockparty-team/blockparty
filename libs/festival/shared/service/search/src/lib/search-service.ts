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
            case 'artist': {
              const artist = artists.find((item) => item.id === result.id);
              if (!artist) {
                return result;
              }

              return {
                ...result,
                artist,
              };
            }
            case 'event': {
              const event = events.find((item) => item.id === result.id);
              if (!event) {
                return result;
              }

              return {
                ...result,
                event,
              };
            }
            case 'stage': {
              const stageLayer = mapLayers.find(
                (layer) => layer.mapSource === MapSource.Stage,
              );
              const stage = stageLayer?.geojson.features.find(
                (feature) => feature.properties.id === result.id,
              ) as Feature<Point, StageGeojsonProperties> | undefined;
              if (!stage) {
                return result;
              }

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
            }
            case 'asset': {
              const assetLayer = mapLayers.find(
                (layer) => layer.mapSource === MapSource.Asset,
              );
              const asset = assetLayer?.geojson.features.find(
                (feature) => feature.properties.id === result.id,
              ) as Feature<Point, AssetGeojsonProperties> | undefined;
              if (!asset) {
                return result;
              }

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
            }
            default:
              return result;
          }
        }),
      ),
    );
  }
}
