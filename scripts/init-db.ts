import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environmental variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY must be defined in your .env file.');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase project:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSchema() {
  console.log('📖 Reading /supabase_schema.sql...');
  let sqlPath = path.join(process.cwd(), 'supabase_schema.sql');
  if (!fs.existsSync(sqlPath)) {
    sqlPath = path.join(process.cwd(), '../supabase_schema.sql');
  }

  if (!fs.existsSync(sqlPath)) {
    console.error('❌ Error: Could not locate supabase_schema.sql in the project root directory.');
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  console.log('🚀 Attempting to run SQL schema via exec_sql RPC helper...');
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sqlContent });
    if (error) {
      console.warn('⚠️ Direct RPC execution failed:', error.message);
      console.log('\n💡 Note: To run DDL statements directly, your Supabase project needs an "exec_sql" RPC function.');
      console.log('If you get this error, copy the contents of "supabase_schema.sql" and paste them directly into the SQL Editor in your Supabase Dashboard.');
      console.log('Dashboard Link: https://supabase.com/dashboard/project/_/sql\n');
    } else {
      console.log('✅ Success! Supabase database schema provisioned and hydrated successfully.');
    }
  } catch (err: any) {
    console.error('❌ Error running query:', err.message || err);
    console.log('\nPlease run the supabase_schema.sql commands manually in the Supabase Dashboard SQL Editor.');
  }
}

runSchema();
