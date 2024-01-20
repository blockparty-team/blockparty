import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ToolbarComponent } from 'src/app/shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.page.html',
  styleUrls: ['./artist.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, ToolbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistPage {}
