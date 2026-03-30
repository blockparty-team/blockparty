import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  ModalController,
  SegmentCustomEvent,
  IonFooter,
} from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';
import { MapStateService } from '@blockparty/festival/data-access/state/map';
import { RouteName } from '@blockparty/festival/shared/types';
import {
  MapLayer,
  Day,
  StageGeojsonProperties,
  Timetable,
  MapClickedFeature,
  Ticket,
} from '@blockparty/festival/data-access/supabase';
import { DatePipe } from '@angular/common';
import {
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
import { isSameDay, sub } from 'date-fns';
import { toSignal } from '@angular/core/rxjs-interop';

interface TimetableViewModel extends Omit<Timetable, 'artist_name'> {
  onAir: boolean;
  name: string;
}

@Component({
  selector: 'app-stage-timetable',
  templateUrl: './stage-timetable.component.html',
  styleUrls: ['./stage-timetable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonFooter,
    DatePipe,
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
export class StageTimetableComponent {
  private mapStateService = inject(MapStateService);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);

  stage = toSignal<MapClickedFeature<StageGeojsonProperties> | null>(
    this.mapStateService.selectedMapFeature$.pipe(
      map((feature) =>
        feature.mapLayer === MapLayer.Stage
          ? (feature as MapClickedFeature<StageGeojsonProperties>)
          : null,
      ),
    ),
    { initialValue: null },
  );

  stageName = computed(() => this.stage()?.properties.name ?? '');

  stageDescription = computed(
    () => this.stage()?.properties.description ?? null,
  );

  url = computed(() => this.stage()?.properties.url ?? null);

  // If no timetables assigned to stage, backend returns [null] for timetables array.
  hasTimetable = computed(
    () => this.stage()?.properties.timetables[0] !== null,
  );

  days = computed(() => {
    const stage = this.stage();
    if (!stage || !this.hasTimetable()) {
      return [] as Day[];
    }

    return stage.properties.timetables
      .map((timetable) => timetable.day)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  selectedDay = signal<string | null>(this.getInitialSelectedDay());

  timetable = computed(() => {
    const stage = this.stage();
    const day = this.selectedDay();
    if (!stage || !day) {
      return [] as TimetableViewModel[];
    }

    const dayTimetable = stage.properties.timetables.find(
      (timetable) => timetable.day.id === day,
    );
    if (!dayTimetable) {
      return [] as TimetableViewModel[];
    }

    return dayTimetable.timetable.map((slot) => ({
      ...slot,
      onAir:
        new Date() > new Date(slot.start_time!) &&
        new Date() < new Date(slot.end_time!),
    })) as unknown as TimetableViewModel[];
  });

  tickets = computed(
    () => this.stage()?.properties.tickets ?? ([] as Ticket[]),
  );

  tags = computed(() => this.stage()?.properties.tags ?? ([] as string[]));

  location = computed(() => {
    const stage = this.stage();
    return stage ? (stage.geometry.coordinates as [number, number]) : null;
  });

  private getInitialSelectedDay(): string | null {
    const days = this.days();
    if (days.length === 0) {
      return null;
    }

    // Change day at 7am next day (for events running during nighttime).
    const now = sub(new Date(), { hours: 7 });
    const day = days.find((currentDay) =>
      isSameDay(now, new Date(currentDay.date)),
    );

    return day?.id ?? days[0].id;
  }

  onSelectDay(event: Event): void {
    const value = (event as SegmentCustomEvent).detail.value;
    this.selectedDay.set(value ? value.toString() : null);
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
