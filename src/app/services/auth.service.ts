import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private supabase: SupabaseService
  ) { }

  signInWithMail(email: string) {
    return this.supabase.signIn(email);
  }

  signInWithGoogle() {
    this.supabase.signInWithProvider('google').subscribe();
  }

  logOut(): void {
    this.supabase.signOut();
  }

  get authenticated$(): Observable<boolean> {
    return this.supabase.authenticated$;
  }
}
