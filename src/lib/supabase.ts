import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://ckzakweytrygjunabewz.supabase.co';
const supabaseKey = 'sb_publishable_20BGFbs_DMNjrR2A8bli8A_56RlI37u';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };