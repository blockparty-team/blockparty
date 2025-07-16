import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
  signal,
  computed,
} from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonToggle,
  IonButtons,
  IonModal,
  IonItem,
  IonToolbar,
  IonHeader,
  IonButton,
  IonTitle,
  IonList,
  IonIcon,
  IonInput,
  IonFab,
  IonFabButton,
  IonAccordion,
  IonLabel,
  IonAccordionGroup,
  IonItemGroup,
  IonItemDivider,
  IonFooter,
} from '@ionic/angular/standalone';
import { ToolbarComponent } from '@tweak/shared/components/toolbar/toolbar.component';
import { EditModalComponent } from '@tweak/shared/components/edit-modal/edit-modal.component';
import { ImageUploadComponent } from 'libs/tweak/shared/image-upload';
import { ImageCropperComponent } from 'libs/tweak/shared/image-cropper';
import {
  Tables,
  TablesInsert,
} from '@blockparty/distortion/data-access/supabase';
import {
  TableComponent,
  TableConfig,
} from '@tweak/shared/components/table/table.component';
import { SupabaseService } from '@tweak/services/supabase.service';
import {
  EMPTY,
  Subject,
  catchError,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { NotificationService } from '@tweak/services/notification.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.page.html',
  styleUrls: ['./artist.page.scss'],
  imports: [
    IonFooter,
    IonItemDivider,
    IonItemGroup,
    IonAccordionGroup,
    IonLabel,
    IonAccordion,
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
    ReactiveFormsModule,
    IonContent,
    ToolbarComponent,
    EditModalComponent,
    ImageUploadComponent,
    ImageCropperComponent,
    IonInput,
    IonToggle,
    TableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistPage {
  private supabase = inject(SupabaseService);
  private notificationService = inject(NotificationService);
  private sanitizer = inject(DomSanitizer);

  public imageEvent = signal<Event | null>(null);
  public isArtistModalOpen = signal<boolean>(false);
  public isImageCropModalOpen = signal<boolean>(false);
  public isEditing = signal<boolean>(false);
  public selectedArtistId = signal<string | null>(null);
  private artists = signal<Tables<'artist'>[]>([]);
  private croppedImage = signal<ImageCroppedEvent | null>(null);

  public selectedArtist = computed<Tables<'artist'> | undefined>(() => {
    const id = this.selectedArtistId();
    const artists = this.artists();
    const selected = artists.find((artist) => artist.id === id);

    return selected;
  });

  public imageUrl = computed(() => {
    const isEditing = this.isEditing();
    const storagePath = this.selectedArtist()?.storage_path;
    const croppedImageUrl = this.croppedImage()?.objectUrl;

    if (storagePath && isEditing) {
      const [bucket, path] = this.supabase.getBucketAndPath(storagePath);
      return this.supabase.publicImageUrl(bucket, path);
    } else if (croppedImageUrl) {
      return this.sanitizer.bypassSecurityTrustUrl(croppedImageUrl as string);
    } else {
      return null;
    }
  });

  public tableConfig: Signal<TableConfig<Tables<'artist'>>> = computed(() => ({
    columns: [
      { columnDef: 'name', header: 'Name' },
      { columnDef: 'description', header: 'Description' },
      { columnDef: 'country', header: 'Country' },
      { columnDef: 'image', header: 'Image', type: 'image' },
      { columnDef: 'is_visible', header: 'Is visible?', type: 'boolean' },
      { columnDef: 'public', header: 'Is public?', type: 'boolean' },
    ],
    data: this.artists().map((artist) => {
      let image;
      if (artist.storage_path) {
        const [bucket, path] = this.supabase.getBucketAndPath(
          artist.storage_path!,
        );
        image = this.supabase.publicImageUrl(bucket, path);
      }

      return {
        ...artist,
        image,
      };
    }),
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
        startWith(null), // Initial data fetch
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

  onImageCropped(image: ImageCroppedEvent) {
    this.croppedImage.set(image);
  }

  async onDeleteImage() {
    const confirmed = await this.notificationService.confirmAlert(
      'Do you want to delete the image?',
    );

    if (!confirmed) return;

    if (this.isEditing() && this.selectedArtist()) {
      const artist = this.selectedArtist()!;
      // Delete the file from storage and update the artist
      this.supabase
        .deleteFile('artist', artist.storage_path as string)
        .pipe(
          switchMap(() =>
            this.supabase.updateArtist(artist.id, { storage_path: null }),
          ),
          tap(() => this.updateData$.next()),
        )
        .subscribe();
    } else {
      this.croppedImage.set(null);
    }
  }

  onArtistModalDismiss() {
    this.resetModalState();
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
    this.croppedImage.set(null);
    this.selectedArtistId.set(artist.id);
    this.form.patchValue(this.selectedArtist()!);

    this.isArtistModalOpen.set(true);
  }

  async onDelete(id: string) {
    const confirmed = await this.notificationService.confirmAlert(
      'Are you sure you want to delete this artist?',
    );

    if (!confirmed) return;

    // TODO: Delete related image using forkJoin
    this.supabase
      .deleteArtist(id)
      .pipe(
        tap(() => {
          this.resetModalState();
          this.updateData$.next();
        }),
        catchError((error) => {
          this.notificationService.showToast({
            message: `Could not delete artist: ${error.message}`,
            color: 'danger',
          });

          return EMPTY;
        }),
      )
      .subscribe();
  }

  async onSubmit() {
    const { id, ...rest } = this.form.value;

    const payload: TablesInsert<'artist'> =
      id && id.length > 0
        ? (this.form.value as TablesInsert<'artist'>)
        : (rest as TablesInsert<'artist'>);

    if (this.croppedImage()) {
      payload.storage_path = `artist/${payload.name.toLowerCase().replace(' ', '_')}`;
    }

    const upsertArtist$ = this.supabase.upsertArtist(payload).pipe(
      catchError((error) => {
        this.notificationService.showToast({
          message: `Could not create artist: ${error.message}`,
          color: 'danger',
        });

        return EMPTY;
      }),
    );

    const uploadImage$ = this.croppedImage()
      ? this.supabase
          .uploadFile(
            'artist',
            payload.name.toLowerCase().replace(' ', '_'),
            this.croppedImage()?.blob as Blob,
          )
          .pipe(
            catchError((error) => {
              this.notificationService.showToast({
                message: `Could not upload image: ${error.message}`,
                color: 'danger',
              });

              return EMPTY;
            }),
          )
      : of(null);

    uploadImage$
      .pipe(
        switchMap(() => upsertArtist$),
        tap(() => {
          this.resetModalState();
          this.updateData$.next();
          this.notificationService.showToast({
            message: 'Artist saved successfully',
            color: 'success',
          });
        }),
      )
      .subscribe();
  }

  private resetModalState(): void {
    this.isArtistModalOpen.set(false);
    this.croppedImage.set(null);
    this.selectedArtistId.set(null);
  }
}
