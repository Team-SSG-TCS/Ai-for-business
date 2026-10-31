# 🛡️ NEXORA — Autonomous Financial Forensics & Mule Network Intelligence

> **AI for Business** — An enterprise-grade, agentic Anti-Money Laundering (AML/CFT) surveillance and financial crime intelligence platform powered by **LangGraph multi-agent orchestration**, **Cytoscape network topology graphs**, **Natural Language DB Assistant**, and **resilient multi-provider LLM failover**.

---

## 📌 Executive Summary & Problem Statement

Financial crime syndicates increasingly exploit **synthetic identities**, **distributed money mule rings**, **device farming (emulators)**, and **micro-structuring (smurfing)** to intentionally evade traditional rule-based threshold detection (e.g. BSA $10,000 / FIU-IND ₹10,00,000 CTR limits). 

Compliance analysts face days of manual legwork per alert to cross-reference core banking switch packets, device hardware identifiers, and proxy hops. This lag allows fraudulent capital to be layered, liquidated, and siphoned before accounts can be interdicted.

**NEXORA** transforms anti-financial crime operations by replacing static rules with an **autonomous 6-node LangGraph multi-agent state machine**:
1. **Autonomous Dialectical Reasoning**: Simulates legal courtroom dialectics—a **Forensic Prosecutor Agent** compiles indictments while an adversarial **Devil's Advocate Agent** aggressively stress-tests legitimate commercial explanations (corporate payroll batches, campus Wi-Fi NAT).
2. **Interactive Topology Forensics**: Direct in-browser Cytoscape graph canvas visualizing multi-hop fund flows, device bindings, and circular round-trip laundering loops.
3. **Conversational Forensic Copilot**: Context-aware AI assistant grounded in case evidence and statutory regulations (PMLA 2002, FIU-IND, 31 U.S.C. 5324) with strict PII redaction and injection guardrails.
4. **Automated Interdiction & Regulatory Filing**: One-click core banking debit holds, hardware terminal blacklisting, and auto-generated FIU-IND Form-A / FinCEN SAR drafts.

---

## 🏛️ High-Level Design (HLD)

NEXORA is engineered as a decoupled, multi-tier microservice architecture prioritizing high throughput, deterministic mathematical auditing, and zero-downtime resilient failover.

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │             NEXORA Presentation Tier (React 19)        │
                                  │      TypeScript · Tailwind v4 · Cytoscape.js · Recharts│
                                  │              http://localhost:5173                     │
                                  └───────────────┬────────────────────────┬───────────────┘
                                                  │                        │
                                 Direct Data / UI │                        │ Autonomous Agents
                                                  ▼                        ▼
                       ┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
                       │     Express Core Backend (Node.js)  │  │      NEXORA AI Engine (FastAPI)     │
                       │     High-Throughput Ingestion REST  │  │   Python 3.11+ · LangGraph · Uvicorn│
                       │         http://localhost:5000       │  │        http://localhost:8000        │
                       └──────────────────┬──────────────────┘  └──────────────────┬──────────────────┘
                                          │                                        │
                         Relational State │                         Network Engine │ Graph Traversal
                                          ▼                                        ▼
                       ┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
                       │      Supabase PostgreSQL Cloud      │  │     NetworkX Graph & Topology Hub   │
                       │   ACID Transactions, Audit Records  │  │   Ego-Subgraph, Centrality Algorithms│
                       └─────────────────────────────────────┘  └──────────────────┬──────────────────┘
                                                                                   │
                                                                   Agentic Routing │ Fallback Chain
                                                                                   ▼
                                                                ┌─────────────────────────────────────┐
                                                                │  Multi-Provider LLM & Guardrails    │
                                                                │  Groq (GPT-120B) ➔ Gemini ➔ DeepSeek │
                                                                └─────────────────────────────────────┘
