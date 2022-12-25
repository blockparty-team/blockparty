import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ArtistViewModel } from '@app/interfaces/artist';
import { ArtistStateService } from '../state/artist-state.service';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistCardComponent implements OnInit {
  @Input() artist: ArtistViewModel

  constructor(
    private artistStateService: ArtistStateService
  ) { }

  ngOnInit() {}

  toggleFavorite(id: string): void {
    this.artistStateService.toggleArtistFavorite(id);
  }
}
