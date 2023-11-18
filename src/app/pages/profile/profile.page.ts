import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { UserMetadata } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule, NgIf, RouterLink, AsyncPipe]
})
export class ProfilePage implements OnInit {

  userMetaData$: Observable<UserMetadata>
  name$: Observable<string>;
  avatarUrl$: Observable<string>

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {

    this.userMetaData$ = this.authService.session$.pipe(
      filter(session => !!session),
      map(session => session.user.user_metadata),
    )
  }

}
