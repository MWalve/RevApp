import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Add error handling for missing environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing environment variables for Supabase');
}

// Add https:// if not present
const fullSupabaseUrl = supabaseUrl.startsWith('https://') 
  ? supabaseUrl 
  : `https://${supabaseUrl}`;

export const supabase = createClient(fullSupabaseUrl, supabaseKey);

export interface Mood {
    id: string;
    mood: string;
    note: string;
    created_at: string;
}