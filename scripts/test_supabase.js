const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    env[key] = val;
  }
});

(async () => {
  console.log('--- 1. Testing Supabase API Client ---');
  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (error) {
      console.log('Supabase API returned message:', error.message);
    } else {
      console.log('SUCCESS: Supabase API connected! Registered users:', data.users.length);
    }
  } catch (err) {
    console.error('Supabase API error:', err.message);
  }

  console.log('\n--- 2. Testing Supabase PostgreSQL Database (pg) ---');
  const pgClient = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await pgClient.connect();
    const res = await pgClient.query('SELECT NOW() as current_time, version()');
    console.log('SUCCESS: PostgreSQL connection established!');
    console.log('PostgreSQL Server Time:', res.rows[0].current_time);
    console.log('Version:', res.rows[0].version.split(',')[0]);
    await pgClient.end();
  } catch (err) {
    console.error('PostgreSQL Connection error:', err.message);
  }
})();
