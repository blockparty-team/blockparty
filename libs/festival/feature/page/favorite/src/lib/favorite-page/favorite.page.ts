import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ArtistViewModel } from '@blockparty/festival/shared/types';
import { ArtistStateService } from '@blockparty/festival/data-access/state/artist';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonAvatar,
  IonIcon,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonItem,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { AppConfigService } from '@blockparty/festival/data-access/state/app-config';

interface DayGroupedFavorites {
  day: { name: string | null; day: string };
  artists: ArtistViewModel[];
}

@Component({
    selector: 'app-favorite',
    templateUrl: './favorite.page.html',
    styleUrls: ['./favorite.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        RouterLink,
        AsyncPipe,
        DatePipe,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonButton,
        IonContent,
        IonList,
        IonAvatar,
        IonIcon,
        IonItemGroup,
        IonItemDivider,
        IonLabel,
        IonItem,
        IonRouterLink,
    ]
})
export class FavoritePage {
  private artistStateService = inject(ArtistStateService);
  public appConfig = inject(AppConfigService).appConfig.favorites;

  public showDayGroupedFavorites = signal<boolean>(true);

  favoriteArtists$: Observable<ArtistViewModel[]> =
    this.artistStateService.artists$.pipe(
      map((artists) => artists.filter((artist) => artist.isFavorite)),
    );

  dayGroupedFavorites$: Observable<DayGroupedFavorites[]> =
    this.favoriteArtists$.pipe(
      map((artists) => {
        return artists
          .reduce((acc: DayGroupedFavorites[], artist) => {
            // TODO: Artists playing multible days will only appear once
            // If artist is not assigned to timetable show TBA - future day is for sorting last
            const day = artist.timetable[0]?.day
              ? artist.timetable[0].day
              : { name: 'N/A', day: '2070-01-01' };

            if (
              acc.find((group) => group.day.name === day.name) === undefined
            ) {
              acc.push({ day, artists: [] });
            }

            acc
              .find((group) => group.day.name == day.name)!
              .artists.push(artist);

            acc.forEach((group) => {
              group.artists.sort(
                (a, b) =>
                  new Date(a.timetable[0]?.start_time!).getTime() -
                  new Date(b.timetable[0]?.start_time!).getTime(),
              );
            });

            return acc;
          }, [])
          .sort(
            (a, b) =>
              new Date(a.day.day).getTime() - new Date(b.day.day).getTime(),
          );
      }),
    );

  toggleFavorite(id: string): void {
    this.artistStateService.toggleArtistFavorite(id);
  }

  toggleDayGroupedFavorites(): void {
    this.showDayGroupedFavorites.update((show) => !show);
  }
}
