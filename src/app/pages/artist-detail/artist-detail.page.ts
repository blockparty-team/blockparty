import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { ArtistViewModel } from '@app/interfaces/artist';
import { MapService } from '@app/services/map.service';
import { BehaviorSubject, Observable, Subject, from } from 'rxjs';
import { distinctUntilKeyChanged, map, switchMap } from 'rxjs/operators';
import { ArtistStateService } from '../artist/state/artist-state.service';
import { RouteHistoryService } from '@app/services/routeHistory.service';
import { environment } from '@env/environment';
import { ScrollCustomEvent } from '@ionic/angular';
import { animations } from '@app/shared/animations';

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
  templateUrl: './artist-detail.page.html',
  styleUrls: ['./artist-detail.page.scss'],
  animations: animations.slideUp,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistDetailPage implements OnInit {

  @ViewChild('musicPlayer') musicPlayerIframe: ElementRef<HTMLIFrameElement>;

  artist$: Observable<ArtistViewModel>;
  soMeLinks$: Observable<SoMeIcon[]>;
  imageScale$ = new Subject<string>();
  imageBlur$ = new Subject<string>();
  showPlayer$ = new BehaviorSubject<boolean>(false);

  canShare$ = from(Share.canShare()).pipe(
    map(res => res.value)
  );

  previousRoute$ = this.routeHistoryService.history$.pipe(
    map(history => history.previous ? history.previous : '/')
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private artistStateService: ArtistStateService,
    private mapService: MapService,
    private routeHistoryService: RouteHistoryService
  ) { }


  ngOnInit() {
    this.artist$ = this.activatedRoute.paramMap.pipe(
      map(paramMap => paramMap.get('name')),
      switchMap(name => this.artistStateService.artistsWithFavorites$.pipe(
        map(artists => artists.find(artist => artist.name === name))
      ))
    );

    this.soMeLinks$ = this.artist$.pipe(
      // Prevent disapearing SoMe fab's when artist is liked
      distinctUntilKeyChanged('id'),
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

  onScroll(event: Event): void {
    const scrollTop = (event as ScrollCustomEvent).detail.scrollTop;
    const scale = (100 + (scrollTop / 40)) / 100;
    const blur = scrollTop / 100;

    this.imageScale$.next(`scale(${scale})`);
    this.imageBlur$.next(`blur(${blur}px)`);
  }

  togglePlayer(): void {
    this.showPlayer$.next(!this.showPlayer$.value);
  }

}
