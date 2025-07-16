import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ToolbarComponent } from '@tweak/shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.page.html',
  styleUrls: ['./icon.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, IonContent, ToolbarComponent],
})
export class IconPage {}
