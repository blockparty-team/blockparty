import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ModalController, SegmentCustomEvent } from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';
import { MapStateService } from '@app/pages/map/state/map-state.service';
import { MapLayer } from '@app/interfaces/map-layer';
import {
  Day,
  StageGeojsonProperties,
  Timetable,
} from '@app/interfaces/stage-geojson-properties';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { RouteName } from '@app/shared/models/routeName';
import { Ticket } from '@app/interfaces/event';
import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
  IonBadge,
  IonModal,
  IonContent,
  IonList,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-stage-timetable',
  templateUrl: './stage-timetable.component.html',
  styleUrls: ['./stage-timetable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonItem,
    IonBadge,
    IonModal,
    IonContent,
    IonList,
  ],
})
export class StageTimetableComponent implements OnInit {
  private mapStateService = inject(MapStateService);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);

  stageName$: Observable<string>;
  stageDescription$: Observable<string>;
  tickets$: Observable<Ticket[]>;
  days$: Observable<Day[]>;
  timetable$: Observable<Timetable[]>;
  hasTimetable$: Observable<boolean>;
  location$: Observable<[number, number]>;
  tags$: Observable<string[]>;
  url$: Observable<string>;

  private _selectedDay$ = new BehaviorSubject<string>(null);
  selectedDay$: Observable<string> = this._selectedDay$.asObservable();

  ngOnInit() {
    const stage$: Observable<MapClickedFeature<StageGeojsonProperties>> =
      this.mapStateService.selectedMapFeature$.pipe(
        filter((feature) => feature.mapLayer === MapLayer.Stage),
        map((stage) => stage as MapClickedFeature<StageGeojsonProperties>)
      );

    this.stageName$ = stage$.pipe(map((stage) => stage.properties.name));

    this.stageDescription$ = stage$.pipe(
      map((stage) => stage.properties.description)
    );

    this.url$ = stage$.pipe(map((stage) => stage.properties.url));

    this.days$ = stage$.pipe(
      // If no timetables assigned to stage, backend returns [null] for timetables array
      filter((stage) => stage.properties.timetables[0] !== null),
      map((stage) =>
        stage.properties.timetables
          .map((t) => t.day)
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
      ),
      tap((days) => this._selectedDay$.next(days[0].id))
    );

    this.timetable$ = combineLatest([stage$, this.selectedDay$]).pipe(
      filter(([stage, day]) => !!stage && !!day),
      map(
        ([stage, day]) =>
          stage.properties.timetables.find(
            (timetable) => timetable.day.id === day
          ).timetable
      )
    );

    // If no timetables assigned to stage, backend returns [null] for timetables array
    this.hasTimetable$ = stage$.pipe(
      map((stage) => stage.properties.timetables[0] !== null)
    );

    this.tickets$ = stage$.pipe(map((stage) => stage.properties.tickets));

    this.tags$ = stage$.pipe(map((stage) => stage.properties.tags));

    this.location$ = stage$.pipe(
      map((stage) => stage.geometry.coordinates as [number, number])
    );
  }

  onSelectDay(event: Event): void {
    this._selectedDay$.next(
      (event as SegmentCustomEvent).detail.value.toString()
    );
  }

  onGoToArtist(name: string): void {
    this.modalCtrl.dismiss();
    this.router.navigate(['/tabs', RouteName.Artist, name]);
  }

  onGoToUrl(url: string): void {
    Browser.open({
      url,
    });
  }

  onOpenGoogleMapsDirections(coords: [number, number]): void {
    const url = `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${coords[1]},${coords[0]}`;
    window.open(url, '_blank');
  }

  onCloseModal(): void {
    this.modalCtrl.dismiss();
  }
}
