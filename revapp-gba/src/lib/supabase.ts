import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXTJS_APP_SUPABASE_URL!
const supabaseKey = process.env.NEXTJS_APP_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Mood {
    id: string;
    mood: string;
    note: string;
    created_at: string;
}
