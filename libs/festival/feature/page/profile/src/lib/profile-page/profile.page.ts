import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@blockparty/festival/shared/service/auth';
import { UserMetadata } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';
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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    AsyncPipe,
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
export class ProfilePage implements OnInit {
  userMetaData$!: Observable<UserMetadata>;
  name$!: Observable<string>;
  avatarUrl$!: Observable<string>;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userMetaData$ = this.authService.session$.pipe(
      filter((session) => !!session),
      map((session) => session.user.user_metadata),
    );
  }
}
