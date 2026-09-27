import React, { useState, useEffect } from 'react';
import { api } from '../services/api.service.js';
import { Play, RotateCcw, AlertTriangle, Layers, GitCommit, FileText } from 'lucide-react';
import { WORKED_EXAMPLES } from '../data/worked-examples.js';
import { ConfirmModal } from './ConfirmModal.jsx';

export const SubmissionForm = ({
  problem,
  previousAttemptId,
  previousContent,
  onSubmit,
  isSubmitting,
}) => {
  const [content, setContent] = useState(previousContent || problem.starterTemplate);
  const [parsed, setParsed] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!content.trim()) {
        setParsed(null);
        return;
      }
      try {
        setIsParsing(true);
        const result = await api.previewParse(content);
        setParsed(result);
      } catch (err) {
        console.error('Preview parse failed', err);
      } finally {
        setIsParsing(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [content]);

  const handleResetTemplate = () => {
    setShowResetConfirm(true);
  };

  const handleConfirmReset = () => {
    setContent(problem.starterTemplate);
    setShowResetConfirm(false);
  };

  const handleLoadStrong = () => {
    const example = WORKED_EXAMPLES[problem.id]?.strong;
    if (example) setContent(example);
  };

  const handleLoadAntiPattern = () => {
    const example = WORKED_EXAMPLES[problem.id]?.antiPattern;
    if (example) setContent(example);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onSubmit(content);
  };

  const classCount = parsed?.designBlocks?.filter((b) => b.kind === 'class').length ?? 0;
  const interfaceCount = parsed?.designBlocks?.filter((b) => b.kind === 'interface' || b.kind === 'abstract class').length ?? 0;
  const relCount = parsed?.relationships?.length ?? 0;
  const hasRationale = (parsed?.rationaleText?.length ?? 0) > 40;

  return (
    <>
      <div className="glass-card flex flex-col overflow-hidden">
        {/* Editor Header */}
        <div className="flex flex-wrap justify-between items-center px-5 py-3.5 bg-slate-900/80 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm text-slate-100">
              Solution Workspace
            </span>
            {previousAttemptId && (
              <span className="badge-indigo-tw text-[11px] py-0.5 px-2">
                Iterating from #{previousAttemptId.slice(-4)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              className="btn-base px-2.5 py-1 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              onClick={handleLoadStrong}
              title="Load an architecturally sound solution with Strategy/State patterns and OCP extensibility"
            >
              ⭐ Load Strong
            </button>

            <button
              type="button"
              className="btn-base px-2.5 py-1 text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30"
              onClick={handleLoadAntiPattern}
              title="Load a bloated God class anti-pattern to test smell detection"
            >
              ⚠️ Load God Object
            </button>

            <button
              type="button"
              className="btn-secondary-tw text-xs py-1 px-2.5"
              onClick={handleResetTemplate}
            >
              <RotateCcw size={12} /> Reset
            </button>

            <button
              type="button"
              className="btn-primary-tw text-xs py-1.5 px-3.5"
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
            >
              <Play size={13} className="fill-current" />
              <span>{isSubmitting ? 'Evaluating...' : 'Submit Design'}</span>
            </button>
          </div>
        </div>

        {/* Editor Textarea */}
        <textarea
          className="w-full h-[520px] bg-[#070a12] text-slate-200 font-mono text-xs sm:text-sm p-4 sm:p-5 border-none resize-y outline-none leading-relaxed focus:ring-1 focus:ring-indigo-500/50 custom-scrollbar"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your classes (in code blocks), relationships (A -> B : verb), and rationale..."
          spellCheck={false}
        />

        {/* Live Structural Inspector Bar */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3 bg-slate-900/90 border-t border-white/10 text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Layers size={14} className="text-indigo-400" />
              <span>Classes: <strong className="text-slate-200">{classCount}</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${interfaceCount > 0 ? 'bg-emerald-400' : 'bg-amber-400'}`}
              />
              <span>Interfaces: <strong className="text-slate-200">{interfaceCount}</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              <GitCommit size={14} className="text-cyan-400" />
              <span>Relationships: <strong className="text-slate-200">{relCount}</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              <FileText
                size={14}
                className={hasRationale ? 'text-emerald-400' : 'text-rose-400'}
              />
              <span>Rationale: <strong className={hasRationale ? 'text-emerald-400' : 'text-rose-400'}>{hasRationale ? 'Good' : 'Too Short'}</strong></span>
            </div>
          </div>

          {parsed?.parseErrors && parsed.parseErrors.length > 0 && (
            <div className="flex items-center gap-1.5 text-amber-300 text-[11px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <AlertTriangle size={12} />
              <span className="truncate max-w-[280px]">{parsed.parseErrors[0]}</span>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Solution Template?"
        message="Are you sure you want to discard your current design changes and reset the editor back to the problem starter template? This action cannot be undone."
        confirmText="Reset Template"
        cancelText="Keep Editing"
        confirmVariant="danger"
        icon={RotateCcw}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
};
