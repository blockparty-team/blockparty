import { Injectable } from '@angular/core';
import { OAuthResponse, Session } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from '@blockparty/shared/data-access/supabase-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private supabase: SupabaseService) { }

  get session$(): Observable<Session | null> {
    return this.supabase.session$;
  }

  get authenticated$(): Observable<boolean> {
    return this.supabase.session$.pipe(
      map((session) => (session?.user.aud === 'authenticated' ? true : false))
    );
  }

  signInWithMail(email: string) {
    return this.supabase.signIn(email);
  }

  signInWithGoogle(redirectTo?: string): Observable<OAuthResponse['data']> {
    return this.supabase.signInWithProvider('google', redirectTo);
  }

  logOut(): void {
    this.supabase.signOut();
  }
}
