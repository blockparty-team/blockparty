import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonText } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { chevronBack } from 'ionicons/icons';

@Component({
  selector: 'app-gadearmbaand',
  templateUrl: './gadearmbaand.page.html',
  styleUrls: ['./gadearmbaand.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonText],
})
export class GadearmbaandPage {

  constructor() {
    addIcons({ chevronBack })
  }
}
