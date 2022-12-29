import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { RouteHistoryService } from '@app/services/routeHistory.service';
import { filter, first, mergeMap, pairwise, switchMap, tap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage implements OnInit {

  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private routeHistoryService: RouteHistoryService
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  signIn(): void {
    this.authService.signInWithMail(this.email.value).subscribe()
  }

  signInWithGoogle() {
    this.routeHistoryService.history$.pipe(
      first(),
      switchMap(history => this.authService.signInWithGoogle(history.previous))
    ).subscribe();
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

}
