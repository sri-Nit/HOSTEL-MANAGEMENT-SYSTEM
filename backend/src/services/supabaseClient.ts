import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ ENV not loaded. Check src/env.ts import order.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);