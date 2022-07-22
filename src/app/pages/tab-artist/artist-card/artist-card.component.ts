import { Component, Input, OnInit } from '@angular/core';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { pathToImageUrl } from '@app/shared/utils';
import { ArtistStateService } from '../state/artist-state.service';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss'],
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

  addRemoveFavorites(id: string): void {
    this.artistStateService.toggleArtistsFavorites(id);
  }

  isFavorite(id: string): boolean {
    return this.artistStateService.isFavorite(id);
  }

}
