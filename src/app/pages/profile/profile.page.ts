import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage implements OnInit {

  name$: Observable<string>;
  avatarUrl$: Observable<string>

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.session$.subscribe(console.log)

    this.name$ = this.authService.session$.pipe(
      map(session => session.user.user_metadata.name)
    )

    this.avatarUrl$ = this.authService.session$.pipe(
      map(session => session.user.user_metadata.avatar_url)
    )
  }

}
