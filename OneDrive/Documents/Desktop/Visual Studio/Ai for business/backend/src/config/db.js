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
 * Auto-creates sample hackathon table and RAG pgvector tables if they don't already exist
 */
const initDb = async () => {
  if (isPlaceholder || !pool) return;

  try {
    // 1. Ensure hackathon_items table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS hackathon_items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);
    console.log('✅ Supabase PostgreSQL: `hackathon_items` table ready.');

    // 2. Ensure pgvector extension
    await pool.query(`CREATE EXTENSION IF NOT EXISTS vector;`);
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // 3. Ensure rag_documents table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rag_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        source VARCHAR(255) DEFAULT 'manual',
        chunk_index INTEGER DEFAULT 0,
        metadata JSONB DEFAULT '{}'::jsonb,
        embedding vector(768),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Ensure HNSW vector index
    await pool.query(`
      CREATE INDEX IF NOT EXISTS rag_documents_embedding_hnsw 
      ON rag_documents USING hnsw (embedding vector_cosine_ops);
    `);

    // 5. Ensure match_rag_documents RPC function
    await pool.query(`
      CREATE OR REPLACE FUNCTION match_rag_documents (
        query_embedding vector(768),
        match_threshold float DEFAULT 0.0,
        match_count int DEFAULT 5,
        filter_metadata jsonb DEFAULT '{}'::jsonb
      )
      RETURNS TABLE (
        id UUID,
        title VARCHAR(255),
        content TEXT,
        source VARCHAR(255),
        chunk_index INTEGER,
        metadata JSONB,
        similarity float
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT
          d.id,
          d.title,
          d.content,
          d.source,
          d.chunk_index,
          d.metadata,
          (1 - (d.embedding <=> query_embedding))::float AS similarity
        FROM rag_documents d
        WHERE 
          d.embedding IS NOT NULL
          AND (1 - (d.embedding <=> query_embedding)) >= match_threshold
          AND (filter_metadata = '{}'::jsonb OR d.metadata @> filter_metadata)
        ORDER BY d.embedding <=> query_embedding
        LIMIT match_count;
      END;
      $$;
    `);

    console.log('✅ Supabase PostgreSQL: pgvector & `rag_documents` ready for RAG.');
  } catch (err) {
    console.warn('⚠️ Could not auto-initialize tables or pgvector:', err.message);
  }
};

module.exports = {
  pool,
  query,
  testConnection,
  initDb,
  isPlaceholder,
};
