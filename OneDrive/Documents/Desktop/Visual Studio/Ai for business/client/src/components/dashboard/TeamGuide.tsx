import React from 'react';
import { Users, Terminal, Rocket, CheckSquare } from 'lucide-react';

export const TeamGuide: React.FC = () => {
  return (
    <div className="bg-gray-900/80 rounded-2xl border border-gray-800 p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">4-Hour Hackathon Team Collaboration Guide</h3>
          <p className="text-xs text-gray-400">Role separation and rapid velocity setup</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Frontend Role */}
        <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span> Frontend Dev
            </span>
            <span className="text-[11px] font-mono text-gray-400">/client</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">React 19 + TypeScript + Tailwind CSS</p>
          <ul className="text-xs text-gray-300 space-y-1.5">
            <li className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>Build UI components in <code className="text-cyan-300">src/components</code></span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>Call APIs via <code className="text-cyan-300">src/services/api.ts</code></span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>Full Tailwind styling out-of-the-box</span>
            </li>
          </ul>
        </div>

        {/* Backend Role */}
        <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Backend Dev
            </span>
            <span className="text-[11px] font-mono text-gray-400">/backend</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">Node.js + Express (No ORM, Raw pg)</p>
          <ul className="text-xs text-gray-300 space-y-1.5">
            <li className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Database queries in <code className="text-emerald-300">src/config/db.js</code></span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Add API routes in <code className="text-emerald-300">src/routes/</code></span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Pre-connected to Supabase PostgreSQL</span>
            </li>
          </ul>
        </div>

        {/* AI Role */}
        <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400"></span> AI / ML Dev
            </span>
            <span className="text-[11px] font-mono text-gray-400">/ai-service</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">FastAPI + Python + LLM Pipelines</p>
          <ul className="text-xs text-gray-300 space-y-1.5">
            <li className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <span>Prompt chains in <code className="text-purple-300">app/services/</code></span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <span>Add AI endpoints in <code className="text-purple-300">app/api/</code></span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <span>Swagger docs at <code className="text-purple-300">:8000/docs</code></span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-indigo-300">
          <Terminal className="h-4 w-4 shrink-0" />
          <span>Quick Run All: Run each in a separate terminal: <code className="bg-indigo-950 px-1.5 py-0.5 rounded text-indigo-200">client (npm run dev)</code>, <code className="bg-indigo-950 px-1.5 py-0.5 rounded text-indigo-200">backend (npm run dev)</code>, <code className="bg-indigo-950 px-1.5 py-0.5 rounded text-indigo-200">ai-service (uvicorn main:app)</code></span>
        </div>
        <div className="flex items-center gap-1.5 text-indigo-400 shrink-0 font-semibold">
          <Rocket className="h-3.5 w-3.5" />
          <span>Ready to Hack!</span>
        </div>
      </div>
    </div>
  );
};
