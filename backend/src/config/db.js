const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

// Validate if placeholder is still in place
const isPlaceholder = !connectionString || connectionString.includes('[YOUR-PASSWORD]');

let pool = null;

if (!isPlaceholder) {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Required for Supabase direct cloud connections
    },
    max: 10, // Max clients in connection pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error('⚠️ Unexpected error on idle PostgreSQL client:', err.message);
  });
}

/**
 * Executes a raw SQL query through the connection pool
 * @param {string} text - SQL Query
 * @param {Array} [params] - Query Parameters
 */
const query = async (text, params = []) => {
  if (isPlaceholder || !pool) {
    throw new Error(
      'Database connection string not configured. Please set your Supabase password in backend/.env'
    );
  }

  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`[SQL] executed query (${duration}ms):`, { text, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error(`[SQL Error]:`, err.message);
    throw err;
  }
};

/**
 * Tests connection to Supabase PostgreSQL and returns server time and version
 */
const testConnection = async () => {
  if (isPlaceholder || !pool) {
    return {
      connected: false,
      message: 'DATABASE_URL contains [YOUR-PASSWORD]. Replace with your real Supabase password in backend/.env',
    };
  }

  try {
    const res = await pool.query('SELECT NOW() as current_time, version();');
    return {
      connected: true,
      timestamp: res.rows[0].current_time,
      version: res.rows[0].version,
      message: 'Successfully connected to Supabase PostgreSQL',
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      message: 'Failed to connect to Supabase PostgreSQL. Check password and network access.',
    };
  }
};

/**
 * Auto-creates a sample hackathon table if it doesn't already exist
 */
const initDb = async () => {
  if (isPlaceholder || !pool) return;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS hackathon_items (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Supabase PostgreSQL: `hackathon_items` table ready.');
  } catch (err) {
    console.warn('⚠️ Could not auto-initialize table:', err.message);
  }
};

module.exports = {
  pool,
  query,
  testConnection,
  initDb,
  isPlaceholder,
};
