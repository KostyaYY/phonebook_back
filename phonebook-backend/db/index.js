const { Pool } = require('pg');
require('dotenv').config();

const { DATABASE_URL } = process.env;

// Supabase requires SSL; its pooler certificate is not in Node's CA store
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
