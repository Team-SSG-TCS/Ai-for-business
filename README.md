# 🛡️ ForensicIQ — Autonomous Financial Forensics & Mule Network Intelligence

> **AI for Business Hackathon** — An enterprise-grade, agentic Anti-Money Laundering (AML/CFT) surveillance and financial crime investigation platform powered by **LangGraph multi-agent orchestration**, **Cytoscape network graphs**, **Natural Language DB Assistant**, and **resilient multi-provider LLM failover**.

---

## 📌 Executive Summary & Problem Statement

Financial fraud syndicates exploit synthetic identities, digital mule rings, and high-frequency structuring (smurfing) across fragmented banking channels to evade traditional threshold-based AML rules. Manual forensics by compliance teams takes days per suspicious alert, creating regulatory bottlenecks and delayed account freezing.

**ForensicIQ** automates the end-to-end anti-financial crime workflow:
1. **Autonomous Investigation**: Orchestrated multi-agent pipeline using **LangGraph** to autonomously detect anomalies, trace money trails, resolve entity clusters, and enforce regulatory policies.
2. **Interactive Graph Intelligence**: Interactive Cytoscape graph visualizer mapping cross-account transactions, shared device fingerprints, common IP subnets, and beneficiary networks.
3. **Conversational Data Assistant**: Natural Language to SQL/data query assistant allowing compliance officers to interrogate transactional telemetry without writing code.
4. **FIU-IND Regulatory Compliance**: Auto-generates structured Suspicious Transaction Reports (STR) and Suspicious Activity Reports (SAR) ready for legal filing.

---

## 🏛️ System Architecture

ForensicIQ is built on an enterprise fullstack microservice architecture optimized for high throughput, modularity, and zero-downtime execution:

```
                            ┌─────────────────────────────────────────────────────────┐
                            │               React 19 Frontend Client                  │
                            │           TypeScript · Tailwind CSS v4 · Lucide         │
                            │                   http://localhost:5173                 │
                            └───────────────────────────┬─────────────────────────────┘
                                                        │
                                    ┌───────────────────┴───────────────────┐
                                    │                                       │
                                    ▼                                       ▼
                     ┌─────────────────────────────┐         ┌─────────────────────────────┐
                     │       Express Backend       │         │     FastAPI AI Service      │
                     │    Node.js (Direct SQL)     │         │ Python 3.11 · LangGraph     │
                     │    http://localhost:5000    │◄───────►│    http://localhost:8000    │
                     └──────────────┬──────────────┘         │   Interactive Docs: :8000/docs│
                                    │                        │  Graph Viewer: /langgraph-view│
                                    ▼                        └──────────────┬──────────────┘
                     ┌─────────────────────────────┐                        │
                     │    Supabase PostgreSQL      │                        ▼
                     │       (Direct pg.Pool)      │         ┌─────────────────────────────┐
                     └─────────────────────────────┘         │  LLM Engine & Multi-Failover│
                                                             │ Gemini · Groq · DeepSeek    │
                                                             └─────────────────────────────┘
```

### Microservice Topology

| Service | Technology Stack | Port | Directory | Primary Responsibilities |
|---|---|---|---|---|
| **Client** | React 19, TypeScript, Tailwind CSS v4, Cytoscape.js, Framer Motion, Lucide | `5173` | `/client` | Interactive analyst dashboard, LangGraph pipeline visualizer, network intelligence graph, money trail simulator, DB assistant |
| **Backend** | Node.js, Express, `pg` direct connection pool, CORS, Dotenv | `5000` | `/backend` | High-throughput data access, Supabase PostgreSQL queries, operational audit logs, transaction records |
| **AI Service** | FastAPI, LangGraph, Pydantic v2, Uvicorn, httpx | `8000` | `/ai-service` | Multi-agent forensic pipeline, anomaly detection, network link extraction, guardrails, LLM failover engine |
| **Database** | Supabase Cloud PostgreSQL | `5432` | Remote | ACID relational store for cases, transactions, customer profiles, and remediation audits |

---

## 🌟 Key Platform Modules & Capabilities

### 1. 🤖 LangGraph Multi-Agent Investigation Pipeline
A stateful, directed acyclic graph (DAG) multi-agent workflow that coordinates specialized forensic agents:
- **Anomaly Detection Agent**: Evaluates velocity spikes, off-hours execution, structuring below ₹50,000 reporting thresholds, and sudden volume jumps.
- **Network Link Analysis Agent**: Traverses relational graphs to uncover shared IP subnets, device hardware UUIDs, and common destination accounts.
- **Entity Resolution Agent**: Clusters synthetic identities and alias names across banking entities using fuzzy matching and device telemetry.
- **Regulatory Compliance Agent**: Evaluates transactions against PMLA (Prevention of Money Laundering Act), RBI guidelines, and FIU-IND directives.
- **SAR/STR Report Generator Agent**: Synthesizes forensic findings into compliant legal narratives and recommended remediation actions (Account Freeze, ED Referral, Watchlist).
- **Interactive Visualizer**: Built-in visualizers both in React (`LangGraphVisualizerReact`) and via FastAPI endpoint (`/langgraph-view`) showing real-time agent execution states and tool outputs.

### 2. 🕸️ Cytoscape Network Intelligence & Money Trail
- **Visual Graph Topology**: Real-time graph mapping sender/receiver nodes, transactional volumes, hop latencies, and intermediary mule bridges.
- **Layering & Smurfing Detection**: Identifies rapid dispersal and aggregation cycles (fan-out / fan-in money flows).
- **Device & Geolocation Clustering**: Highlights accounts linked via identical MAC addresses or NATed IP endpoints.

### 3. 💬 Natural Language DB Assistant (`DBAssistant.tsx`)
- Allows compliance analysts and forensic auditors to ask natural language questions (e.g., *"Show all transactions from accounts opened within 30 days that transferred over ₹2,00,000"*).
- Converts conversational queries into verified SQL queries with execution plans and tabular data visualization.
- Pre-configured forensic telemetry filters for rapid investigation.

### 4. 📁 Data Ingestion & Anomaly Scanning
- **Native File Ingestion**: Drag-and-drop or file upload supporting live CSV datasets.
- **Real-Time Anomaly Scanner**: Pre-scans batches before DB ingestion to score risk levels and isolate suspicious patterns.
- **Bundled Evaluation Datasets** (`sample_datasets/`):
  - `01_CRITICAL_mule_ring_structuring.csv`: Coordinated syndicate performing sub-threshold deposits followed by rapid consolidation into an offshore beneficiary.
  - `02_BENIGN_campus_wifi_nat.csv`: High transaction concurrency from a single public IP address, proven to be false-positive university Wi-Fi NAT.
  - `03_CORPORATE_payroll_batch.csv`: High-volume scheduled bulk salary disbursement with consistent enterprise sender patterns.

### 5. 🛡️ Enterprise LLM Guardrails & Failover Architecture
- **Multi-Provider LLM Orchestration**: Automatic fallover chain (`Groq` ➔ `Google Gemini` ➔ `DeepSeek` ➔ `Offline Mock Engine`). Guarantees zero 500 errors during operations or hackathon presentations.
- **Prompt Injection Defense**: Pre-execution regex and semantic heuristics intercept prompt injection and jailbreak attempts.
- **PII Redaction**: Automatically redacts emails, phone numbers, Aadhaar/SSN, and payment card numbers before passing prompts to external APIs.
- **Model Fallback**: Bypasses rate limits and upstream 503 high-demand errors through dynamic model fallback (`gemini-2.5-flash` ➔ `gemini-3.5-flash-lite` ➔ `gemini-3.8-flash`).

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js** >= 18.x (tested on v22)
- **Python** >= 3.10 (tested on 3.11 / 3.13)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Team-SSG-TCS/Ai-for-business.git
cd Ai-for-business
```

### 2. Environment Configuration

#### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.lfzvcpjxxtqhqksugowg.supabase.co:5432/postgres
CLIENT_ORIGIN=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

#### AI Service (`ai-service/.env`)
Copy `ai-service/.env.example` to `ai-service/.env`:
```env
PORT=8000
HOST=0.0.0.0
DEBUG=True

