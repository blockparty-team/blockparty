import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { ArtistViewModel } from '@blockparty/festival/data-access/supabase';
import { ArtistStateService } from '@blockparty/festival/data-access/state/artist';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonCard, IonIcon, IonRouterLink } from '@ionic/angular/standalone';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, IonCard, IonIcon, IonRouterLink],
})
export class ArtistCardComponent {
  private artistStateService = inject(ArtistStateService);

  @Input() artist!: ArtistViewModel;

  toggleFavorite(id: string): void {
    this.artistStateService.toggleArtistFavorite(id);
  }
}
