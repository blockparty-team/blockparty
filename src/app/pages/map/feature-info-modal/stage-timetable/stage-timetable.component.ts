import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, pluck, shareReplay, tap } from 'rxjs/operators';
import { ModalController, SegmentCustomEvent } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { MapStateService } from '@app/pages/map/state/map-state.service';
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
  stageDescription$: Observable<string>;
  ticketUrl$: Observable<string>;
  days$: Observable<Day[]>;
  timetable$: Observable<Timetable[]>;
  hasTimetable$: Observable<boolean>;
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

    this.stageDescription$ = stage$.pipe(
      map(stage => stage.properties.description)
    );

    this.days$ = stage$.pipe(
      // If no timetables assigned to stage, backend returns [null] for timetables array
      filter(stage => stage.properties.timetables[0] !== null),
      map(stage => stage.properties.timetables
        .map(t => t.day)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      ),
      tap(days => this._selectedDay$.next(days[0].id))
    );

    this.timetable$ = combineLatest([
      stage$,
      this.selectedDay$
    ]).pipe(
      filter(([stage, day]) => !!stage && !!day),
      map(([stage, day]) => (
        stage.properties.timetables
          .find(timetable => timetable.day.id === day).timetable
      ))
    );

    // If no timetables assigned to stage, backend returns [null] for timetables array
    this.hasTimetable$ = stage$.pipe(
      map(stage => stage.properties.timetables[0] !== null)
    );

    this.ticketUrl$ = stage$.pipe(
      pluck('properties', 'ticket_url'),
    );

    this.location$ = stage$.pipe(
      map(stage => [
        stage.geometry.coordinates[1],
        stage.geometry.coordinates[0]
      ] as [number, number])
    );
  }

  onSelectDay(event: Event): void {
    this._selectedDay$.next((event as SegmentCustomEvent).detail.value);
  }

  onGoToArtist(name: string): void {
    this.modalCtrl.dismiss();
    this.router.navigate(['/tabs/', 'artist', name]);
  }

  onGoToTicket(ticketUrl: string): void {
    Browser.open({
      url: ticketUrl
    })
  }

  onOpenGoogleMapsDirections(coords: [number, number]): void {
    const url = `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${coords[0]},${coords[1]}`;
    window.open(url, '_blank');
  }

  onCloseStageDescriptionModal() {
    this.modalCtrl.dismiss();
  }

}
