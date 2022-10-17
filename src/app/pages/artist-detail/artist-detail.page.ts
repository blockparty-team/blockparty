import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { MapService } from '@app/services/map.service';
import { pathToImageUrl } from '@app/shared/utils';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ArtistStateService } from '../tab-artist/state/artist-state.service';
import { TapRecognizer } from 'maplibre-gl';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.page.html',
  styleUrls: ['./artist-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistDetailPage implements OnInit {

  artist$: Observable<ArtistWithRelations>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private artistStateService: ArtistStateService,
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.artist$ = this.activatedRoute.paramMap.pipe(
      map(paramMap => paramMap.get('id')),
      switchMap(id => this.artistStateService.artistsWithFavorites$.pipe(
        map(artists => artists.find(artist => artist.id === id))
      ))
    );
  }

  imgUrl(path: string): string {
    return path ? pathToImageUrl(path) : 'assets/distortion_logo.png';
  }

  toggleFavorite(id: string): void {
    this.artistStateService.toggleArtistFavorite(id);
  }

  goToStageOnMap(geom: any): void {
    this.router.navigate(['tabs', 'map']);
    this.mapService.flyTo(geom.coordinates);
  }

  safeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
