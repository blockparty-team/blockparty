import { Injectable, inject } from '@angular/core';
import { OAuthResponse, Session } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from '@blockparty/festival/data-access/supabase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase = inject(SupabaseService);

  get session$(): Observable<Session | null> {
    return this.supabase.session$;
  }

  get authenticated$(): Observable<boolean> {
    return this.supabase.session$.pipe(
      map((session) => (session?.user.aud === 'authenticated' ? true : false)),
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
