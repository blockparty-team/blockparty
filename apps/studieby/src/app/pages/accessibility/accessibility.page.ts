import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonRouterLink,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonBackButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.page.html',
  styleUrls: ['./accessibility.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    RouterLink,
    IonContent,
    IonButton,
    IonRouterLink,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonBackButton,
  ],
})
export class AccessibilityPage {}
