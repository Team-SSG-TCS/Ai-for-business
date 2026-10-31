const express = require('express');
const router = express.Router();
const {
  getRagStatus,
  getDocuments,
  addDocument,
  searchDocuments,
  askRagQuestion,
  deleteDocument,
} = require('../controllers/rag.controller');

// GET /api/rag/status - Check pgvector status and statistics
router.get('/status', getRagStatus);

// GET /api/rag/documents - List documents with pagination
router.get('/documents', getDocuments);

// POST /api/rag/documents - Store document (with auto or custom embedding)
router.post('/documents', addDocument);

// POST /api/rag/search - Vector similarity search
router.post('/search', searchDocuments);

// POST /api/rag/ask - Full RAG pipeline (embed -> retrieve -> synthesize)
router.post('/ask', askRagQuestion);

// DELETE /api/rag/documents/:id - Delete a document
router.delete('/documents/:id', deleteDocument);

module.exports = router;
