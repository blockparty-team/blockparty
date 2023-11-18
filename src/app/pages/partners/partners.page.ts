import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonRouterLink } from "@ionic/angular/standalone";

@Component({
  selector: 'app-partners',
  templateUrl: './partners.page.html',
  styleUrls: ['./partners.page.scss'],
  standalone: true,
  imports: [RouterLink, IonContent, IonGrid, IonRow, IonCol, IonButton, IonRouterLink],
})
export class PartnersPage { }
