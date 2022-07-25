import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MapStateService } from '@app/pages/tab-map/state/map-state.service';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { MapLayer } from '@app/interfaces/map-layer';
import { Day, StageGeojsonProperties, Timetable, TimetableDay } from '@app/interfaces/stage-geojson-properties';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';

@Component({
  selector: 'app-stage-timetable',
  templateUrl: './stage-timetable.component.html',
  styleUrls: ['./stage-timetable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StageTimetableComponent implements OnInit {

  stageName$: Observable<string>;
  days$: Observable<Day[]>;
  timetable$: Observable<Timetable[]>;
  location$: Observable<[number, number]>;

  private _selectedDay$ = new BehaviorSubject<string>(null);
  selectedDay$: Observable<string> = this._selectedDay$.asObservable();

  constructor(
    private mapStateService: MapStateService,
    private modalCtrl: ModalController,
    private router: Router
  ) { }

  ngOnInit() {

    const stage$ = this.mapStateService.selectedMapFeatures$.pipe(
      filter(features => !!features && features[0].mapLayer === MapLayer.Stage),
      map(stages => (stages[0] as MapClickedFeature<StageGeojsonProperties>)),
      map(stage => ({
        ...stage,
        properties: {
          ...stage.properties,
          // JSON.parse is used since Maplibre stringifies nested properties in GeoJSON maplayers
          timetables: JSON.parse(stage.properties.timetables as any) as TimetableDay[]
        }
      }))
    );

    this.stageName$ = stage$.pipe(
      map(stage => stage.properties.name)
    );

    this.days$ = stage$.pipe(
      map(stage => stage.properties.timetables
        .map(t => t.day)
        .sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate())
      ),
      tap(days => this._selectedDay$.next(days[0].id))
    )

    this.timetable$ = combineLatest([
      stage$,
      this.selectedDay$
    ]).pipe(
      filter(([stage, day]) => !!stage && !!day),
      map(([stage, day]) => (
        stage.properties.timetables
          .find(timetable => timetable.day.id === day).timetable
      ))
    )

    this.location$ = stage$.pipe(
      map(stage => [
        stage.geometry.coordinates[1],
        stage.geometry.coordinates[0]
      ] as [number, number])
    );
  }

  onSelectDay(event): void {
    this._selectedDay$.next(event.detail.value);
  }

  onGoToArtist(artistId: string): void {
    this.modalCtrl.dismiss();
    this.router.navigate(['/tabs/', 'artist', artistId]);
  }

  onOpenGoogleMapseDirections(coords: [number, number]): void {

    const url = `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${coords[0]},${coords[1]}`;

    window.open(url, '_blank');
  }

}
