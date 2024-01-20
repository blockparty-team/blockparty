import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonRouterLink } from '@ionic/angular/standalone';
import { ToolbarComponent } from 'src/app/shared/components/toolbar/toolbar.component';
import { AppPage, appPages } from 'src/app/app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ToolbarComponent,
    IonRouterLink,
  ],
})
export class HomePage {
  appPages = signal<AppPage[]>(appPages);
}
