import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@blockparty/festival/shared/service/auth';
import { UserMetadata } from '@supabase/supabase-js';
import { filter, map } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import {
  IonRouterLink,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonAvatar,
  IonButton,
} from '@ionic/angular/standalone';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    IonRouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonAvatar,
    IonButton,
  ],
})
export class ProfilePage {
  private authService = inject(AuthService);

  userMetaData = toSignal<UserMetadata | null>(
    this.authService.session$.pipe(
      filter((session) => !!session),
      map((session) => session.user.user_metadata),
    ),
    { initialValue: null },
  );
}
