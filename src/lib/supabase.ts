import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// Force mock mode because AuthContext is currently using hardcoded mock users.
// Even if Supabase keys are present, we need to use Mock Data to match the IDs (e.g. 'j1') 
// assigned to the mock users ('u-s1') in mockUsers.ts.
// Once Auth is migrated to Supabase, this can be reverted to use env vars.
const hasSupabaseKeys = !!supabaseUrl && !!supabaseAnonKey;

/**
 * 1. Force REAL mode if keys are present (unless VITE_USE_MOCK is explicitly 'true')
 * 2. Fall back to MOCK if keys are missing
 */
export const isMockMode = (import.meta.env.VITE_USE_MOCK === 'true') || !hasSupabaseKeys;

if (!hasSupabaseKeys && !isMockMode) {
  console.warn('Missing VITE_SUPABASE environment variables. Falling back to MOCK mode.');
}

// Export a single `supabase` binding — either a thin stub in mock mode or the real client.
export const supabase = isMockMode
  ? ({} as any)
  : createClient<Database>(supabaseUrl!, supabaseAnonKey!);
