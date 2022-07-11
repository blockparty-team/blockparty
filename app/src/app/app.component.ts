import { Component, OnInit } from '@angular/core';
import { StoreService } from './store/store.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private store: StoreService
  ) { }

  ngOnInit(): void {
    this.store.updateEntities();
    // this.store.updateArtists();
  }
}
