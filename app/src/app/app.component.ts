import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreService } from './store/store.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(
    private store: StoreService
  ) { }

  ngOnInit(): void {
    this.store.updateEntities();
    // this.store.artists2$.subscribe(console.log);
    // this.store.updateArtists();
  }
}
