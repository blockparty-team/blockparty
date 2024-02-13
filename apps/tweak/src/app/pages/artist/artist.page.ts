import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButtons, IonModal, IonItem, IonToolbar, IonHeader, IonButton, IonTitle } from '@ionic/angular/standalone';
import { ToolbarComponent } from '@tweak/shared/components/toolbar/toolbar.component';
import { ImageUploadComponent } from 'libs/tweak/shared/image-upload';
import { ImageCropperComponent } from 'libs/tweak/shared/image-cropper';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.page.html',
  styleUrls: ['./artist.page.scss'],
  standalone: true,
  imports: [IonTitle, IonButton, IonHeader, IonToolbar, IonItem, IonModal, IonButtons,
    CommonModule,
    FormsModule,
    IonContent,
    ToolbarComponent,
    ImageUploadComponent,
    ImageCropperComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistPage {
  public imageEvent = signal<Event | null>(null);
  public isOpen = signal<boolean>(false);

  onImageEvent(event: Event) {
    this.imageEvent.set(event);
    this.isOpen.set(true);
  }

  onImageCropped(event: Blob) {
    console.log(event);
  }

  onModalDismiss() {
    console.log('modal dismissed')
    this.isOpen.set(false);
  }
}
