import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ArtistViewModel } from '@distortion/app/interfaces/artist';
import { RouteName } from '@distortion/app/shared/models/routeName';
import { NgFor, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonItem,
  IonAvatar,
  IonLabel,
  IonRouterLink,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-artist-item',
  templateUrl: './artist-item.component.html',
  styleUrls: ['./artist-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    DatePipe,
    IonItem,
    IonAvatar,
    IonLabel,
    IonRouterLink,
  ],
})
export class ArtistItemComponent {
  @Input() artist: ArtistViewModel;

  routeName = RouteName;
}
