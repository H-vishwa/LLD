import React from 'react';
import { ArrowRight, CheckCircle2, Cpu, GitFork, ShieldCheck, Zap } from 'lucide-react';

export const ProblemList = ({ problems, onSelectProblem, isLoading }) => {
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return <span className="badge-easy-tw">Easy</span>;
      case 'Hard':
        return <span className="badge-hard-tw">Hard</span>;
      default:
        return <span className="badge-medium-tw">Medium</span>;
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-10 sm:py-14 max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-semibold text-indigo-300 shadow-sm shadow-indigo-500/10">
          <Zap size={14} className="text-indigo-400" />
          <span>Criterion-Based LLD Feedback Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
          Practice System Design.<br />Get Senior Architect Feedback.
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Submit class models, explicit relationships, and design rationale. Evaluated with 
          instant deterministic structural checks and qualitative architectural reasoning.
        </p>
      </section>

      {/* Feature highlight strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card-sm p-5 flex items-start gap-4 hover:border-emerald-500/30 group">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-100">Deterministic Smells</div>
            <div className="text-xs text-slate-400 mt-1 leading-relaxed">
              Instant checks for God classes, missing associations, and SRP violations.
            </div>
          </div>
        </div>

        <div className="glass-card-sm p-5 flex items-start gap-4 hover:border-purple-500/30 group">
          <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform">
            <Cpu size={22} />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-100">LLM Trade-off Analysis</div>
            <div className="text-xs text-slate-400 mt-1 leading-relaxed">
              Evaluates design rationale, GoF pattern fit, and extensibility readiness.
            </div>
          </div>
        </div>

        <div className="glass-card-sm p-5 flex items-start gap-4 hover:border-cyan-500/30 group">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
            <GitFork size={22} />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-100">Retry Delta Comparison</div>
            <div className="text-xs text-slate-400 mt-1 leading-relaxed">
              Track iteration improvements with side-by-side structural and score deltas.
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Header */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-heading text-white">Available Challenges</h2>
          <span className="text-xs font-medium text-slate-400">
            {problems.length} Curated Core LLD Problems
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            Loading design challenges...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="glass-card p-6 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
                onClick={() => onSelectProblem(problem)}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {problem.title}
                    </h3>
                    {getDifficultyBadge(problem.difficulty)}
                  </div>

                  <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                    {problem.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5 my-4">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-white/5 text-slate-300 border border-white/10 px-2 py-0.5 rounded text-[11px] font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 size={14} />
                    <span className="text-[11px]">Template Ready</span>
                  </div>
                  <button
                    className="btn-primary-tw text-xs py-1.5 px-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProblem(problem);
                    }}
                  >
                    <span>Solve Challenge</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
