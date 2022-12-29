import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ArtistViewModel } from '@app/interfaces/artist';
import { MapService } from '@app/services/map.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ArtistStateService } from '../artist/state/artist-state.service';
import { RouteHistoryService } from '@app/services/routeHistory.service';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.page.html',
  styleUrls: ['./artist-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistDetailPage implements OnInit {

  artist$: Observable<ArtistViewModel>;

  previousRoute$ = this.routeHistoryService.history$.pipe(
    map(history => history.previous ? history.previous : '/')
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private artistStateService: ArtistStateService,
    private mapService: MapService,
    private routeHistoryService: RouteHistoryService
  ) { }

  ngOnInit() {
    this.artist$ = this.activatedRoute.paramMap.pipe(
      map(paramMap => paramMap.get('id')),
      switchMap(id => this.artistStateService.artistsWithFavorites$.pipe(
        map(artists => artists.find(artist => artist.id === id))
      ))
    );
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
