import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ArtistViewModel } from '@app/interfaces/artist';
import { RouteName } from '@app/shared/models/routeName';
import { EntityBadgeColor } from '../entity-badge-color';

@Component({
  selector: 'app-artist-item',
  templateUrl: './artist-item.component.html',
  styleUrls: ['./artist-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistItemComponent {
  @Input() artist: ArtistViewModel

  routeName = RouteName;
  badgeColor = EntityBadgeColor;
}
