import React from 'react';
import { Sparkles, Terminal, Database, Cpu } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg text-white flex items-center gap-2">
              <span>Hackathon Hub</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                4hr Sprint Ready
              </span>
            </div>
            <p className="text-xs text-gray-400">Client • Node.js Backend • FastAPI AI</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700/60 text-gray-300">
            <Terminal className="h-3.5 w-3.5 text-blue-400" />
            <span>Port: 5173</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700/60 text-gray-300">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span>Port: 5000</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700/60 text-gray-300">
            <Cpu className="h-3.5 w-3.5 text-purple-400" />
            <span>Port: 8000</span>
          </div>
        </div>
      </div>
    </header>
  );
};
