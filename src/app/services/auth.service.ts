import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private supabase: SupabaseService
  ) { }

  signIn(email: string) {
    return this.supabase.signIn(email);
  }
}
