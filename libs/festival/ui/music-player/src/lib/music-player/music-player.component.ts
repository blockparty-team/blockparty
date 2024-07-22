import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Signal,
  WritableSignal,
  signal,
} from '@angular/core';
import { animations } from '@blockparty/util/animation';
import { SegmentCustomEvent } from '@ionic/angular/standalone';
import { IframeSrcDirective } from '@blockparty/festival/shared/directives';
import { NgIf, AsyncPipe } from '@angular/common';
import {
  IonHeader,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';

enum PlayerSource {
  Soundcloud = 'soundcloud',
  Bandcamp = 'bandcamp',
}

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: animations.slideUpDown,
  standalone: true,
  imports: [
    NgIf,
    IframeSrcDirective,
    AsyncPipe,
    IonHeader,
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonSpinner,
  ],
})
export class MusicPlayerComponent implements OnInit {
  @Input() soundcloudUrl!: string;
  @Input() bandcampUrl!: string;
  @Input() showPlayer!: WritableSignal<boolean>;

  public selectedSource = signal<PlayerSource>(PlayerSource.Soundcloud);
  public playerSource = PlayerSource;

  ngOnInit(): void {
    if (this.soundcloudUrl && this.bandcampUrl) {
      this.selectedSource.set(PlayerSource.Soundcloud);
    } else if (this.soundcloudUrl) {
      this.selectedSource.set(PlayerSource.Soundcloud);
    } else {
      this.selectedSource.set(PlayerSource.Bandcamp);
    }
  }

  onChangePlayerSource(event: SegmentCustomEvent): void {
    const source = event.target.value as PlayerSource;
    this.selectedSource.set(source);
  }

  close(): void {
    this.showPlayer.set(false);
  }
}
