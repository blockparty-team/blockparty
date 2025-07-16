import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonModal,
  IonInput,
  IonList,
  IonToggle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonHeader,
  IonTitle,
  IonButtons,
  IonToolbar,
  IonButton,
  IonItem, IonFooter
} from '@ionic/angular/standalone';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { MapService } from '../../services/map.service';
import {
  ListSelectionConfig,
  SelectComponent,
} from '@tweak/shared/components/select/select.component';
import { SupabaseService } from '@tweak/services/supabase.service';
import { EditModalComponent } from '@tweak/shared/components/edit-modal/edit-modal.component';
import {
  EMPTY,
  Subject,
  catchError,
  concat,
  forkJoin,
  map,
  merge,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { NotificationService } from '@tweak/services/notification.service';
import { connect } from 'ngxtension/connect';
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@tweak/interfaces/database-definitions';
import {
  KeyValueComponent,
  KeyValueConfig,
} from '@tweak/shared/components/key-value/key-value.component';
import {
  TableComponent,
  TableConfig,
} from '@tweak/shared/components/table/table.component';
import { FeatureCollection, Feature, Polygon } from 'geojson';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

type Day = {
  id: number;
  name: string;
};

type EventViewModel = Tables<'event'> & {
  days: Day[];
};

type EventGeoJSON = Feature<Polygon, Omit<Tables<'event'>, 'geom' | 'bounds'>>;

type State = {
  isModalOpen: boolean;
  isEditing: boolean;
  viewMode: 'table' | 'map';
  days: Day[];
  events: Tables<'event'>[];
  selectedEventId: string | null;
};

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
  standalone: true,
  imports: [
    IonFooter,
    ReactiveFormsModule,
    TableComponent,
    SelectComponent,
    KeyValueComponent,
    EditModalComponent,
    IonToggle,
    IonInput,
    IonList,
    IonTitle,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonButton,
    IonItem,
    IonModal,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    FormsModule,
    ToolbarComponent
],
  providers: [MapService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventPage {
  private mapService = inject(MapService);
  private supabase = inject(SupabaseService);
  private notificationService = inject(NotificationService);

  private state = signal<State>({
    isModalOpen: false,
    isEditing: false,
    viewMode: 'table',
    days: [],
    events: [],
    selectedEventId: null,
  });

  public viewMode = signal<'table' | 'map'>('map');
  public isModalOpen = signal(false);
  public isEditing = signal(false);
  public days = signal<Tables<'day'>[]>([]);
  public events = signal<Tables<'event'>[]>([]);

  // Selected event based on map or table selection
  private eventIdFromMap: Signal<string> = computed(() => {
    const id = this.mapService.selectedFeature()?.getProperties()['id'];
    return id;
  });
  private eventIdFromTable = signal<string | null>(null);
  public selectedEventId = toSignal(
    merge(
      toObservable(this.eventIdFromMap),
      toObservable(this.eventIdFromTable)
    )
  );
  public selectedEvent = computed<Tables<'event'> | undefined>(() => {
    return this.events().find((event) => event.id === this.selectedEventId());
  });

  private updateData$ = new Subject<void>();

  items = signal([
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
  ]);

  public eventsAsGeoJSON = computed<EventGeoJSON[]>(() => {
    const features = this.events().map((event) => {
      const { geom, bounds, ...properties } = event;

      return {
        type: 'Feature',
        bbox: bounds,
        properties,
        geometry: geom,
      };
    }) as EventGeoJSON[];

    return features;
  });

  //--------------------------------
  // Component config
  //--------------------------------
  public ticketKeyValueConfig = signal<KeyValueConfig>({
    buttonName: 'Add tickets',
    property1Key: 'name',
    property2Key: 'url',
    property1Label: 'Name',
    property2Label: 'Ticket URL',
  });

  public daySelectionConfig = signal<ListSelectionConfig>({
    entity: 'day',
    displayProperty: 'name',
    multiSelect: true,
    searchable: false,
    breakpoints: [0, 0.5, 1],
    initialBreakpoint: 0.5,
  });

  public eventTypeSelecttionConfig = signal<ListSelectionConfig>({
    entity: 'event type',
    displayProperty: 'name',
    multiSelect: false,
    searchable: true,
    breakpoints: [0, 0.5, 1],
    initialBreakpoint: 0.5,
  });

  public tableConfig: Signal<TableConfig<Tables<'event'>>> = computed(() => {
    return {
      columns: [
        { columnDef: 'name', header: 'Name' },
        { columnDef: 'description', header: 'Description' },
        { columnDef: 'days_view', header: 'Days' },
        { columnDef: 'event_type', header: 'Event type' },
        { columnDef: 'public', header: 'Is public?', type: 'boolean' },
      ],
      data: this.events().map((event) => ({
        ...event,
        days_view: ((event as any).day_event as any[])
          .map((day) => day.day.name)
          .join(', '),
      })),
      searchable: true,
    };
  });

  //--------------------------------
  // Form config
  //--------------------------------
  private fb = new FormBuilder();
  public form = this.fb.group({
    id: [''], // This is a hidden field, used for updating existing entries
    name: ['', Validators.required],
    description: [''],
    event_type_id: [''],
    days: [[]],
    geom: [Validators.required],
    public: true,
    tickets: [],
  });

  constructor() {
    afterNextRender(() => {
      this.mapService.initMap('event-map');
    });

    const events$ = this.updateData$.pipe(
      switchMap(() =>
        this.supabase.fetchEvents().pipe(
          catchError((error) => {
            this.notificationService.showToast({
              message: `Could not fetch events: ${error.message}`,
              color: 'danger',
            });

            return EMPTY;
          })
        )
      ),
      map((events) =>
        events.map((event: any) => {
          const days = event.day_event.map((dayEvent: any) => ({
            ...dayEvent.day,
          }));

          return { ...event, days };
        })
      ),
      shareReplay(1)
    );

    const days$ = this.updateData$.pipe(
      switchMap(() =>
        this.supabase.fetchDays().pipe(
          catchError((error) => {
            this.notificationService.showToast({
              message: `Could not fetch days: ${error.message}`,
              color: 'danger',
            });

            return EMPTY;
          })
        )
      )
    );

    connect(this.days, days$);
    connect(this.events, events$);

    // Trigger initial data fetch
    this.updateData$.next();

    this.mapService.drawingFinished$.subscribe((feature) => {
      this.form.patchValue({ geom: feature.geometry as any });
      this.isModalOpen.set(true);
    });

    // Patch the form with the selected event
    effect(
      () => {
        const event = this.selectedEvent();

        if (!event) return;

        this.form.patchValue(event as any);
      },
      { allowSignalWrites: true }
    );

    // effect(() => {
    //   const feat = this.mapService.selectedFeature()

    //   if (!feat) return;

    //   // this.selectedEventId.set(feat.getProperties()['id']);
    //   this.isEditing.set(true);
    //   this.isModalOpen.set(true);
    //   this.form.patchValue(this.selectedEvent() as any);
    // }, { allowSignalWrites: true })

    effect(() => {
      const fc: FeatureCollection = {
        type: 'FeatureCollection',
        features: this.eventsAsGeoJSON(),
      };

      setTimeout(() => {
        this.mapService.addGeoJSON(fc, 'event_geojson');
      }, 2000);
    });

    // this.form.patchValue({ days: [{ id: 1, name: 'Monday' }] } as any);
    // this.form.patchValue({
    //   name: 'Ø Festival',
    //   tickets: [
    //     {
    //       "name": "Ø Weekend",
    //       "url": "https://www.ticketmaster.dk/event/DIS0406W",
    //     },
    //     // {
    //     //   "url": "https://www.ticketmaster.dk/event/DIS0306L",
    //     //   "name": "Ø Saturday"
    //     // }
    //   ] as any
    // })
    // this.form.valueChanges.subscribe(console.log);
  }

  public onAddEvent() {
    this.form.reset();
    this.isEditing.set(false);
    this.viewMode.set('map');
    // console.log(this.eventsAsGeoJSON())
    this.notificationService.showToast({
      message: 'Draw an event area on the map to create a new event',
    });
    this.mapService.startDrawing('Polygon');
  }

  public onSwitchView() {
    this.viewMode.set(this.viewMode() === 'map' ? 'table' : 'map');
  }

  async onDeleteEvent(id: string | undefined) {
    const confirmed = await this.notificationService.confirmAlert(
      'Are you sure you want to delete this event?'
    );

    if (!confirmed) return;

    concat(
      this.supabase.deleteDayEvents(id!),
      this.supabase.deleteEvent(id!)
    ).subscribe(() => {
      this.updateData$.next();
    });
    this.isModalOpen.set(false);
  }

  public onSelectEventFromTable(event: any) {
    console.log(event);
    const { day_event, ...rest } = event;

    this.isEditing.set(true);
    // this.selectedEventId.set(rest.id);
    this.eventIdFromTable.set(rest.id);
    // this.selectedEvent.set(rest);
    this.isModalOpen.set(true);

    this.form.patchValue(rest);
  }

  onToggleBaselayer() {
    this.mapService.toggleBaseMap();
  }

  async onSubmit() {
    const { id, days, ...rest } = this.form.value;
    const insertPayload = { ...rest };
    const updatePayload = { ...rest, id };

    // Determine if it is an update or insert based on the presence of an id
    const payload: TablesInsert<'event'> | TablesUpdate<'event'> =
      this.isEditing()
        ? (updatePayload as TablesUpdate<'event'>)
        : (insertPayload as TablesInsert<'event'>);

    this.supabase
      .upsertEvent(payload)
      .pipe(
        map((events) => events[0].id),
        // Create day event mapping for each day
        switchMap((eventId: string) => {
          const deleteDayEvents$ = this.supabase.deleteDayEvents(eventId);

          if (!days) return deleteDayEvents$;

          const createDayEvents$ = forkJoin(
            (days as unknown as any[]).map((day) =>
              this.supabase.upsertDayEvent(day.id, eventId)
            )
          );

          return concat(deleteDayEvents$, createDayEvents$);
        }),
        tap(() => {
          this.updateData$.next();
          this.notificationService.showToast({
            message: 'Event saved',
            color: 'success',
          });
        })
      )
      .subscribe();

    this.mapService.stopDrawing();
    this.isModalOpen.set(false);
  }
}
