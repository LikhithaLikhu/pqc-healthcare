import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id')
);

let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    clientInstance = null;
  }
}

export const supabase = clientInstance;

/**
 * Actively tests whether the Supabase connection is established and healthy.
 * Never claims success without a real round-trip verification.
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  error?: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message: 'Supabase credentials are not configured in frontend/.env',
    };
  }

  try {
    // Attempt a lightweight query to verify connectivity and API key validity
    const { data, error } = await supabase.from('profiles').select('id').limit(1);

    if (error) {
      // If table doesn't exist yet, but authentication handshake succeeded
      if (error.code === '42P01' || error.message.includes('relation "public.profiles" does not exist')) {
        return {
          connected: true,
          message: 'Connected to Supabase project, but migrations (schema) have not yet been applied.',
          error: error.message,
        };
      }
      return {
        connected: false,
        message: `Supabase query rejected: ${error.message}`,
        error: error.message,
      };
    }

    return {
      connected: true,
      message: 'Supabase database connected and authenticated successfully.',
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Network error connecting to Supabase: ${err?.message || err}`,
      error: String(err),
    };
  }
}
