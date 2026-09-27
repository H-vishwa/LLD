import React from 'react';
import { Layers, Terminal, Sparkles, BookOpen } from 'lucide-react';

export const Navbar = ({ onGoHome, onOpenDocs, activeView }) => {
  return (
    <header className="app-header">
      <div className="brand-container" onClick={onGoHome}>
        <div className="brand-icon">
          <Layers size={22} color="#ffffff" />
        </div>
        <div>
          <div className="brand-title">ArchJudge</div>
          <div className="brand-tagline">LLD Practice & Architectural Judgment</div>
        </div>
      </div>

      <nav className="nav-actions">
        <button
          className={`btn ${activeView === 'problems' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onGoHome}
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
        >
          <Terminal size={15} /> Challenges
        </button>

        <button
          className={`btn ${activeView === 'docs' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onOpenDocs}
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
        >
          <BookOpen size={15} /> Architecture Notes
        </button>

        <div className="badge badge-indigo" style={{ padding: '0.35rem 0.75rem' }}>
          <Sparkles size={13} />
          <span>Hybrid Evaluator v1.0</span>
        </div>
      </nav>
    </header>
  );
};
