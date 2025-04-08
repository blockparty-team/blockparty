import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonFab,
  IonFabButton,
  IonButtons,
  IonIcon,
  IonCheckbox,
  IonToggle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonDatetimeButton,
  IonDatetime,
  IonModal,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle, IonFooter
} from '@ionic/angular/standalone';
import { ToolbarComponent } from '@tweak/shared/components/toolbar/toolbar.component';
import { SupabaseService } from '@tweak/services/supabase.service';
import { MatTableModule } from '@angular/material/table';
import { Day, DayInsert } from '@tweak/interfaces/database-entities';
import { EditModalComponent } from '@tweak/shared/components/edit-modal/edit-modal.component';
import { EMPTY, Subject, catchError, startWith, tap } from 'rxjs';
import { MatSortModule } from '@angular/material/sort';
import { NotificationService } from '@tweak/services/notification.service';
import {
  TableComponent,
  TableConfig,
} from '@tweak/shared/components/table/table.component';
import { Tables } from '@tweak/interfaces/database-definitions';

@Component({
    selector: 'app-day',
    templateUrl: './day.page.html',
    styleUrls: ['./day.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        IonFooter,
        ReactiveFormsModule,
        MatTableModule,
        MatSortModule,
        TableComponent,
        EditModalComponent,
        IonFab,
        IonFabButton,
        IonIcon,
        IonCheckbox,
        IonContent,
        IonToggle,
        IonList,
        IonItem,
        IonInput,
        IonDatetimeButton,
        IonDatetime,
        IonModal,
        IonButton,
        ToolbarComponent,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
    ],
    providers: [SupabaseService]
})
export class DayPage {
  private supabase = inject(SupabaseService);
  private notificationService = inject(NotificationService);

  public isModalOpen = signal(false);
  public days = signal<Day[]>([]);

  selectedDay = signal<Partial<Day>>({});
  isEditing = signal(false);

  private updateData$ = new Subject<void>();

  public tableConfig: Signal<TableConfig<Tables<'day'>>> = computed(() => ({
    columns: [
      { columnDef: 'day', header: 'Date' },
      { columnDef: 'name', header: 'Name' },
      { columnDef: 'description', header: 'Description' },
      { columnDef: 'public', header: 'Is public?', type: 'boolean' },
    ],
    data: this.days(),
  }));

  displayedColumns = signal<(keyof Day)[]>([
    'day',
    'name',
    'description',
    'public',
  ]);

  private fb = new FormBuilder();
  public form = this.fb.group({
    id: [''], // This is a hidden field, used for updating existing days
    name: ['', Validators.required],
    description: [''],
    day: ['', Validators.required],
    public: [true],
  });

  constructor() {
    this.updateData$
      .pipe(
        startWith(null) // Initial data fetch
      )
      .subscribe(() => {
        this.supabase.fetchDays().subscribe((days) => {
          this.days.set(days);
        });
      });
  }

  onCreateDay() {
    // isEditing is set to false, so the modal will open in create mode
    this.isEditing.set(false);
    this.form.reset();
    this.isModalOpen.set(true);
  }

  onEditDay(day: Partial<Day>) {
    this.isEditing.set(true);
    this.selectedDay.set(day);
    this.form.patchValue(day);
    this.isModalOpen.set(true);
  }

  async onDeleteDay(id: string | undefined) {
    const confirmed = await this.notificationService.confirmAlert(
      'Are you sure you want to delete this day?'
    );

    if (!confirmed) return;

    this.supabase
      .deleteDay(id!)
      .pipe(
        tap(() => this.updateData$.next()),
        catchError((error) => {
          this.notificationService.showToast({
            message: `Could not delete day: ${error.message}`,
            color: 'danger',
          });

          return EMPTY;
        })
      )
      .subscribe();
    this.isModalOpen.set(false);
    this.updateData$.next();
  }

  async onSubmit() {
    const { id, ...rest } = this.form.value;

    const payload: DayInsert =
      id && id.length > 0
        ? (this.form.value as DayInsert)
        : (rest as DayInsert);

    this.supabase
      .upsertDay(payload)
      .pipe(tap(() => this.updateData$.next()))
      .subscribe();

    this.isModalOpen.set(false);
  }
}
