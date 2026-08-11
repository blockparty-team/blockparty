import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-gadearmbaand',
  templateUrl: './gadearmbaand.page.html',
  styleUrls: ['./gadearmbaand.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonText,
  ],
})
export class GadearmbaandPage {}
