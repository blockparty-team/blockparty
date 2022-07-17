import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { pathToImageUrl } from '@app/shared/utils';
import { Observable } from 'rxjs';
import { StoreService } from '@app/store/store.service';
import { map } from 'rxjs/operators';
import { ArtistWithRelations } from '@app/interfaces/artist';

interface GroupedArtists {
  letter: string;
  artists: ArtistWithRelations[];
}

@Component({
  selector: 'app-tab-artist',
  templateUrl: './tab-artist.page.html',
  styleUrls: ['./tab-artist.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabArtistPage implements OnInit {

  groupedArtists$: Observable<GroupedArtists[]>;

  constructor(
    private store: StoreService,
  ) { }

  ngOnInit() {
    this.groupedArtists$ = this.store.artists$.pipe(
      map(artists => {
        return artists.reduce((acc: GroupedArtists[], artist) => {

          const letter = artist.name[0].toUpperCase();

          if (acc.find(group => group.letter === letter) === undefined) {
            acc.push({ letter, artists: [] })
          };

          acc.find(group => group.letter == letter).artists.push(artist);

          return acc;
        }, [])
      })
    )
  }

  imgUrl(path: string): string {
    return path ? pathToImageUrl(path) : 'assets/distortion_logo.png';
  }

}
