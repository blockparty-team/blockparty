import { supabaseService } from './supabase.service';

describe('supabaseService', () => {
  it('should work', () => {
    expect(supabaseService()).toEqual('supabase.service');
  });
});