```

### Architectural Tiers Breakdown

| Architectural Tier | Technology & Libraries | Core Purpose |
|:---|:---|:---|
| **1. Presentation & Forensic UI** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Cytoscape.js, Recharts | Interactive analyst workspace, 9-stage investigation pipeline, live LangGraph state visualizer, money trail graph, natural language DB assistant. |
| **2. API & Ingestion Gateway** | Express.js, Node.js v22, `pg` direct pool, CORS, Multer | High-speed batch ingestion of core banking CSVs, switch logs, and persistent database queries. |
| **3. Multi-Agent Orchestration** | FastAPI, LangGraph, LangChain, Pydantic v2 | Stateful 6-agent collaborative DAG execution, state checkpointing, deterministic tool routing, and SAR narrative synthesis. |
| **4. Graph & Anomaly Analytics** | NetworkX, NumPy, Scikit-learn, Cytoscape | Ego-subgraph extraction (2-3 hops), eigenvector centrality calculation, CTR structuring bands, and rapid drain velocity funnels. |
| **5. Database & Audit Store** | Supabase Managed PostgreSQL | Relational storage for customer profiles, account ledgers, alert queues, and immutable compliance remediation audit logs. |
| **6. LLM Inference & Safety Shield** | Groq Cloud, Google Gemini, DeepSeek, Custom Guardrails | Multi-provider auto-failover, semantic prompt injection interception, and automatic PII redaction (PAN, Aadhaar, SSN, Card numbers). |

---

## 🔄 End-to-End Investigation Lifecycle (The 9-Stage Flow)

NEXORA models the complete lifecycle of a financial crime investigation across 9 transparent stages:

```
[1. Entity Resolution] ──► [2. Relationship Graph] ──► [3. Anomaly Detection]
                                                              │
[6. Cryptographic Proof] ◄── [5. AI Prosecution] ◄── [4. Money Trail Hops]
        │
        ▼
