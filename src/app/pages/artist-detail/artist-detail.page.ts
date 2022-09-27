import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { MapService } from '@app/services/map.service';
import { pathToImageUrl } from '@app/shared/utils';
import { StoreService } from '@app/store/store.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ArtistStateService } from '../tab-artist/state/artist-state.service';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.page.html',
  styleUrls: ['./artist-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistDetailPage implements OnInit {

  artist$: Observable<ArtistWithRelations> = this.activatedRoute.paramMap.pipe(
    map(paramMap => paramMap.get('id')),
    switchMap(id => this.store.artists$.pipe(
      map(artists => artists.find(artist => artist.id === id))
    ))
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private store: StoreService,
    private artistStateService: ArtistStateService,
    private mapService: MapService
  ) { }

  ngOnInit() { }

  imgUrl(path: string): string {
    return path ? pathToImageUrl(path) : 'assets/distortion_logo.png';
  }

  addRemoveFavorites(id: string): void {
    this.artistStateService.toggleArtistsFavorites(id);
  }

  isFavorite(id: string): boolean {
    return this.artistStateService.isFavorite(id);
  }

  goToStageOnMap(geom: any): void {
    this.router.navigate(['tabs', 'map']);
    this.mapService.flyTo(geom.coordinates);
  }

  safeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
