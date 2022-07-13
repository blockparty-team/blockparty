import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar'
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

    StatusBar.setBackgroundColor({color: '#c85c67'})
  }
}
