import React from 'react';
import { Problem } from '../../domain/models/problem.model.js';
import { AlertCircle, CheckSquare, Sparkles, HelpCircle } from 'lucide-react';

interface ProblemDetailProps {
  problem: Problem;
}

export const ProblemDetail: React.FC<ProblemDetailProps> = ({ problem }) => {
  return (
    <div className="glass-panel" style={{ padding: '1.75rem', maxHeight: '820px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.45rem' }}>{problem.title}</h2>
        <span
          className={`badge ${
            problem.difficulty === 'Easy'
              ? 'badge-easy'
              : problem.difficulty === 'Hard'
              ? 'badge-hard'
              : 'badge-medium'
          }`}
        >
          {problem.difficulty}
        </span>
      </div>

      {/* Extensibility Hook Highlight */}
      <div
        style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', fontWeight: 600, fontSize: '0.85rem' }}>
          <Sparkles size={16} />
          <span>Extensibility Test Hook</span>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.35rem', fontStyle: 'italic' }}>
          "{problem.extensibilityPrompt}"
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
          *The evaluator will verify if your abstractions allow adding this requirement without modifying core orchestrator classes.
        </div>
      </div>

      {/* Requirements text */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: '#e2e8f0' }}>Requirements</h3>
        <div
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            lineHeight: '1.6',
            whiteSpace: 'pre-line',
          }}
        >
          {problem.requirementsMarkdown}
        </div>
      </div>

      {/* Constraints */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: '#e2e8f0' }}>Architectural Constraints</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {problem.constraints.map((constraint, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                fontSize: '0.825rem',
                color: '#cbd5e1',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <CheckSquare size={15} color="#818cf8" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{constraint}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grading tips */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1rem',
          display: 'flex',
          gap: '0.6rem',
          fontSize: '0.8rem',
          color: 'var(--text-dim)',
        }}
      >
        <HelpCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>Scoring Rubric:</strong> Modularity & SRP (25%), Abstractions & Patterns (25%), Extensibility (20%), Relationships (15%), Trade-off Rationale (15%).
        </span>
      </div>
    </div>
  );
};
