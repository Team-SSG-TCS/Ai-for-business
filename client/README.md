# Frontend Client (React + TypeScript + Tailwind CSS)

Built with **Vite 8**, **React 19**, **TypeScript**, and **Tailwind CSS v4** for high-speed hackathon prototyping.

## Quick Start

```bash
cd client
npm install
npm run dev
```

The application runs on `http://localhost:5173`.

## Architecture & Folder Structure

```
client/
├── src/
│   ├── components/
│   │   ├── common/       # Shared UI buttons, inputs, modals
│   │   ├── layout/       # Navbar, Footer, Page containers
│   │   └── dashboard/    # Microservice status monitor & test runners
│   ├── services/
│   │   └── api.ts        # Preconfigured axios clients for Backend (:5000) & AI (:8000)
│   ├── types/
│   │   └── index.ts      # TypeScript interfaces and contracts
│   ├── App.tsx           # Main application dashboard
│   ├── main.tsx          # React root mount
│   └── index.css         # Tailwind CSS v4 root stylesheet
├── .env                  # Live environment variables (ports & hosts)
├── .env.example          # Environment template
└── vite.config.ts        # Vite configuration with Tailwind plugin
```

## Adding New Features During Hackathon

1. **Calling the Express Backend**:
   Use `backendApi` from `src/services/api.ts`:
   ```ts
   import { backendApi } from './services/api';
   const response = await backendApi.get('/items');
   ```

2. **Calling the FastAPI AI Service**:
   Use `aiApi` or `sendAiPrompt`:
   ```ts
   import { sendAiPrompt } from './services/api';
   const aiResult = await sendAiPrompt({ prompt: 'Summarize this data' });
   ```
