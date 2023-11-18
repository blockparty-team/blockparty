import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
    standalone: true,
    imports: [IonicModule],
})
export class AboutPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
