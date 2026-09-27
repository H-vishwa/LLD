import React from 'react';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const AttemptDeltaModal = ({ delta, onClose }) => {
  if (!delta) return null;

  const isPositive = delta.scoreDifference > 0;
  const isNeutral = delta.scoreDifference === 0;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto custom-scrollbar space-y-6 bg-slate-900 border border-white/15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-4 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold font-heading text-white">Iteration Delta Analysis</h3>
            <span className="text-xs text-slate-400">
              Comparing Attempt #{delta.currentAttemptId.slice(-4)} against Attempt #{delta.previousAttemptId.slice(-4)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Score Change Hero */}
        <div
          className={`p-5 rounded-2xl flex items-center justify-between border ${
            isPositive
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : isNeutral
              ? 'bg-white/5 border-white/10'
              : 'bg-rose-500/10 border-rose-500/30'
          }`}
        >
          <div>
            <div className="text-xs text-slate-400">Net Architectural Score Change</div>
            <div
              className={`text-3xl font-extrabold font-heading mt-1 ${
                isPositive ? 'text-emerald-400' : isNeutral ? 'text-slate-400' : 'text-rose-400'
              }`}
            >
              {isPositive ? `+${delta.scoreDifference}%` : `${delta.scoreDifference}%`}
            </div>
          </div>
          {isPositive ? (
            <TrendingUp size={36} className="text-emerald-400" />
          ) : isNeutral ? (
            <Minus size={36} className="text-slate-400" />
          ) : (
            <TrendingDown size={36} className="text-rose-400" />
          )}
        </div>

        {/* Structural Changes */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Structural Entity Deltas
          </h4>
          <div className="space-y-2 text-xs">
            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 flex items-center flex-wrap gap-2">
              <span className="text-slate-400 font-medium">Introduced Classes / Interfaces:</span>
              {delta.addedClasses && delta.addedClasses.length > 0 ? (
                delta.addedClasses.map((cls) => (
                  <span key={cls} className="badge-easy-tw font-mono text-[11px]">
                    +{cls}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic">None</span>
              )}
            </div>

            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 flex items-center flex-wrap gap-2">
              <span className="text-slate-400 font-medium">Removed / Consolidated:</span>
              {delta.removedClasses && delta.removedClasses.length > 0 ? (
                delta.removedClasses.map((cls) => (
                  <span key={cls} className="badge-hard-tw font-mono text-[11px]">
                    -{cls}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic">None</span>
              )}
            </div>
          </div>
        </div>

        {/* Criteria Deltas Table */}
        {delta.criteriaDeltas && delta.criteriaDeltas.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Rubric Dimensions Progress
            </h4>
            <div className="space-y-2">
              {delta.criteriaDeltas.map((cd) => (
                <div
                  key={cd.criterionId}
                  className="flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.04] p-3 rounded-xl border border-white/5 text-xs transition-colors"
                >
                  <span className="font-medium text-slate-200">{cd.criterionName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-mono">
                      {cd.previousScore} → {cd.currentScore}
                    </span>
                    <span
                      className={`font-bold font-mono px-2 py-0.5 rounded ${
                        cd.diff > 0
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : cd.diff < 0
                          ? 'bg-rose-500/15 text-rose-300'
                          : 'bg-white/5 text-slate-400'
                      }`}
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
