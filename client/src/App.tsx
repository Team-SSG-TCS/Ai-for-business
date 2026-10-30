import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { ServiceStatus } from './components/dashboard/ServiceStatus';
import { AiTester } from './components/dashboard/AiTester';
import { DbTester } from './components/dashboard/DbTester';
import { TeamGuide } from './components/dashboard/TeamGuide';
import { Zap, Sparkles, Layers, ShieldCheck, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 border border-indigo-900/30 p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-purple-600/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-4">
              <Zap className="h-3.5 w-3.5" />
              <span>Fullstack + AI Hackathon Starter Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Ready-to-Deploy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">AI Collaboration Hub</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed">
              Engineered for 4-hour hackathons. React 19 + TypeScript frontend with Tailwind CSS, Express Node.js backend with raw Supabase PostgreSQL pooling, and Python FastAPI AI microservice.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900/90 border border-gray-800">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>Frontend: React + Vite + Tailwind</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900/90 border border-gray-800">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Backend: Node + Express + Supabase</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900/90 border border-gray-800">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>AI Service: FastAPI + Python</span>
              </span>
            </div>
          </div>
        </div>

        {/* Live Architecture Connectivity Monitor */}
        <ServiceStatus />

        {/* Live Playground Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DbTester />
          <AiTester />
        </div>

        {/* Team Collaboration Guide */}
        <TeamGuide />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-gray-950 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI for Business Hackathon Template • Built for speed & teamwork</span>
          <span className="flex items-center gap-1 text-gray-400">
            Happy Hacking! <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
