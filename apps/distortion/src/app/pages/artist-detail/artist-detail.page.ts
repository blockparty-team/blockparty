import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { ArtistViewModel } from '@distortion/app/interfaces/artist';
import { MapService } from '@blockparty/festival/service/map';
import { Observable, Subject, from } from 'rxjs';
import { distinctUntilKeyChanged, map, switchMap } from 'rxjs/operators';
import { ArtistStateService } from '../artist/state/artist-state.service';
import { RouteHistoryService } from '@distortion/app/services/routeHistory.service';
import { environment } from '@shared/environments';
import { ScrollCustomEvent } from '@ionic/angular/standalone';
import { RouteName } from '@distortion/app/shared/models/routeName';
import { MusicPlayerComponent } from '../../shared/components/music-player/music-player.component';
import { NgIf, NgFor, NgClass, AsyncPipe, DatePipe } from '@angular/common';
import {
  IonContent,
  IonBackButton,
  IonFabButton,
  IonIcon,
  IonFab,
  IonFabList,
  IonSpinner,
} from '@ionic/angular/standalone';

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
  {
    column: 'apple_music',
    icon: '',
    svg: 'assets/so-me-icons/apple-music.svg',
  },
  { column: 'soundcloud', icon: 'logo-soundcloud' },
  { column: 'youtube', icon: 'logo-youtube' },
  { column: 'instagram', icon: 'logo-instagram' },
  { column: 'facebook', icon: 'logo-facebook' },
  { column: 'webpage', icon: 'browsers-outline' },
];

@Component({
  templateUrl: './artist-detail.page.html',
  styleUrls: ['./artist-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    MusicPlayerComponent,
    AsyncPipe,
    DatePipe,
    IonContent,
    IonBackButton,
    IonFabButton,
    IonIcon,
    IonFab,
    IonFabList,
    IonSpinner,
  ],
})
export class ArtistDetailPage implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  artistStateService = inject(ArtistStateService);
  mapService = inject(MapService);
  routeHistoryService = inject(RouteHistoryService);

  artist$: Observable<ArtistViewModel>;
  soMeLinks$: Observable<SoMeIcon[]>;
  showMusicPlayer = signal<boolean>(false);
  canShare$ = from(Share.canShare()).pipe(map((res) => res.value));
  previousRoute$ = this.routeHistoryService.history$.pipe(
    map((history) => (history.previous ? history.previous : '/'))
  );

  private _titleScrollTop$ = new Subject<number>();
  imageScale$: Observable<string> = this._titleScrollTop$.pipe(
    map((scrollTop) => `scale(${(100 + scrollTop / 40) / 100})`)
  );
  imageBlur$: Observable<string> = this._titleScrollTop$.pipe(
    map((scrollTop) => `blur(${scrollTop / 100}px)`)
  );
  coverIosStatusBar$ = this._titleScrollTop$.pipe(
    // Image heght is defined for 250 in css
    map((titleDistanceTop) => (titleDistanceTop < 250 ? false : true))
  );

  ngOnInit() {
    this.artist$ = this.activatedRoute.paramMap.pipe(
      map((paramMap) => paramMap.get('name')),
      switchMap((name) =>
        this.artistStateService.artists$.pipe(
          map((artists) => artists.find((artist) => artist.name === name))
        )
      )
    );

    this.soMeLinks$ = this.artist$.pipe(
      // Prevent disapearing SoMe fab's when artist is liked
      distinctUntilKeyChanged('id'),
      map((artist) => {
        const soMeColumns = soMeIcons.map((conf) => conf.column);

        return Object.entries(artist)
          .filter(([column, value]) => soMeColumns.includes(column) && !!value)
          .map(([column, url]) => {
            const { icon, svg } = soMeIcons.find(
              (conf) => conf.column === column
            );

            return {
              column,
              icon,
              svg,
              url,
            };
          });
      })
    );
  }

  toggleFavorite(id: string): void {
    this.artistStateService.toggleArtistFavorite(id);
  }

  goToStageOnMap(geom: any): void {
    this.router.navigate(['tabs', RouteName.Map]);
    this.mapService.flyTo(geom.coordinates);
  }

  openUrl(url: string): void {
    Browser.open({ url });
  }

  share(artist: ArtistViewModel): void {
    Share.canShare().then((canShare) => {
      if (canShare.value) {
        Share.share({
          dialogTitle: `${artist.name}`,
          title: 'Share',
          text: `${artist.name} is playing at ${environment.festivalName
            } ${artist.timetable
              .map((t) => t.day.name)
              .join(' and ')} - Check it out:`,
          url: `${environment.appUrl}${this.router.url}`,
        });
      }
    });
  }

  onScroll(event: Event): void {
    const scrollTop = (event as ScrollCustomEvent).detail.scrollTop;
    this._titleScrollTop$.next(scrollTop);
  }

  toggleMusicPlayer(): void {
    this.showMusicPlayer.update((show) => !show);
  }
}
