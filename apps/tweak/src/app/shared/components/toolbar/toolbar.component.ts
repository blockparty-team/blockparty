import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle],
})
export class ToolbarComponent {
  @Input() title: string | undefined;
}
