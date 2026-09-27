import React from 'react';
import {
  CheckCircle,
  AlertCircle,
  RotateCw,
  GitCompare,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';

export const FeedbackView = ({
  attempt,
  evaluation,
  onRetry,
  onViewDelta,
  onBackToProblem,
}) => {
  if (attempt.status === 'Submitted' || attempt.status === 'Evaluating' || !evaluation) {
    return (
      <div className="glass-card p-12 text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="inline-flex p-4 bg-indigo-500/15 rounded-full text-indigo-400 animate-pulse">
          <Sparkles size={36} />
        </div>
        <h2 className="text-2xl font-bold font-heading text-white">
          {attempt.status === 'Submitted' ? 'Enqueued for Evaluation' : 'Evaluating System Architecture'}
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          Executing deterministic structural checks and qualitative design rubric reasoning. Non-blocking async queue in progress...
        </p>
        <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-mono pt-2">
          <RotateCw size={14} className="animate-spin" />
          <span>Polling evaluation result...</span>
        </div>
      </div>
    );
  }

  const getScoreColor = (score, max = 5) => {
    const ratio = score / max;
    if (ratio >= 0.8) return '#10b981';
    if (ratio >= 0.6) return '#f59e0b';
    return '#f43f5e';
  };

  const getScoreTextColor = (score, max = 5) => {
    const ratio = score / max;
    if (ratio >= 0.8) return 'text-emerald-400';
    if (ratio >= 0.6) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBgColor = (score, max = 5) => {
    const ratio = score / max;
    if (ratio >= 0.8) return 'bg-emerald-500';
    if (ratio >= 0.6) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getOverallGrade = (score) => {
    if (score >= 85) return { label: 'Architectural Mastery', badgeClass: 'badge-easy-tw' };
    if (score >= 70) return { label: 'Solid System Design', badgeClass: 'badge-medium-tw' };
    if (score >= 50) return { label: 'Developing Modularity', badgeClass: 'badge-medium-tw' };
    return { label: 'Refactoring Needed', badgeClass: 'badge-hard-tw' };
  };

  const grade = getOverallGrade(evaluation.overallScore);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top action bar */}
      <div className="flex justify-between items-center gap-3">
        <button className="btn-secondary-tw text-xs" onClick={onBackToProblem}>
          <ArrowLeft size={15} /> <span>Back to Editor</span>
        </button>

        <div className="flex items-center gap-2">
          {attempt.previousAttemptId && (
            <button className="btn-secondary-tw text-xs" onClick={onViewDelta}>
              <GitCompare size={15} className="text-cyan-400" />
              <span>Compare Delta</span>
            </button>
          )}

          <button className="btn-primary-tw text-xs" onClick={onRetry}>
            <RotateCw size={15} />
            <span>Try Again (Iterate)</span>
          </button>
        </div>
      </div>

      {/* Partial evaluation notice */}
      {evaluation.isPartial && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3 text-amber-200 text-xs">
          <Info size={18} className="text-amber-400 shrink-0" />
          <div>
            <strong className="font-semibold text-amber-300">Partial Evaluation Result:</strong> Qualitative LLM reasoning service timed out or was unavailable.
            Structural deterministic assessment is displayed with full reliability.
          </div>
        </div>
      )}

      {/* Hero Overview Panel */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2.5">
              <span className={grade.badgeClass}>{grade.label}</span>
              <span className="text-xs text-slate-400">
                Attempt #{attempt.id.slice(-6)} • {new Date(evaluation.generatedAt).toLocaleTimeString()}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">Evaluation Summary</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {evaluation.overallSummary}
            </p>
          </div>

          <div className="w-28 h-28 shrink-0 rounded-full bg-slate-900/90 border-2 border-white/10 flex flex-col items-center justify-center shadow-xl shadow-indigo-500/10 self-center">
            <span className={`text-3xl font-extrabold font-heading ${getScoreTextColor(evaluation.overallScore, 100)}`}>
              {evaluation.overallScore}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              / 100
            </span>
          </div>
        </div>
      </div>

      {/* Rubric Criteria Breakdown Header */}
      <div className="flex justify-between items-center pt-2">
        <h3 className="text-xl font-bold font-heading text-white">Rubric Dimensions Breakdown</h3>
        <span className="text-xs text-slate-400">
          {evaluation.criteria.length} Evaluated Dimensions
        </span>
      </div>

      {/* Criteria Cards */}
      <div className="space-y-4">
        {evaluation.criteria.map((criterion) => {
          const percent = (criterion.score / criterion.maxScore) * 100;
          const scoreTextColor = getScoreTextColor(criterion.score, criterion.maxScore);
          const scoreBgColor = getScoreBgColor(criterion.score, criterion.maxScore);

          return (
            <div key={criterion.criterionId} className="glass-card-sm p-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-white">{criterion.criterionName}</h4>
                    <span className="bg-white/5 border border-white/10 text-slate-400 text-[11px] px-2 py-0.5 rounded-full font-mono">
                      {criterion.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{criterion.explanation}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xl font-bold ${scoreTextColor}`}>
                    {criterion.score}
                  </span>
                  <span className="text-xs text-slate-400"> / {criterion.maxScore}</span>
                </div>
              </div>

              {/* Score Bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreBgColor}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Evidence Tags */}
              {criterion.evidenceRefs && criterion.evidenceRefs.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">Cited Evidence:</span>
                  {criterion.evidenceRefs.map((ref, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded text-[11px] font-mono"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              )}

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {criterion.strengths.length > 0 && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-3.5 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                      <CheckCircle size={14} /> <span>Strengths</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                      {criterion.strengths.map((str, sIdx) => (
                        <li key={sIdx}>{str}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {criterion.improvements.length > 0 && (
                  <div className="bg-rose-500/5 border border-rose-500/20 p-3.5 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-rose-300 text-xs font-semibold">
                      <AlertCircle size={14} /> <span>Actionable Refinements</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                      {criterion.improvements.map((imp, iIdx) => (
                        <li key={iIdx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
