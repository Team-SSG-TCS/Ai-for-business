const { query } = require('../config/db');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Helper: Request embedding from AI service (or returns null if service is offline)
 */
async function fetchEmbeddingFromAiService(text, dimension = 768) {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/v1/rag/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, dimension }),
      signal: AbortSignal.timeout(6000),
    });
    if (response.ok) {
      const data = await response.json();
      return data.embedding || null;
    }
  } catch (err) {
    console.warn(`[RAG Embedding warning]: AI service embed request failed (${err.message})`);
  }
  return null;
}

/**
 * Returns RAG and pgvector health/status in Supabase DB
 */
const getRagStatus = async (req, res, next) => {
  try {
    // 1. Check vector extension
    const extResult = await query(`
      SELECT extname, extversion 
      FROM pg_extension 
      WHERE extname = 'vector';
    `);

    const isVectorEnabled = extResult.rows.length > 0;
    const vectorVersion = isVectorEnabled ? extResult.rows[0].extversion : null;

    // 2. Check rag_documents table count
    let docCount = 0;
    let tableExists = false;
    let hnswIndexExists = false;
    let sampleMatches = [];

    if (isVectorEnabled) {
      const tableCheck = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'rag_documents'
        );
      `);
      tableExists = tableCheck.rows[0]?.exists || false;

      if (tableExists) {
        const countRes = await query(`SELECT COUNT(*) as count FROM rag_documents;`);
        docCount = parseInt(countRes.rows[0]?.count || 0, 10);

        const indexCheck = await query(`
          SELECT indexname 
          FROM pg_indexes 
          WHERE tablename = 'rag_documents' AND indexname = 'rag_documents_embedding_hnsw';
        `);
        hnswIndexExists = indexCheck.rows.length > 0;

        // Fetch top recent documents preview
        const recentDocs = await query(`
          SELECT id, title, source, created_at, (embedding IS NOT NULL) AS has_embedding 
          FROM rag_documents 
          ORDER BY created_at DESC 
          LIMIT 3;
        `);
        sampleMatches = recentDocs.rows;
      }
    }

    res.json({
      success: true,
      pgvector: {
        enabled: isVectorEnabled,
        version: vectorVersion,
        table: 'rag_documents',
        tableExists,
        hnswIndexExists,
        vectorDimension: 768,
        recommendedEmbeddings: 'Google Gemini (gemini-embedding-001 output_dim=768)',
        documentsCount: docCount,
      },
      recentDocuments: sampleMatches,
      message: isVectorEnabled
        ? `pgvector is enabled (v${vectorVersion}) and Supabase is ready for RAG.`
        : 'pgvector is not enabled in database.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lists documents in the RAG repository
 */
const getDocuments = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || 50, 10);
    const offset = parseInt(req.query.offset || 0, 10);

    const result = await query(
      `
      SELECT 
        id, 
        title, 
        content, 
        source, 
        chunk_index, 
        metadata, 
        (embedding IS NOT NULL) AS has_embedding,
        created_at
      FROM rag_documents 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2;
    `,
      [limit, offset]
    );

    const totalCount = await query(`SELECT COUNT(*) as total FROM rag_documents;`);

    res.json({
      success: true,
      total: parseInt(totalCount.rows[0]?.total || 0, 10),
      count: result.rowCount,
      documents: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Inserts a document into Supabase RAG store.
 * Automatically generates 768-dim vector embedding if not provided.
 */
const addDocument = async (req, res, next) => {
  try {
    let { title, content, source = 'manual', chunk_index = 0, metadata = {}, embedding, auto_embed = true } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Both "title" and "content" are required.',
      });
    }

    // Auto-generate vector embedding if missing and auto_embed is true
    let embeddingGenerated = false;
    if ((!embedding || !Array.isArray(embedding)) && auto_embed) {
      const generated = await fetchEmbeddingFromAiService(`${title}\n\n${content}`, 768);
      if (generated) {
        embedding = generated;
        embeddingGenerated = true;
      }
    }

    let vectorString = null;
    if (embedding && Array.isArray(embedding)) {
      if (embedding.length !== 768) {
        return res.status(400).json({
          success: false,
          error: `Vector embedding must have exactly 768 dimensions (received ${embedding.length}).`,
        });
      }
      vectorString = `[${embedding.join(',')}]`;
    }

    const insertSql = `
      INSERT INTO rag_documents (title, content, source, chunk_index, metadata, embedding)
      VALUES ($1, $2, $3, $4, $5, $6::vector)
      RETURNING id, title, source, chunk_index, metadata, created_at, (embedding IS NOT NULL) AS has_embedding;
    `;

    const result = await query(insertSql, [
      title,
      content,
      source,
      chunk_index,
      JSON.stringify(metadata),
      vectorString,
    ]);

    res.status(201).json({
      success: true,
      message: 'Document stored in Supabase RAG store.',
      embeddingGenerated,
      document: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Performs semantic similarity search on Supabase with pgvector
 */
const searchDocuments = async (req, res, next) => {
  try {
    let { query_embedding, query_text, match_threshold = 0.0, match_count = 5, filter_metadata = {} } = req.body;

    // If query_text is given but no embedding, generate via AI service
    if (!query_embedding && query_text) {
      query_embedding = await fetchEmbeddingFromAiService(query_text, 768);
    }

    if (!query_embedding || !Array.isArray(query_embedding)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide `query_embedding` (array of 768 floats) or `query_text` with running AI service.',
      });
    }

    const vectorString = `[${query_embedding.join(',')}]`;

    const searchSql = `
      SELECT * FROM match_rag_documents(
        $1::vector,
        $2::float,
        $3::int,
        $4::jsonb
      );
    `;

    const result = await query(searchSql, [
      vectorString,
      match_threshold,
      match_count,
      JSON.stringify(filter_metadata),
    ]);

    res.json({
      success: true,
      query_text: query_text || null,
      matches_count: result.rowCount,
      matches: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Full End-to-End RAG Query:
 * 1. Embeds question
 * 2. Retrieves top matching chunks from Supabase pgvector
 * 3. Synthesizes a grounded answer via LLM
 */
const askRagQuestion = async (req, res, next) => {
  try {
    const { query: userQuery, match_count = 4, match_threshold = 0.2 } = req.body;

    if (!userQuery) {
      return res.status(400).json({ success: false, error: 'Query text is required.' });
    }

    // 1. Generate query embedding
    const queryEmbedding = await fetchEmbeddingFromAiService(userQuery, 768);
    if (!queryEmbedding) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate query embedding. Check that FastAPI AI service is running.',
      });
    }

    // 2. Vector search in Supabase
    const vectorString = `[${queryEmbedding.join(',')}]`;
    const searchSql = `
      SELECT * FROM match_rag_documents(
        $1::vector,
        $2::float,
        $3::int,
        '{}'::jsonb
      );
    `;

    const searchResult = await query(searchSql, [vectorString, match_threshold, match_count]);
    const matches = searchResult.rows;

    // 3. Extract contexts
    const contexts = matches.map(m => `[Source: ${m.title}] ${m.content}`);

    // 4. Synthesize final answer via AI service
    let synthesizedAnswer = 'No relevant context found in database.';
    let aiModel = 'unknown';
    let aiProvider = 'unknown';

    try {
      const askResponse = await fetch(`${AI_SERVICE_URL}/api/v1/rag/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQuery,
          contexts,
          system_prompt: 'You are an enterprise AI assistant. Ground your answer in the retrieved context.',
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (askResponse.ok) {
        const askData = await askResponse.json();
        synthesizedAnswer = askData.answer;
        aiModel = askData.model;
        aiProvider = askData.provider;
      }
    } catch (llmErr) {
      console.warn('AI service /rag/ask call failed:', llmErr.message);
      synthesizedAnswer = `Retrieved ${matches.length} matching documents, but AI service synthesis timed out. Context snippet: ${contexts[0] || 'None'}`;
    }

    res.json({
      success: true,
      query: userQuery,
      answer: synthesizedAnswer,
      model: aiModel,
      provider: aiProvider,
      retrieved_chunks_count: matches.length,
      retrieved_documents: matches,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a document by ID
 */
const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(`DELETE FROM rag_documents WHERE id = $1 RETURNING id;`, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    res.json({ success: true, message: 'Document deleted from RAG store.', id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRagStatus,
  getDocuments,
  addDocument,
  searchDocuments,
  askRagQuestion,
  deleteDocument,
};
