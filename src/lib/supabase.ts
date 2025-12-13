import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
let useMock = import.meta.env.VITE_USE_MOCK === 'true';

if (!useMock && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('Missing Supabase environment variables. Falling back to mock mode.');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useMock = true;
}

// Export a single `supabase` binding — either a thin stub in mock mode or the real client.
// This keeps the module shape consistent and avoids invalid `export` usage inside blocks.
// Export the final mode so components know if we are using mock data
export const isMockMode = useMock;

export const supabase = isMockMode
  ? ({} as any)
  : createClient<Database>(supabaseUrl!, supabaseAnonKey!);
