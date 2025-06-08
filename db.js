const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.supabase,
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;
