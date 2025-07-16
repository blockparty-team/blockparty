import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ToolbarComponent } from '@tweak/shared/components/toolbar/toolbar.component';
import { AppPage, appPages } from '@tweak/app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule, FormsModule, ToolbarComponent],
})
export class HomePage {
  appPages = signal<AppPage[]>(appPages);
}
