import { Injectable, inject } from '@angular/core';
import { GeojsonProperties, MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { Observable, BehaviorSubject, concat, forkJoin } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, tap } from 'rxjs/operators';
import { SupabaseService } from '@app/services/supabase.service';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { MapSource, MapSourceGeojson } from '@app/interfaces/map-layer';
import { MaskGeojsonProperties } from '@app/interfaces/mask-geojson-properties';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {

  private supabase = inject(SupabaseService);
  private deviceStorageService = inject(DeviceStorageService);

  private _mapLoaded$ = new BehaviorSubject<boolean>(false);
  mapLoaded$: Observable<boolean> = this._mapLoaded$.asObservable();

  private _mapIdle$ = new BehaviorSubject<boolean>(true);
  mapIdle$: Observable<boolean> = this._mapIdle$.asObservable().pipe(
    distinctUntilChanged()
  );

  private _selectedMapFeatures$ = new BehaviorSubject<MapClickedFeature<GeojsonProperties>[]>(null);
  selectedMapFeature$: Observable<MapClickedFeature<GeojsonProperties>> = this._selectedMapFeatures$.asObservable().pipe(
    filter(features => !!features),
    // Only provide first clicked layer
    map(features => features[0])
  );

  private _mapInteraction$ = new BehaviorSubject<boolean>(false);
  mapInteraction$: Observable<boolean> = this._mapInteraction$.asObservable();

  private _removedAssetIconNames$ = new BehaviorSubject<string[]>([]);
  removedAssetIconNames$: Observable<any> = this._removedAssetIconNames$.asObservable();

  mapLayers$: Observable<MapSourceGeojson<GeojsonProperties>[]> = concat(
    this.deviceStorageService.get('mapLayers').pipe(
      filter(layers => !!layers)
    ),
    forkJoin(
      Object.values(MapSource)
        .map(layer => this.supabase.tableAsGeojson(layer))
    ).pipe(
      filter(layers => !!layers),
      map(layers => Object.values(MapSource)
        .map((mapSource, i) => ({ mapSource, geojson: layers[i] }))
      ),
      tap(layers => this.deviceStorageService.set('mapLayers', layers))
    )
  ).pipe(
    shareReplay(1)
  )

  dayMaskBounds$: Observable<MaskGeojsonProperties[]> = this.mapLayers$.pipe(
    map(layers => layers.find(layer => layer.mapSource === 'day_event_mask')),
    map(layer => layer.geojson.features.map(feature => feature.properties) as MaskGeojsonProperties[])
  );

  selectMapFeatures(features: MapClickedFeature<GeojsonProperties>[]): void {
    this._selectedMapFeatures$.next(features);
  }

  updateMapInteraction(interacting: boolean): void {
    this._mapInteraction$.next(interacting);
  }

  updateMapLoaded(loaded: boolean): void {
    this._mapLoaded$.next(loaded);
  }

  updateMapIdle(idle: boolean): void {
    this._mapIdle$.next(idle);
  }

  updateRemovedAssetIconNames(iconName: string, visible: boolean): void {

    if (visible === false) {
      this._removedAssetIconNames$.next(
        [...new Set(
          [...this._removedAssetIconNames$.value, iconName]
        )]
      )
    } else {
      this._removedAssetIconNames$.next(
        this._removedAssetIconNames$.value.filter(x => x !== iconName)
      )
    }
  }

}
