import React from 'react';
import { Layers, Terminal, Sparkles, BookOpen } from 'lucide-react';

export const Navbar = ({ onGoHome, onOpenDocs, activeView }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex justify-between items-center transition-all">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onGoHome}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
          <Layers size={22} className="text-white" />
        </div>
        <div>
          <div className="text-xl font-bold font-heading tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            ArchJudge
          </div>
          <div className="text-xs text-slate-400 font-medium">
            LLD Practice & Architectural Judgment
          </div>
        </div>
      </div>

      <nav className="flex items-center gap-2 sm:gap-3">
        <button
          className={activeView === 'problems' ? 'btn-primary-tw text-xs py-1.5 px-3' : 'btn-secondary-tw text-xs py-1.5 px-3'}
          onClick={onGoHome}
        >
          <Terminal size={14} /> <span>Challenges</span>
        </button>

        <button
          className={activeView === 'docs' ? 'btn-primary-tw text-xs py-1.5 px-3' : 'btn-secondary-tw text-xs py-1.5 px-3'}
          onClick={onOpenDocs}
        >
          <BookOpen size={14} /> <span>Architecture Notes</span>
        </button>

        <div className="hidden sm:inline-flex badge-indigo-tw py-1 px-3">
          <Sparkles size={13} />
          <span>Hybrid Evaluator v1.0</span>
        </div>
      </nav>
    </header>
  );
};
