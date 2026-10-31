# Backend Service (Node.js + Express + Supabase PostgreSQL)

A high-performance Express backend without ORMs, utilizing a direct `pg` connection pool connected to Supabase PostgreSQL.

## Features
- **No ORM Overhead**: Direct, fast SQL queries with parameterized statements preventing SQL injection.
- **Supabase Pooler**: Pre-configured with SSL `{ rejectUnauthorized: false }` for Supabase direct access.
- **Safe Fallback**: If `[YOUR-PASSWORD]` is still in `.env`, it provides friendly JSON responses rather than crashing.
- **Auto-Table Creation**: Creates a starter `hackathon_items` table automatically when valid DB credentials are provided.

## Quick Start

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure your Supabase Database Password in `backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_REAL_PASSWORD_HERE@db.lfzvcpjxxtqhqksugowg.supabase.co:5432/postgres
   ```

3. Start server in development mode (hot-reloading):
   ```bash
   npm run dev
   ```

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status index |
| `GET` | `/api/health` | Backend server health check |
| `GET` | `/api/health/db` | Tests live Supabase PostgreSQL connection |
| `GET` | `/api/items` | Raw SQL `SELECT` all items |
| `POST` | `/api/items` | Raw SQL `INSERT` new item (`title`, `description`) |
| `DELETE` | `/api/items/:id` | Raw SQL `DELETE` item by ID |

## How to Query Supabase in Your Routes

```javascript
const db = require('../config/db');

// Example query in any controller:
const { rows } = await db.query(
  'SELECT * FROM users WHERE role = $1',
  ['admin']
);
```
