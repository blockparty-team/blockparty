import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ArtistViewModel } from '@app/interfaces/artist';
import { RouteName } from '@app/shared/models/routeName';

@Component({
  selector: 'app-artist-item',
  templateUrl: './artist-item.component.html',
  styleUrls: ['./artist-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistItemComponent {
  @Input() artist: ArtistViewModel

  routeName = RouteName;
}
