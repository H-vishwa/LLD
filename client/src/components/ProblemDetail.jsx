import React from 'react';
import { CheckSquare, Sparkles, HelpCircle, Info } from 'lucide-react';

const renderMarkdownContent = (markdownText) => {
  if (!markdownText) return null;

  const lines = markdownText.split('\n');
  const elements = [];

  const parseInline = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-slate-100 font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={index} className="h-1.5" />);
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={index} className="text-xs font-bold uppercase tracking-wider text-indigo-300 mt-3 mb-1">
          {trimmed.slice(4)}
        </h4>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      elements.push(
        <div key={index} className="pl-1 flex items-start gap-2 my-1">
          <span className="text-indigo-400 font-mono text-[11px] font-semibold shrink-0 mt-0.5">
            {trimmed.match(/^\d+\./)[0]}
          </span>
          <div className="text-slate-300 leading-relaxed text-xs">
            {parseInline(trimmed.replace(/^\d+\.\s*/, ''))}
          </div>
        </div>
      );
    } else if (trimmed.startsWith('- ')) {
      elements.push(
        <div key={index} className="pl-5 flex items-start gap-1.5 my-0.5">
          <span className="text-indigo-400 shrink-0 text-[10px] mt-1">•</span>
          <div className="text-slate-300 leading-relaxed text-xs">
            {parseInline(trimmed.slice(2))}
          </div>
        </div>
      );
    } else {
      elements.push(
        <p key={index} className="text-slate-300 leading-relaxed text-xs my-0.5">
          {parseInline(trimmed)}
        </p>
      );
    }
  });

  return elements;
};

export const ProblemDetail = ({ problem }) => {
  return (
    <div className="glass-card p-6 max-h-[820px] overflow-y-auto custom-scrollbar space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold font-heading text-white">{problem.title}</h2>
        <span
          className={
            problem.difficulty === 'Easy'
              ? 'badge-easy-tw'
              : problem.difficulty === 'Hard'
              ? 'badge-hard-tw'
              : 'badge-medium-tw'
          }
        >
          {problem.difficulty}
        </span>
      </div>

      {/* Extensibility Hook Highlight */}
      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs tracking-wide uppercase">
          <Sparkles size={15} />
          <span>Extensibility Test Hook</span>
        </div>
        <div className="text-xs text-slate-200 italic font-mono bg-black/20 p-2.5 rounded-lg border border-indigo-500/20">
          "{problem.extensibilityPrompt}"
        </div>
        <div className="flex items-start gap-1.5 text-[11px] text-slate-400 pt-0.5">
          <Info size={13} className="shrink-0 mt-0.5 text-indigo-400" />
          <span>The evaluator will verify if your abstractions allow adding this requirement without modifying core orchestrator classes.</span>
        </div>
      </div>

      {/* Requirements text */}
      <div className="space-y-2.5">
        <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">Requirements</h3>
        <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-1">
          {renderMarkdownContent(problem.requirementsMarkdown)}
        </div>
      </div>

      {/* Architectural Constraints */}
      <div className="space-y-2.5">
        <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">Architectural Constraints</h3>
        <div className="space-y-2">
          {problem.constraints.map((constraint, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-300 bg-white/[0.03] p-2.5 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
            >
              <CheckSquare size={15} className="text-indigo-400 mt-0.5 shrink-0" />
              <span>{constraint}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scoring Rubric Footnote */}
      <div className="pt-4 border-t border-white/10 flex items-start gap-2.5 text-xs text-slate-400">
        <HelpCircle size={15} className="shrink-0 mt-0.5 text-slate-500" />
        <span className="text-[11px] leading-relaxed">
          <strong className="text-slate-300">Scoring Rubric:</strong> Modularity & SRP (25%), Abstractions & Patterns (25%), Extensibility (20%), Relationships (15%), Trade-off Rationale (15%).
        </span>
      </div>
    </div>
  );
};
