const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://postgres.iwmsfbcfuzgwifwpjzxc:123123@aws-0-eu-north-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});


module.exports = pool;