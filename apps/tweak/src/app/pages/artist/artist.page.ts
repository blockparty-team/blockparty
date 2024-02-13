import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ToolbarComponent } from '@tweak/shared/components/toolbar/toolbar.component';
import { ImageUploadComponent } from 'libs/tweak/shared/image-upload';
import { ImageCropperComponent } from 'libs/tweak/shared/image-cropper';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.page.html',
  styleUrls: ['./artist.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    ToolbarComponent,
    ImageUploadComponent,
    ImageCropperComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistPage { }
