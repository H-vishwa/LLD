import React from 'react';
import { History, Calendar } from 'lucide-react';

export const AttemptHistory = ({ attempts, onSelectAttempt }) => {
  if (!attempts || attempts.length === 0) return null;

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-white/10">
        <History size={18} className="text-indigo-400" />
        <h3 className="text-base font-bold font-heading text-white">
          Attempt History & Score Progression
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {attempts.map((att, idx) => {
          const score = att.score;
          const scoreColorClass = score
            ? score >= 80
              ? 'text-emerald-400'
              : score >= 60
              ? 'text-amber-400'
              : 'text-rose-400'
            : 'text-slate-400';

          return (
            <div
              key={att.id}
              onClick={() => onSelectAttempt(att.id)}
              className="glass-card-sm p-4 cursor-pointer hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                  Attempt #{idx + 1}
                </span>
                <span className={`text-base font-bold font-heading ${scoreColorClass}`}>
                  {score !== null && score !== undefined ? `${score}%` : att.status}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Calendar size={12} className="text-slate-500" />
                <span>{new Date(att.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