# LLM Providers (Configure one or all - Auto-Failover enabled)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b

DEEPSEEK_API_KEY=your_deepseek_api_key_here

DEFAULT_PROVIDER=auto
ENABLE_INJECTION_GUARDRAIL=True
ENABLE_PII_REDACTION=True
```

#### Client (`client/.env`)
Copy `client/.env.example` to `client/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8000
```

### 3. Install All Dependencies
From the repository root:
```bash
npm run install:all
```
*(Installs client npm modules, backend npm modules, and Python requirements in one command)*.

---

## 🚀 Running the Platform

### Option A: Concurrently (Single Terminal)
```bash
npm run dev
```
Launches React Client, Express Backend, and FastAPI AI Service simultaneously with synchronized colored logging.

### Option B: Windows 1-Click Launchers
Double-click `start-all.bat` or run in PowerShell:
```powershell
.\start-all.ps1
```
Spawns three dedicated terminal windows for each microservice.

### Option C: Individual Terminals
```bash
# Terminal 1: Client (:5173)
cd client && npm run dev

# Terminal 2: Backend (:5000)
cd backend && npm run dev

# Terminal 3: AI Service (:8000)
cd ai-service && python main.py
```

### Access URLs
- **Analyst Web Dashboard**: [http://localhost:5173](http://localhost:5173)
- **AI Service Swagger API**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **LangGraph Visualizer**: [http://localhost:8000/langgraph-view](http://localhost:8000/langgraph-view)
- **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 API Reference

### Express Backend (`http://localhost:5000`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status and uptime |
| `GET` | `/api/health/db` | Supabase PostgreSQL direct connectivity verification |
| `GET` | `/api/items` | Fetch stored audit items and operational records |
| `POST` | `/api/items` | Insert an item (`{ title, description }`) |
| `DELETE` | `/api/items/:id` | Remove an audit item by ID |

### FastAPI AI Service (`http://localhost:8000`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Check AI microservice health and active providers |
| `GET` | `/docs` | Interactive OpenAPI Swagger UI documentation |
| `GET` | `/langgraph-view` | Interactive HTML visualization of multi-agent graph |
| `POST` | `/api/v1/investigation/run` | Execute full LangGraph forensic investigation pipeline |
| `POST` | `/api/v1/investigation/scan-dataset` | Anomaly scan uploaded transaction CSV dataset |
| `GET` | `/api/v1/investigation/case-graph/{case_id}` | Retrieve Cytoscape-formatted graph for a case |
| `POST` | `/api/v1/investigation/remediate` | Apply forensic remediation actions (Freeze, STR file) |
| `POST` | `/api/v1/chat` | Conversational forensic chat with guardrails & failover |
| `POST` | `/api/v1/analyze` | Text and transaction pattern analysis with risk scoring |
| `POST` | `/api/v1/guardrails/check` | Standalone prompt injection and PII leak analysis |
| `GET` | `/api/v1/models` | List configured LLM models, latencies, and statuses |

---

## 🧪 Knowledge Graph First (`graphify-out/`)

This project is indexed into a persistent semantic knowledge graph (`graphify-out/`) covering **634+ symbols, dependencies, and API endpoints**.
- Visual interactive graph: Open `graphify-out/graph.html` in any browser.
- Graph analysis report: Read [`graphify-out/GRAPH_REPORT.md`](graphify-out/GRAPH_REPORT.md) for architectural clusters and community metrics.
- Incremental update: Run `graphify update .` after modifications.

---

## 🛡️ License & Team
Developed for the **AI for Business Hackathon** by **Team SSG TCS**.
Licensed under the ISC License.
