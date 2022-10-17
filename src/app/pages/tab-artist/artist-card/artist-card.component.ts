import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { pathToImageUrl } from '@app/shared/utils';
import { ArtistStateService } from '../state/artist-state.service';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistCardComponent implements OnInit {
  @Input() artist: ArtistWithRelations

  constructor(
    private artistStateService: ArtistStateService
  ) { }

  ngOnInit() {}

  imgUrl(path: string): string {
    return path ? pathToImageUrl(path) : 'assets/distortion_logo.png';
  }

  toggleFavorite(id: string): void {
    this.artistStateService.toggleArtistFavorite(id);
  }
}
