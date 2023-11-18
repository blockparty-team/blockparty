import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.page.html',
    styleUrls: ['./playlist.page.scss'],
    standalone: true,
    imports: [IonicModule],
})
export class PlaylistPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
