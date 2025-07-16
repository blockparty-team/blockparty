import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  WritableSignal,
  inject,
  input,
  signal,
} from '@angular/core';
import { animations } from '@blockparty/util/animation';
import { SegmentCustomEvent } from '@ionic/angular/standalone';

import {
  IonHeader,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  imports: [IonHeader, IonSegment, IonSegmentButton, IonIcon, IonSpinner],
})
export class MusicPlayerComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);

  soundcloudUrl = input<string>();
  bandcampUrl = input<string>();

  @Input() showPlayer!: WritableSignal<boolean>;

  public selectedSource = signal<PlayerSource>(PlayerSource.Soundcloud);
  public playerSource = PlayerSource;

  ngOnInit(): void {
    if (this.soundcloudUrl() && this.bandcampUrl()) {
      this.selectedSource.set(PlayerSource.Soundcloud);
    } else if (this.soundcloudUrl()) {
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

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
