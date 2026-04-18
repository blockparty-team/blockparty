import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { RouteName } from '@blockparty/festival/shared/types';
import { ArtistViewModel } from '@blockparty/festival/data-access/supabase';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { personOutline } from 'ionicons/icons';
import {
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon,
  IonRouterLink,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-artist-item',
  templateUrl: './artist-item.component.html',
  styleUrls: ['./artist-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DatePipe,
    IonItem,
    IonAvatar,
    IonLabel,
    IonIcon,
    IonRouterLink,
  ],
})
export class ArtistItemComponent {
  readonly artist = input.required<ArtistViewModel>();

  private readonly failedImageSrc = signal<string | null>(null);

  routeName = RouteName;

  constructor() {
    addIcons({ personOutline });
  }

  showPlaceholder(): boolean {
    const src = this.imageSrc();

    return !src || this.failedImageSrc() === src;
  }

  imageSrc(): string {
    return this.artist().imgUrl?.trim() || '';
  }

  onImageError(): void {
    this.failedImageSrc.set(this.imageSrc());
  }
}
