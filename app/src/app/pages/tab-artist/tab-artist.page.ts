import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { pathToImageUrl } from '@app/shared/utils';
import { Observable } from 'rxjs';
import { StoreService } from '@app/store/store.service';

@Component({
  selector: 'app-tab-artist',
  templateUrl: './tab-artist.page.html',
  styleUrls: ['./tab-artist.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabArtistPage implements OnInit {

  artists$: Observable<any[]>;

  constructor(
    private store: StoreService,
  ) { }

  ngOnInit() {
    this.artists$ = this.store.artists$;
  }

  imgUrl(path: string): string {
    return path ? pathToImageUrl(path) : 'assets/distortion_logo.png';
  }

}
