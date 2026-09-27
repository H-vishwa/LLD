import React from 'react';
import { ArrowRight, CheckCircle2, Cpu, GitFork, ShieldCheck, Zap } from 'lucide-react';

export const ProblemList = ({ problems, onSelectProblem, isLoading }) => {
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return <span className="badge badge-easy">Easy</span>;
      case 'Hard':
        return <span className="badge badge-hard">Hard</span>;
      default:
        return <span className="badge badge-medium">Medium</span>;
    }
  };

  return (
    <div>
      <section className="hero-section">
        <div className="hero-pill">
          <Zap size={14} color="#818cf8" />
          <span>Criterion-Based LLD Feedback Platform</span>
        </div>
        <h1 className="hero-title">Practice System Design.<br />Get Senior Architect Feedback.</h1>
        <p className="hero-subtitle">
          Submit class models, explicit relationships, and design rationale. Evaluated with 
          instant deterministic structural checks and qualitative architectural reasoning.
        </p>
      </section>

      {/* Feature highlight strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', gap: '0.85rem' }}>
          <ShieldCheck size={26} color="#10b981" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Deterministic Smells</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Instant checks for God classes, missing associations, and SRP violations.
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', gap: '0.85rem' }}>
          <Cpu size={26} color="#8b5cf6" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>LLM Trade-off Analysis</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Evaluates design rationale, GoF pattern fit, and extensibility readiness.
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', gap: '0.85rem' }}>
          <GitFork size={26} color="#06b6d4" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Retry Delta Comparison</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Track iteration improvements with side-by-side structural and score deltas.
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Available Challenges</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {problems.length} Curated Core LLD Problems
        </span>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading design challenges...
        </div>
      ) : (
        <div className="problems-grid">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="glass-panel problem-card"
              onClick={() => onSelectProblem(problem)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>{problem.title}</h3>
                  {getDifficultyBadge(problem.difficulty)}
                </div>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.75rem',
                    lineHeight: '1.5',
                  }}
                >
                  {problem.shortDescription}
                </p>

                <div className="tags-row">
                  {problem.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#10b981' }}>
                  <CheckCircle2 size={14} />
                  <span>Seeded with Starter Template</span>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProblem(problem);
                  }}
                >
                  Solve Challenge <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
