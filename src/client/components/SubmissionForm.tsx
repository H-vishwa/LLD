import React, { useState, useEffect } from 'react';
import { Problem } from '../../domain/models/problem.model.js';
import { Submission } from '../../domain/models/submission.model.js';
import { api } from '../services/api.service.js';
import { Play, RotateCcw, Check, AlertTriangle, Layers, GitCommit, FileText } from 'lucide-react';

interface SubmissionFormProps {
  problem: Problem;
  previousAttemptId?: string;
  previousContent?: string;
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  problem,
  previousAttemptId,
  previousContent,
  onSubmit,
  isSubmitting,
}) => {
  const [content, setContent] = useState<string>(previousContent || problem.starterTemplate);
  const [parsed, setParsed] = useState<Submission | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  // Live syntax inspection debounced
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
    if (window.confirm('Reset editor to problem starter template? Your current changes will be overwritten.')) {
      setContent(problem.starterTemplate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onSubmit(content);
  };

  const classCount = parsed?.designBlocks.filter((b) => b.kind === 'class').length ?? 0;
  const interfaceCount = parsed?.designBlocks.filter((b) => b.kind === 'interface' || b.kind === 'abstract class').length ?? 0;
  const relCount = parsed?.relationships.length ?? 0;
  const hasRationale = (parsed?.rationaleText?.length ?? 0) > 40;

  return (
    <div className="glass-panel editor-container">
      <div className="editor-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
            Solution Workspace
          </span>
          {previousAttemptId && (
            <span className="badge badge-indigo">
              Iterating from Attempt #{previousAttemptId.slice(-4)}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleResetTemplate}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
          >
            <RotateCcw size={13} /> Reset Template
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            style={{ padding: '0.45rem 1.1rem', fontSize: '0.82rem' }}
          >
            <Play size={14} fill="currentColor" />
            {isSubmitting ? 'Evaluating...' : 'Submit Design'}
          </button>
        </div>
      </div>

      <textarea
        className="code-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your classes (in code blocks), relationships (A -> B : verb), and rationale..."
        spellCheck={false}
      />

      {/* Live Structural Inspector Bar */}
      <div className="inspector-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="inspector-stat">
            <Layers size={14} color="#818cf8" />
            <span>Classes: <strong>{classCount}</strong></span>
          </div>

          <div className="inspector-stat">
            <span
              className="inspector-dot"
              style={{ backgroundColor: interfaceCount > 0 ? '#10b981' : '#f59e0b' }}
            />
            <span>Interfaces: <strong>{interfaceCount}</strong></span>
          </div>

          <div className="inspector-stat">
            <GitCommit size={14} color="#06b6d4" />
            <span>Relationships: <strong>{relCount}</strong></span>
          </div>

          <div className="inspector-stat">
            <FileText size={14} color={hasRationale ? '#10b981' : '#f43f5e'} />
            <span>Rationale: <strong>{hasRationale ? 'Good' : 'Too Short'}</strong></span>
          </div>
        </div>

        {parsed?.parseErrors && parsed.parseErrors.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24', fontSize: '0.75rem' }}>
            <AlertTriangle size={13} />
            <span>{parsed.parseErrors[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
};
