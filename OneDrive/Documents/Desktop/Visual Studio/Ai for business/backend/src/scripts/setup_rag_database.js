const { pool } = require('../config/db');

async function setupRagDatabase() {
  const client = await pool.connect();
  try {
    console.log('🚀 Starting Supabase RAG Database Setup with pgvector...');

    // 1. Enable pgvector and uuid extensions
    console.log('1. Ensuring extensions are enabled...');
    await client.query(`CREATE EXTENSION IF NOT EXISTS vector;`);
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    const extInfo = await client.query(`
      SELECT extname, extversion 
      FROM pg_extension 
      WHERE extname = 'vector';
    `);
    console.log(`   ✅ Extension "vector" is active (version ${extInfo.rows[0]?.extversion}).`);

    // 2. Create rag_documents table
    console.log('2. Creating "rag_documents" table for embeddings and document chunks...');
    await client.query(`
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
    console.log('   ✅ Table "rag_documents" created/verified.');

    // 3. Create HNSW Index
    console.log('3. Creating HNSW vector index for high-performance approximate nearest neighbor search...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS rag_documents_embedding_hnsw 
      ON rag_documents USING hnsw (embedding vector_cosine_ops);
    `);
    console.log('   ✅ HNSW index "rag_documents_embedding_hnsw" created/verified.');

    // 4. Create GIN index for JSONB metadata filtering
    await client.query(`
      CREATE INDEX IF NOT EXISTS rag_documents_metadata_gin 
      ON rag_documents USING gin (metadata);
    `);
    console.log('   ✅ GIN metadata index created/verified.');

    // 5. Create or Replace match_rag_documents RPC function
    console.log('4. Creating "match_rag_documents" similarity search function...');
    await client.query(`
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
    console.log('   ✅ Function "match_rag_documents" created/verified.');

    // 6. Test with a sample embedding vector insertion and search
    console.log('5. Testing sample vector insertion and retrieval...');
    
    // Generate a dummy normalized 768-dim vector for testing
    const sampleVec = new Array(768).fill(0);
    sampleVec[0] = 0.5;
    sampleVec[1] = 0.5;
    sampleVec[2] = 0.7071;
    const sampleVecStr = `[${sampleVec.join(',')}]`;

    // Check if test document already exists
    const checkTestDoc = await client.query(
      `SELECT id FROM rag_documents WHERE title = $1 LIMIT 1;`,
      ['Welcome to AI for Business RAG']
    );

    if (checkTestDoc.rows.length === 0) {
      await client.query(`
        INSERT INTO rag_documents (title, content, source, chunk_index, metadata, embedding)
        VALUES (
          'Welcome to AI for Business RAG',
          'This repository is powered by Supabase PostgreSQL pgvector, Express.js backend, and FastAPI AI engine. It supports semantic search, retrieval augmented generation, and real-time embedding indexing.',
          'system_init',
          0,
          '{"category": "documentation", "author": "system"}'::jsonb,
          $1::vector
        );
      `, [sampleVecStr]);
      console.log('   ✅ Inserted starter RAG document.');
    } else {
      console.log('   ℹ️ Starter RAG document already exists.');
    }

    // Test calling match_rag_documents
    const testMatch = await client.query(`
      SELECT * FROM match_rag_documents(
        $1::vector,
        0.5,
        3,
        '{}'::jsonb
      );
    `, [sampleVecStr]);

    console.log(`   ✅ match_rag_documents returned ${testMatch.rows.length} matches:`);
    testMatch.rows.forEach(r => {
      console.log(`      - Title: "${r.title}", Similarity: ${r.similarity.toFixed(4)}`);
    });

    console.log('\n🎉 ALL DONE! Supabase PostgreSQL is 100% READY for RAG application development.');

  } catch (error) {
    console.error('❌ Error setting up RAG database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

setupRagDatabase();
