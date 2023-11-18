import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-partners',
    templateUrl: './partners.page.html',
    styleUrls: ['./partners.page.scss'],
    standalone: true,
    imports: [IonicModule, RouterLink],
})
export class PartnersPage {

  constructor() { }

}
