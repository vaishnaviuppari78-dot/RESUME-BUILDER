const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment configuration
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Missing Supabase Environment Variables in backend/.env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
