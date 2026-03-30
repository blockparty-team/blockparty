import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { RouteName } from '@blockparty/festival/shared/types';
import { ArtistViewModel } from '@blockparty/festival/data-access/supabase';
import { MapService } from '@blockparty/festival/shared/service/map';
import { from } from 'rxjs';
import {
  distinctUntilKeyChanged,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import { ArtistStateService } from '@blockparty/festival/data-access/state/artist';
import { RouteHistoryService } from '@blockparty/festival/shared/service/route-history';
import { ScrollCustomEvent } from '@ionic/angular/standalone';
import { MusicPlayerComponent } from '@blockparty/festival/ui/music-player';
import { DatePipe } from '@angular/common';
import {
  IonContent,
  IonBackButton,
  IonFabButton,
  IonIcon,
  IonFab,
  IonFabList,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AppConfigService } from '@blockparty/festival/data-access/state/app-config';
import { toSignal } from '@angular/core/rxjs-interop';

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
  imports: [
    MusicPlayerComponent,
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
export class ArtistDetailPage {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  artistStateService = inject(ArtistStateService);
  mapService = inject(MapService);
  routeHistoryService = inject(RouteHistoryService);
  private appConfig = inject(AppConfigService).appConfig.app;

  private artist$ = this.activatedRoute.paramMap.pipe(
    map((paramMap) => paramMap.get('name')),
    switchMap((name) =>
      this.artistStateService.artists$.pipe(
        map(
          (artists) => artists.find((artist) => artist.name === name) ?? null,
        ),
      ),
    ),
  );

  artist = toSignal<ArtistViewModel | null>(this.artist$, {
    initialValue: null,
  });

  soMeLinks = toSignal(
    this.artist$.pipe(
      filter((artist) => !!artist),
      // Prevent disapearing SoMe fab's when artist is liked
      distinctUntilKeyChanged('id'),
      map((artist) => {
        const soMeColumns = soMeIcons.map((conf) => conf.column);

        return Object.entries(artist)
          .filter(([column, value]) => soMeColumns.includes(column) && !!value)
          .map(([column, url]) => {
            const { icon, svg } = soMeIcons.find(
              (conf) => conf.column === column,
            )!;

            return {
              column,
              icon,
              svg,
              url,
            } as SoMeIcon;
          });
      }),
    ),
    { initialValue: [] as SoMeIcon[] },
  );

  showMusicPlayer = signal<boolean>(false);
  canShare = toSignal(from(Share.canShare()).pipe(map((res) => res.value)), {
    initialValue: false,
  });
  previousRoute = toSignal(
    this.routeHistoryService.history$.pipe(
      map((history) => (history.previous ? history.previous : '/')),
    ),
    { initialValue: '/' },
  );

  private titleScrollTop = signal(0);
  imageScale = computed(
    () => `scale(${(100 + this.titleScrollTop() / 40) / 100})`,
  );
  imageBlur = computed(() => `blur(${this.titleScrollTop() / 100}px)`);
  coverIosStatusBar = computed(
    // Image heght is defined for 250 in css
    () => this.titleScrollTop() >= 250,
  );

  toggleFavorite(id: string): void {
    this.artistStateService.toggleArtistFavorite(id);
  }

  goToStageOnMap(geom: any): void {
    this.router.navigate(['tabs', RouteName.Map]);
    setTimeout(() => this.mapService.flyTo(geom.coordinates), 250);
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
          text: `${artist.name} is playing at ${this.appConfig.name()} ${artist.timetable
            .map((t) => t.day.name)
            .join(' and ')} - Check it out:`,
          url: `${this.appConfig.url()}${this.router.url}`,
        });
      }
    });
  }

  onScroll(event: Event): void {
    const scrollTop = (event as ScrollCustomEvent).detail.scrollTop;
    this.titleScrollTop.set(scrollTop);
  }

  toggleMusicPlayer(): void {
    this.showMusicPlayer.update((show) => !show);
  }
}
