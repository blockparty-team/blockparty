import { ChangeDetectionStrategy, Component, Signal, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonToggle, IonButtons, IonModal, IonItem, IonToolbar, IonHeader, IonButton, IonTitle, IonList, IonIcon, IonInput, IonFab, IonFabButton, IonAccordion, IonLabel, IonAccordionGroup, IonItemGroup, IonItemDivider, IonFooter } from '@ionic/angular/standalone';
import { ToolbarComponent } from '@tweak/shared/components/toolbar/toolbar.component';
import { EditModalComponent } from '@tweak/shared/components/edit-modal/edit-modal.component';
import { ImageUploadComponent } from 'libs/tweak/shared/image-upload';
import { ImageCropperComponent } from 'libs/tweak/shared/image-cropper';
import { Tables, TablesInsert } from '@shared/types';
import { TableComponent, TableConfig } from '@tweak/shared/components/table/table.component';
import { SupabaseService } from '@tweak/services/supabase.service';
import { EMPTY, Subject, catchError, startWith, tap } from 'rxjs';
import { NotificationService } from '@tweak/services/notification.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.page.html',
  styleUrls: ['./artist.page.scss'],
  standalone: true,
  imports: [IonFooter, IonItemDivider, IonItemGroup, IonAccordionGroup, IonLabel, IonAccordion,
    IonFabButton,
    IonFab,
    IonIcon,
    IonList,
    IonTitle,
    IonButton,
    IonHeader,
    IonToolbar,
    IonItem,
    IonModal,
    IonButtons,
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    ToolbarComponent,
    EditModalComponent,
    ImageUploadComponent,
    ImageCropperComponent,
    IonInput,
    IonToggle,
    TableComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistPage {
  private supabase = inject(SupabaseService);
  private notificationService = inject(NotificationService);

  public imageEvent = signal<Event | null>(null)
  public isArtistModalOpen = signal<boolean>(true);
  public isImageCropModalOpen = signal<boolean>(false);
  public isEditing = signal<boolean>(false);
  public selectedArtist = signal<Partial<Tables<'artist'>>>({});
  private artists = signal<Tables<'artist'>[]>([]);

  public tableConfig: Signal<TableConfig<Tables<'artist'>>> = computed(() => ({
    columns: [
      { columnDef: 'name', header: 'Name' },
      { columnDef: 'description', header: 'Description' },
      { columnDef: 'country', header: 'Country' },
      { columnDef: 'is_visible', header: 'Is visible?', type: 'boolean' },
      { columnDef: 'public', header: 'Is public?', type: 'boolean' },
    ],
    data: this.artists(),
  }));

  private updateData$ = new Subject<void>();

  private fb = new FormBuilder();
  public form = this.fb.group({
    id: [''], // This is a hidden field, used for updating existing artists
    name: ['', Validators.required],
    description: [''],
    country: [''],
    instagram: [''],
    facebook: [''],
    spotify: [''],
    youtube: [''],
    soundcloud_iframe: [''],
    bandcamp_iframe: [''],
    is_visible: [true],
    public: [true],
  });

  constructor() {
    this.updateData$
      .pipe(
        startWith(null) // Initial data fetch
      )
      .subscribe(() => {
        this.supabase.fetchArtists().subscribe((artists) => {
          this.artists.set(artists);
        });
      });
  }


  onImageEvent(event: Event) {
    this.imageEvent.set(event);
    this.isImageCropModalOpen.set(true);
  }

  onImageCropped(event: Blob) {
    console.log(event);
  }

  onArtistModalDismiss() {
    this.isArtistModalOpen.set(false);
  }

  onImageCropModalDismiss() {
    this.isImageCropModalOpen.set(false);
  }

  onCreate() {
    this.isEditing.set(false);
    this.form.reset();
    this.isArtistModalOpen.set(true);
  }

  onEdit(artist: Tables<'artist'>) {
    this.isEditing.set(true);
    this.selectedArtist.set(artist);
    this.form.patchValue(artist);
    this.isArtistModalOpen.set(true);
  }

  async onDelete(id: string) {
    const confirmed = await this.notificationService.confirmAlert(
      'Are you sure you want to delete this artist?'
    );

    if (!confirmed) return;

    this.supabase
      .deleteArtist(id!)
      .pipe(
        tap(() => this.updateData$.next()),
        catchError((error) => {
          this.notificationService.showToast({
            message: `Could not delete artist: ${error.message}`,
            color: 'danger',
          });

          return EMPTY;
        })
      )
      .subscribe();
    this.isArtistModalOpen.set(false);
    this.updateData$.next();
  }

  async onSubmit() {
    const { id, ...rest } = this.form.value;

    const payload: TablesInsert<'artist'> =
      id && id.length > 0
        ? (this.form.value as TablesInsert<'artist'>)
        : (rest as TablesInsert<'artist'>);

    this.supabase
      .upsertArtist(payload)
      .pipe(
        tap(() => {
          this.updateData$.next()
          this.isArtistModalOpen.set(false);
        }
        ),
        catchError((error) => {
          this.notificationService.showToast({
            message: `Could not create artist: ${error.message}`,
            color: 'danger',
          });

          return EMPTY;
        })
      )
      .subscribe();
  }
}
