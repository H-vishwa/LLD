import React from 'react';
import { Attempt } from '../../domain/models/attempt.model.js';
import { EvaluationResult } from '../../domain/models/evaluation.model.js';
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  RotateCw,
  GitCompare,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';

interface FeedbackViewProps {
  attempt: Attempt;
  evaluation: EvaluationResult | null;
  onRetry: () => void;
  onViewDelta: () => void;
  onBackToProblem: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  attempt,
  evaluation,
  onRetry,
  onViewDelta,
  onBackToProblem,
}) => {
  // If still evaluating, show interactive async status card
  if (attempt.status === 'Submitted' || attempt.status === 'Evaluating' || !evaluation) {
    return (
      <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '650px', margin: '3rem auto' }}>
        <div className="evaluating-pulse" style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '50%', marginBottom: '1.5rem' }}>
          <Sparkles size={36} color="#818cf8" />
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
          {attempt.status === 'Submitted' ? 'Enqueued for Evaluation' : 'Evaluating System Architecture'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.75rem' }}>
          Executing deterministic structural checks and qualitative design rubric reasoning. Non-blocking async queue in progress...
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', fontSize: '0.85rem' }}>
          <RotateCw size={15} className="evaluating-pulse" />
          <span>Polling evaluation result...</span>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number, max: number = 5) => {
    const ratio = score / max;
    if (ratio >= 0.8) return '#10b981';
    if (ratio >= 0.6) return '#f59e0b';
    return '#f43f5e';
  };

  const getOverallGrade = (score: number) => {
    if (score >= 85) return { label: 'Architectural Mastery', badgeClass: 'badge-easy' };
    if (score >= 70) return { label: 'Solid System Design', badgeClass: 'badge-medium' };
    if (score >= 50) return { label: 'Developing Modularity', badgeClass: 'badge-medium' };
    return { label: 'Refactoring Needed', badgeClass: 'badge-hard' };
  };

  const grade = getOverallGrade(evaluation.overallScore);

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onBackToProblem}>
          <ArrowLeft size={16} /> Back to Editor
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {attempt.previousAttemptId && (
            <button className="btn btn-secondary" onClick={onViewDelta}>
              <GitCompare size={16} color="#06b6d4" />
              <span>Compare Delta</span>
            </button>
          )}

          <button className="btn btn-primary" onClick={onRetry}>
            <RotateCw size={16} />
            <span>Try Again (Iterate)</span>
          </button>
        </div>
      </div>

      {/* Partial evaluation notice */}
      {evaluation.isPartial && (
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <Info size={18} color="#f59e0b" />
          <div style={{ fontSize: '0.85rem', color: '#fef3c7' }}>
            <strong>Partial Evaluation Result:</strong> Qualitative LLM reasoning service timed out or was unavailable.
            Structural deterministic assessment is displayed with full reliability.
          </div>
        </div>
      )}

      {/* Hero Overview Panel */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className={`badge ${grade.badgeClass}`}>{grade.label}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Attempt #{attempt.id.slice(-6)} • Evaluated {new Date(evaluation.generatedAt).toLocaleTimeString()}
              </span>
            </div>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>Evaluation Summary</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: '1.6' }}>
              {evaluation.overallSummary}
            </p>
          </div>

          <div className="score-circle-wrapper" style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="score-number" style={{ color: getScoreColor(evaluation.overallScore, 100) }}>
                {evaluation.overallScore}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Overall / 100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rubric Criteria Breakdown */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.35rem' }}>Rubric Dimensions Breakdown</h3>
        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          {evaluation.criteria.length} Evaluated Dimensions
        </span>
      </div>

      {evaluation.criteria.map((criterion) => {
        const scoreColor = getScoreColor(criterion.score, criterion.maxScore);
        const percent = (criterion.score / criterion.maxScore) * 100;

        return (
          <div key={criterion.criterionId} className="criterion-card">
            <div className="criterion-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#ffffff' }}>{criterion.criterionName}</h4>
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.7rem',
                    }}
                  >
                    {criterion.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{criterion.explanation}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 700, color: scoreColor }}>
                  {criterion.score}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}> / {criterion.maxScore}</span>
              </div>
            </div>

            {/* Score Bar */}
            <div className="score-bar-track">
              <div
                className="score-bar-fill"
                style={{ width: `${percent}%`, backgroundColor: scoreColor }}
              />
            </div>

            {/* Evidence Tags */}
            {criterion.evidenceRefs && criterion.evidenceRefs.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.75rem 0' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', alignSelf: 'center' }}>
                  Cited Evidence:
                </span>
                {criterion.evidenceRefs.map((ref, idx) => (
                  <span key={idx} className="evidence-pill">
                    {ref}
                  </span>
                ))}
              </div>
            )}

            {/* Strengths & Improvements */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {criterion.strengths.length > 0 && (
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <CheckCircle size={14} /> Strengths
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    {criterion.strengths.map((str, sIdx) => (
                      <li key={sIdx} style={{ marginBottom: '0.25rem' }}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {criterion.improvements.length > 0 && (
                <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(244, 63, 94, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fb7185', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <AlertCircle size={14} /> Actionable Refinements
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    {criterion.improvements.map((imp, iIdx) => (
                      <li key={iIdx} style={{ marginBottom: '0.25rem' }}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
