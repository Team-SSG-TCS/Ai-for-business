const { pool } = require('../config/db');

async function run() {
  const client = await pool.connect();
  try {
    console.log('Connected to Supabase PostgreSQL database.');

    // 1. Check if pgvector is enabled
    const extCheck = await client.query(`
      SELECT extname, extversion 
      FROM pg_extension 
      WHERE extname = 'vector';
    `);

    if (extCheck.rows.length > 0) {
      console.log(`STATUS: pgvector is ALREADY ENABLED (version: ${extCheck.rows[0].extversion})`);
    } else {
      console.log('STATUS: pgvector is NOT ENABLED yet.');
      console.log('Attempting to enable pgvector extension...');
      
      // Try enabling in public or extensions schema
      try {
        await client.query(`CREATE EXTENSION IF NOT EXISTS vector;`);
        console.log('SUCCESS: Enabled extension "vector" directly.');
      } catch (err1) {
        console.log('Direct CREATE EXTENSION error:', err1.message);
        console.log('Trying CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions...');
        await client.query(`CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;`);
        console.log('SUCCESS: Enabled extension "vector" with schema extensions.');
      }
    }

    // 2. Verify extension functions and vector type
    const testVector = await client.query(`SELECT '[1,2,3]'::vector AS test_vec;`);
    console.log('VERIFICATION: Vector type test passed:', testVector.rows[0]);

    // 3. Query installed extensions list
    const allExts = await client.query(`SELECT extname, extversion FROM pg_extension ORDER BY extname;`);
    console.log('INSTALLED EXTENSIONS:', allExts.rows.map(r => `${r.extname} (${r.extversion})`));

  } catch (error) {
    console.error('ERROR during vector setup:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