[7. Devil's Advocate] ──► [8. Confidence Scoring] ──► [9. Regulatory STR & Interdiction]
```

1. **Stage 1: Multi-Entity Resolution & Identity Linking**:
   - Groups disparate bank accounts into unified syndicate clusters using physical device hardware IMEI, MAC addresses, and network fingerprints.
2. **Stage 2: Relationship Graph Construction (Cytoscape.js)**:
   - Renders interactive subgraphs calculating node degrees, flow volume, and most central syndicate hubs via eigenvector centrality.
3. **Stage 3: Deterministic Anomaly Detection**:
   - Evaluates mathematical anomalies against 90-day baselines: sub-threshold structuring bands, rapid outflow velocity funnels, and Android emulator VM signatures.
4. **Stage 4: Dynamic Money Trail Reconstruction**:
   - Synthesizes chronological multi-hop transfers (`HOP 0` ➔ `HOP 1` ➔ `HOP 2`...) identifying fund splits, intermediary pass-through mules, and circular kickback loops.
5. **Stage 5: Multi-Agent AI Prosecution Synthesis**:
   - Lead Forensic Agent formulates the indictment citing primary statutory violations (PMLA 2002 Section 3, 31 U.S.C. 5324) and syndicate typologies.
6. **Stage 6: Cryptographic Evidence Discovery**:
   - Generates tamper-evident core banking packets with HMAC-SHA256 signature hashes for regulatory and court submission.
7. **Stage 7: Alternative Explanations & Devil's Advocate**:
   - Adversarial defense counsel agent aggressively evaluates non-malicious business justifications (e.g. corporate payroll batches, university campus Wi-Fi NAT) to prevent false positives.
8. **Stage 8: Transparent Confidence Scoring Matrix**:
   - Displays an exact mathematical audit ledger balancing prosecution risk weights against defense mitigating dampeners to reach an objective score (e.g. 95/100).
9. **Stage 9: Regulatory Investigation Narrative & Interdiction**:
   - Auto-generates compliant FIU-IND STR Form-A / FinCEN SAR narratives and provides one-click digital sign-off to execute immediate CBS account freezes and device blacklisting.

---

## 🌟 Key Modules & Innovations

### 1. 🤖 LangGraph Multi-Agent State Machine
Operates an asynchronous, typed shared state (`InvestigationState`) across 6 collaborative roles:
- `Triage Agent`: Ingestion and cluster resolution (`resolve_cross_account_identities`).
- `Topology Agent`: NetworkX ego-graph expansion and hub identification (`extract_ego_subgraph`).
- `Prosecution Reasoner`: Deterministic structuring and velocity calculation (`detect_structuring_and_velocity`).
- `Devil's Advocate`: Exculpatory business evidence verification (`evaluate_benign_business_context`).
- `Compliance Adjudicator`: Dialectical debate synthesis and composite risk calculation (`adjudicate_aml_risk`).
- `Interdiction Enforcement Agent`: Core banking interdiction and STR narrative authoring (`execute_remediation_interdiction`).

### 2. 💬 Conversational Forensic Copilot
- Integrated side-drawer assistant accessible from any investigation screen.
- Directly connected to live LLM engines (Groq GPT-120B / Gemini) with full case context injection (seed ID, customer name, transaction values, risk points).
- Pre-execution guardrails automatically sanitize PII and block jailbreak attempts.

### 3. 🔍 Natural Language DB Assistant (`DBAssistant.tsx`)
- Enables non-technical compliance officers to query database telemetry using conversational English.
- Generates verified SQL queries, displays query execution metrics, and produces real-time chart visualizations.

### 4. 📁 Data Ingestion & Live Surveillance Hub
- Ingestion of live banking transaction datasets (CSV / JSON).
- Automatically parses seed entities and synchronizes findings across the **Surveillance Dashboard** and **Flagged Queue**.
- Includes pre-packaged test datasets in [`sample_datasets/`](sample_datasets/):
  - `01_CRITICAL_mule_ring_structuring.csv`: High-risk smurfing and pass-through mule network.
  - `02_BENIGN_campus_wifi_nat.csv`: False-positive high concurrency from university Wi-Fi NAT.
  - `03_CORPORATE_payroll_batch.csv`: Legitimate corporate contractor payroll disbursement.

---

## ⚡ Quick Start & Setup

### Prerequisites
- **Node.js** >= 18.x (tested on v22)
- **Python** >= 3.10 (tested on Python 3.11 & 3.13)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Team-SSG-TCS/Ai-for-business.git
cd Ai-for-business
```

### 2. Configure Environment Files

#### AI Service (`ai-service/.env`)
```env
PORT=8000
HOST=0.0.0.0
DEBUG=True

# LLM Providers (Multi-Provider Auto-Failover Enabled)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b

GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite

DEEPSEEK_API_KEY=your_deepseek_api_key_here

DEFAULT_PROVIDER=auto
ENABLE_INJECTION_GUARDRAIL=True
ENABLE_PII_REDACTION=True

# Statutory Jurisdiction
AML_JURISDICTION=INDIA
CTR_THRESHOLD_INR=1000000.0
REGULATORY_BODY=FIU-IND
AML_STATUTE=PMLA 2002 (Sec 3 & 12)
```

#### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.lfzvcpjxxtqhqksugowg.supabase.co:5432/postgres
CLIENT_ORIGIN=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

#### Client (`client/.env`)
```env
VITE_BACKEND_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8000
```

### 3. Install Dependencies
```bash
npm run install:all
```

---

## 🚀 Running the Platform

### Single-Command Unified Launch
```bash
npm run dev
```
Launches the React Client (`:5173`), Express Backend (`:5000`), and FastAPI AI Service (`:8000`) concurrently.

### Windows 1-Click Launchers
Double-click `start-all.bat` or run:
```powershell
.\start-all.ps1
```

### Microservice Endpoints
- **NEXORA Web Dashboard**: [http://localhost:5173](http://localhost:5173)
- **AI Service OpenAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **LangGraph Visualizer**: [http://localhost:8000/langgraph-view](http://localhost:8000/langgraph-view)
- **Express Backend Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 API Reference Summary

### AI Microservice (`http://localhost:8000`)

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/health` | Check health, active provider (`groq`, `gemini`, etc.), and model |
| `POST` | `/api/v1/investigation/langgraph/run` | Execute 6-agent LangGraph state machine on any seed entity or transaction |
| `POST` | `/api/v1/investigation/langgraph/autonomous-scan` | Autonomous full-database scan discovering all hidden syndicates |
| `POST` | `/api/v1/chat` | Conversational forensic chat with guardrails & multi-provider failover |
| `GET` | `/api/v1/investigation/{case_id}/graph` | Cytoscape-formatted network graph with node degrees & flows |
| `POST` | `/api/v1/investigation/remediate` | Apply interdiction remediation fixes (account debit freeze, IMEI block) |
| `GET` | `/langgraph-view` | Interactive Mermaid / HTML view of LangGraph agent state transitions |

### Core Backend (`http://localhost:5000`)

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/health` | Service uptime and system metrics |
| `GET` | `/api/health/db` | Direct Supabase PostgreSQL connectivity audit |
| `GET` | `/api/items` | Retrieve stored audit log items and operational records |
| `POST` | `/api/items` | Record new compliance enforcement item |

---

## 🧪 Testing & Verification

Run the comprehensive forensic test suite:
```bash
cd ai-service
python test_investigation.py
```
**Tests Covered**:
- `CASE-2026-8812`: Organized Mule Structuring Ring (`CRITICAL`, Score: 98/100)
- `CASE-2026-4409`: High-Velocity Corporate Contractor Payroll (`CLEARED`, Score: 15/100)
- `CASE-2026-9034`: Account Takeover via Impossible Travel Velocity
- `Ad-Hoc Evaluation`: Dynamic transaction evaluation via LangGraph tools

---

## 🛡️ Team & License

Developed for the **AI for Business** by **Team SSG TCS**.  
Project: **NEXORA — Autonomous Financial Forensics & Mule Network Intelligence**.  
Licensed under the **ISC License**.
