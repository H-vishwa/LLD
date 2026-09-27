import React from 'react';
import { History, Calendar } from 'lucide-react';

export const AttemptHistory = ({ attempts, onSelectAttempt }) => {
  if (!attempts || attempts.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <History size={18} color="#818cf8" />
        <h3 style={{ fontSize: '1.15rem' }}>Attempt History & Score Progression</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {attempts.map((att, idx) => {
          const score = att.score;
          const scoreColor = score ? (score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e') : '#64748b';

          return (
            <div
              key={att.id}
              onClick={() => onSelectAttempt(att.id)}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
                  Attempt #{idx + 1}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: scoreColor }}>
                  {score !== null && score !== undefined ? `${score}%` : att.status}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <Calendar size={12} />
                <span>{new Date(att.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
