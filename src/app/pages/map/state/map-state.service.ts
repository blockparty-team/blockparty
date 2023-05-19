import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, concat, forkJoin } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { SupabaseService } from '@app/services/supabase.service';
import { FilesystemService } from '@app/services/filesystem.service';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { getBucketAndPath } from '@app/shared/functions/storage';
import { imgToBase64, imgFromUrl } from '@app/shared/functions/file-utils';
import { MapIcon } from '@app/interfaces/database-entities';
import { MaskGeojsonProperties } from '@app/interfaces/mask-geojson-properties';
import { MapSource, MapSourceGeojson } from '@app/interfaces/map-layer';
import { MapIconViewModel } from '@app/interfaces/map-icon';
import { GeojsonProperties, MapClickedFeature } from '@app/interfaces/map-clicked-feature';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {

  private supabase = inject(SupabaseService);
  private deviceStorageService = inject(DeviceStorageService);
  private filesystemService = inject(FilesystemService);

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

  private mapIconsFromSupabase$: Observable<MapIconViewModel[]> = this.supabase.mapIcons$.pipe(
    filter(icons => !!icons),
    tap(icons => this.deviceStorageService.set('mapIcons', icons)),
    // Add fileurl
    map(icons => icons.map(mapIcon => {
      const [bucket, path] = getBucketAndPath(mapIcon.storage_path);

      return {
        ...mapIcon,
        fileUrl: this.supabase.publicImageUrl(bucket, path)
      }
    })),
    // Add HTML image element based on fileUrl
    switchMap(icons =>
      forkJoin(icons.map(icon => imgFromUrl(icon.fileUrl)))
        .pipe(
          map(images => icons.map((icon, i) => ({ ...icon, image: images[i] })))
        )
    ),
    // Cache icons in filesystem
    tap((icons: MapIconViewModel[]) => {
      icons
        .filter(icon => !!icon.image)
        .forEach(icon => {
          const base64 = imgToBase64(icon.image);
          this.filesystemService.writeFile(base64, icon.storage_path);
        })
    })
  )

  private mapIconsFromFilesystem$: Observable<MapIconViewModel[]> = this.deviceStorageService.get('mapIcons').pipe(
    filter(icons => !!icons),
    map(icons => icons as MapIcon[]),
    switchMap(icons =>
      forkJoin(icons.map(icon => this.filesystemService.readFile(icon.storage_path)))
        .pipe(
          switchMap(images =>
            // Create img element from Base64 string stored in filesystem
            forkJoin(images.map(base64 => imgFromUrl(`data:image/png;base64,${base64}`)))
              .pipe(
                map(images => icons.map((icon, i) => ({
                  ...icon,
                  fileUrl: null,
                  image: images[i]
                }))),
              )
          )
        )
    )
  );

  mapIcons$: Observable<MapIconViewModel[]> = concat(
    this.mapIconsFromFilesystem$,
    this.mapIconsFromSupabase$
  ).pipe(
    shareReplay(1)
  );

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
