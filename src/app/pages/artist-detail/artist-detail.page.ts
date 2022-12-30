import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { ArtistViewModel } from '@app/interfaces/artist';
import { MapService } from '@app/services/map.service';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ArtistStateService } from '../artist/state/artist-state.service';
import { RouteHistoryService } from '@app/services/routeHistory.service';
import { environment } from '@env/environment';

interface SoMeIcon {
  column: string;
  icon?: string;
  svg?: string;
  url?: string;
}

const soMeIcons: SoMeIcon[] = [
  { column: 'bandcamp', svg: 'assets/so-me-icons/bandcamp.svg' },
  { column: 'spotify', svg: 'assets/so-me-icons/spotify.svg' },
  { column: 'tidal', icon: '', svg: 'assets/so-me-icons/tidal.svg' },
  { column: 'apple_music', icon: '', svg: 'assets/so-me-icons/apple-music.svg' },
  { column: 'soundcloud', icon: 'logo-soundcloud' },
  { column: 'youtube', icon: 'logo-youtube' },
  { column: 'instagram', icon: 'logo-instagram' },
  { column: 'facebook', icon: 'logo-facebook' },
  { column: 'webpage', icon: 'browsers-outline' },
]

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.page.html',
  styleUrls: ['./artist-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistDetailPage implements OnInit {

  artist$: Observable<ArtistViewModel>;
  soMeLinks$: Observable<SoMeIcon[]>;
  canShare$ = from(Share.canShare()).pipe(
    map(res => res.value)
  );

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

    this.soMeLinks$ = this.artist$.pipe(
      map(artist => {
        const soMeColumns = soMeIcons.map(conf => conf.column);

        return Object.entries(artist)
          .filter(([column, value]) => soMeColumns.includes(column) && !!value)
          .map(([column, url]) => {

            const { icon, svg, } = soMeIcons
              .find(conf => conf.column === column);

            return {
              column,
              icon,
              svg,
              url
            }
          })
      })
    );
  }

  toggleFavorite(id: string): void {
    this.artistStateService.toggleArtistFavorite(id);
  }

  goToStageOnMap(geom: any): void {
    this.router.navigate(['tabs', 'map']);
    this.mapService.flyTo(geom.coordinates);
  }

  openUrl(url: string): void {
    Browser.open({ url });
  }

  safeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  share(artist: ArtistViewModel): void {
    Share.canShare().then(canShare => {
      if (canShare.value) {
        Share.share({
          dialogTitle: `${artist.name}`,
          title: 'Share',
          text: `${artist.name} is playing at ${environment.festivalName} ${artist.timetable.map(t => t.day.name).join(' and ')} - Check it out:`,
          url: `${environment.appUrl}${this.router.url}`
        });
      }
    });
  }

}
