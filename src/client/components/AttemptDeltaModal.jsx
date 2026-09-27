import React from 'react';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const AttemptDeltaModal = ({ delta, onClose }) => {
  if (!delta) return null;

  const isPositive = delta.scoreDifference > 0;
  const isNeutral = delta.scoreDifference === 0;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '650px',
          padding: '2rem',
          backgroundColor: '#0f172a',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem' }}>Iteration Delta Analysis</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Comparing Attempt #{delta.currentAttemptId.slice(-4)} against Attempt #{delta.previousAttemptId.slice(-4)}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Score Change Hero */}
        <div
          style={{
            background: isPositive
              ? 'rgba(16, 185, 129, 0.1)'
              : isNeutral
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(244, 63, 94, 0.1)',
            border: `1px solid ${
              isPositive
                ? 'rgba(16, 185, 129, 0.3)'
                : isNeutral
                ? 'var(--border-subtle)'
                : 'rgba(244, 63, 94, 0.3)'
            }`,
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Net Architectural Score Change</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: isPositive ? '#10b981' : isNeutral ? '#94a3b8' : '#f43f5e' }}>
              {isPositive ? `+${delta.scoreDifference}%` : `${delta.scoreDifference}%`}
            </div>
          </div>
          {isPositive ? <TrendingUp size={32} color="#10b981" /> : isNeutral ? <Minus size={32} color="#94a3b8" /> : <TrendingDown size={32} color="#f43f5e" />}
        </div>

        {/* Structural Changes */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: '#cbd5e1' }}>Structural Entity Deltas</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.825rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Introduced Classes / Interfaces: </span>
              {delta.addedClasses && delta.addedClasses.length > 0 ? (
                delta.addedClasses.map((cls) => (
                  <span key={cls} className="badge badge-easy" style={{ marginRight: '0.35rem' }}>
                    +{cls}
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-dim)' }}>None</span>
              )}
            </div>

            <div style={{ fontSize: '0.825rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Removed / Consolidated: </span>
              {delta.removedClasses && delta.removedClasses.length > 0 ? (
                delta.removedClasses.map((cls) => (
                  <span key={cls} className="badge badge-hard" style={{ marginRight: '0.35rem' }}>
                    -{cls}
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-dim)' }}>None</span>
              )}
            </div>
          </div>
        </div>

        {/* Criteria Deltas Table */}
        {delta.criteriaDeltas && delta.criteriaDeltas.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: '#cbd5e1' }}>Rubric Dimensions Progress</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {delta.criteriaDeltas.map((cd) => (
                <div
                  key={cd.criterionId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.825rem',
                  }}
                >
                  <span>{cd.criterionName}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {cd.previousScore} → {cd.currentScore}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: cd.diff > 0 ? '#10b981' : cd.diff < 0 ? '#f43f5e' : '#94a3b8',
                      }}
                    >
                      {cd.diff > 0 ? `+${cd.diff}` : `${cd.diff}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
