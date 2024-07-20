import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@distortion/app/services/auth.service';
import { RouteHistoryService } from '@blockparty/festival/service/route-history-service';
import { first, switchMap } from 'rxjs/operators';
import {
  IonContent,
  IonFab,
  IonBackButton,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonContent, IonFab, IonBackButton, IonButton, IonIcon],
})
export class LoginPage implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private routeHistoryService = inject(RouteHistoryService);

  credentials: FormGroup;

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signIn(): void {
    this.authService.signInWithMail(this.email.value).subscribe();
  }

  signInWithGoogle() {
    this.routeHistoryService.history$
      .pipe(
        first(),
        switchMap((history) =>
          this.authService.signInWithGoogle(history.previous)
        )
      )
      .subscribe();
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }
}
