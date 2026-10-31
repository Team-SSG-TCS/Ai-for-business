# 🚀 AI For Business — 4-Hour Hackathon Starter

A battle-tested fullstack microservice architecture optimized for speed, team collaboration, and rapid prototyping during a 4-hour hackathon sprint.

---

## 🏛️ System Architecture & Port Allocation

```
                        ┌─────────────────────────────────────────────────────────┐
                        │                       React 19 Client                   │
                        │                 TypeScript + Tailwind CSS v4            │
                        │                  http://localhost:5173                  │
                        └───────────────────────────┬─────────────────────────────┘
                                                    │
                                ┌───────────────────┴───────────────────┐
                                │                                       │
                                ▼                                       ▼
                 ┌─────────────────────────────┐         ┌─────────────────────────────┐
                 │       Express Backend       │         │      FastAPI AI Service     │
                 │      (Node.js, No ORM)      │         │    (Python 3.11, Uvicorn)   │
                 │    http://localhost:5000    │◄───────►│    http://localhost:8000    │
                 └──────────────┬──────────────┘         │      Swagger: :8000/docs    │
                                │                        └─────────────────────────────┘
                                ▼
                 ┌─────────────────────────────┐
                 │    Supabase PostgreSQL      │
                 │     (Direct pg.Pool)        │
                 └─────────────────────────────┘
```

| Service | Technology | Port | Directory | Purpose |
|---|---|---|---|---|
| **Client** | React 19, TypeScript, Tailwind CSS v4, Lucide | `5173` | `/client` | User dashboard, interactive UI, team monitor |
| **Backend** | Node.js, Express, `pg` (No ORM), CORS | `5000` | `/backend` | Business logic, API routes, Supabase queries |
| **AI Service** | FastAPI, Pydantic, Uvicorn, httpx | `8000` | `/ai-service` | Prompt chains, LLM analysis, AI pipelines |
| **Database** | Supabase Cloud PostgreSQL | `5432` | Remote | Cloud database storage |

---

## ⚡ Quick Start (1-Command Launch)

### Option A: Run All Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```
*This launches the React Client, Express Backend, and FastAPI AI Service simultaneously in a single terminal with colored logs.*

### Option B: Windows 1-Click Launchers
- Double-click **`start-all.bat`** or run **`.\start-all.ps1`**
*Spawns 3 independent terminal windows for each service.*

### Option C: Individual Terminals
```bash
# Terminal 1: Client
cd client
npm run dev

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: AI Service
cd ai-service
python main.py
```

---

## 🔑 Supabase Database Setup

Your backend is pre-wired to connect directly to Supabase via raw `pg.Pool` (no ORM overhead).

1. Open `backend/.env`
2. Replace `[YOUR-PASSWORD]` with your actual Supabase database password:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@db.lfzvcpjxxtqhqksugowg.supabase.co:5432/postgres
   ```
3. Restart or start the backend:
   ```bash
   cd backend && npm run dev
   ```
4. Verify the connection by visiting:
   - `http://localhost:5000/api/health/db`
   - Or click **"Execute Test Route"** in the React Client dashboard at `http://localhost:5173`.

> 💡 **Auto-Table Creation**: When a valid password is supplied, the backend automatically executes `CREATE TABLE IF NOT EXISTS hackathon_items (...)` so your team doesn't need to manually configure tables in the Supabase web dashboard!

---

## 🤖 AI Service Configuration (FastAPI)

The AI service comes with **Zero-Config Offline Mode** enabled out of the box so frontend and backend teammates can build features immediately without needing API keys.

### Switching to Live LLMs (OpenAI or Gemini):
Open `ai-service/.env` and update:
```env
# For OpenAI:
AI_PROVIDER=openai
AI_MODEL_NAME=gpt-4o-mini
OPENAI_API_KEY=sk-...

# Or for Google Gemini:
AI_PROVIDER=gemini
GEMINI_API_KEY=AIzaSy...
```

Restart FastAPI with `python main.py` or `uvicorn main:app --reload --port 8000`.

---

## 👥 4-Hour Hackathon Team Role Playbook

| Team Member | Focus Area | Files to Work On |
|---|---|---|
| **Frontend Engineer** | UI / UX / Presentation | `client/src/components/*`<br>`client/src/App.tsx`<br>`client/src/services/api.ts` |
| **Backend Engineer** | Data layer, DB queries & endpoints | `backend/src/controllers/*`<br>`backend/src/routes/*`<br>`backend/src/config/db.js` |
| **AI / ML Engineer** | Prompt design, LLM orchestration, pipelines | `ai-service/app/api/v1/endpoints/*`<br>`ai-service/app/services/ai_engine.py`<br>`ai-service/app/schemas/ai.py` |

By keeping these 3 directories modular, your team can commit to Git without facing merge conflicts during the 4-hour countdown.

---

## 🛠️ API Cheatsheet

### Express Backend Endpoints (`:5000`)
- `GET  /api/health` — Check backend status
- `GET  /api/health/db` — Check Supabase PostgreSQL connectivity
- `GET  /api/rag/status` — Check pgvector status, version, and document counts
- `GET  /api/rag/documents` — List stored RAG documents & embeddings
- `POST /api/rag/documents` — Ingest document (auto-generates 768-dim embedding via AI service)
- `POST /api/rag/search` — Semantic similarity vector search (`{ "query_text": "...", "match_count": 5 }`)
- `POST /api/rag/ask` — End-to-end RAG pipeline (`{ "query": "..." }`)
- `GET  /api/items` — Raw SQL `SELECT` hackathon items
- `POST /api/items` — Raw SQL `INSERT` new hackathon item (`{ "title": "...", "description": "..." }`)

### FastAPI AI Endpoints (`:8000`)
- `GET  /docs` — Interactive Swagger documentation & tester
- `GET  /health` — Check AI service status
- `POST /api/v1/rag/embed` — Generate 768-dim dense vector embedding (Gemini `gemini-embedding-001`)
- `POST /api/v1/rag/ask` — Context-grounded RAG answer synthesis
- `POST /api/v1/chat` — Generate response from prompt (`{ "prompt": "...", "system_prompt": "..." }`)
- `POST /api/v1/analyze` — Text analysis & entity/sentiment extraction (`{ "text": "..." }`)
