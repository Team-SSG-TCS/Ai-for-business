const express = require('express');
const router = express.Router();
const { testConnection, isPlaceholder } = require('../config/db');

// @route   GET /api/health
// @desc    Check Backend API status
router.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'backend-express',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: 'Express backend is online',
  });
});

// @route   GET /api/health/db
// @desc    Verify Supabase PostgreSQL connection
router.get('/db', async (req, res) => {
  if (isPlaceholder) {
    return res.json({
      success: false,
      connected: false,
      message: 'Supabase connection string contains [YOUR-PASSWORD]. Please update backend/.env with your password.',
    });
  }

  const result = await testConnection();
  if (result.connected) {
    return res.json({
      success: true,
      data: result,
      message: 'Supabase PostgreSQL connection verified',
    });
  } else {
    return res.status(503).json({
      success: false,
      data: result,
      message: result.message || 'Database connection error',
    });
  }
});

module.exports = router;
