const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDb, isPlaceholder } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const healthRoutes = require('./routes/health.routes');
const itemsRoutes = require('./routes/items.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow any origin during hackathon prototyping
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Hackathon Express Backend (No ORM, Raw pg)',
    endpoints: {
      health: '/api/health',
      dbCheck: '/api/health/db',
      items: '/api/items',
    },
  });
});

// Route Mounts
app.use('/api/health', healthRoutes);
app.use('/api/items', itemsRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, async () => {
  console.log('==================================================');
  console.log(`🚀 Express Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Supabase DB Check: http://localhost:${PORT}/api/health/db`);

  if (isPlaceholder) {
    console.log('⚠️  NOTE: DATABASE_URL has [YOUR-PASSWORD].');
    console.log('   Replace with your actual Supabase DB password in backend/.env');
  } else {
    console.log('🔄 Attempting to initialize Supabase PostgreSQL tables...');
    await initDb();
  }
  console.log('==================================================');
});
