import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ToolbarComponent } from '@tweak/shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.page.html',
  styleUrls: ['./timetable.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, IonContent, ToolbarComponent],
})
export class TimetablePage {}
