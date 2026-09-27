import { Problem } from '../../domain/models/problem.model.js';
import { Attempt, AttemptDelta } from '../../domain/models/attempt.model.js';
import { EvaluationResult } from '../../domain/models/evaluation.model.js';
import { Submission } from '../../domain/models/submission.model.js';

export interface AttemptDetailResponse {
  attempt: Attempt;
  evaluation: EvaluationResult | null;
}

export interface HydratedAttempt extends Attempt {
  score: number | null;
}

export const api = {
  async getProblems(): Promise<Problem[]> {
    const res = await fetch('/api/problems');
    if (!res.ok) throw new Error('Failed to load problems');
    return res.json();
  },

  async getProblem(id: string): Promise<Problem> {
    const res = await fetch(`/api/problems/${id}`);
    if (!res.ok) throw new Error(`Failed to load problem ${id}`);
    return res.json();
  },

  async submitAttempt(problemId: string, rawContent: string, previousAttemptId?: string): Promise<Attempt> {
    const res = await fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId,
        rawContent,
        previousAttemptId,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Submission failed' }));
      throw new Error(err.error || 'Failed to submit attempt');
    }
    return res.json();
  },

  async getAttempt(id: string): Promise<AttemptDetailResponse> {
    const res = await fetch(`/api/attempts/${id}`);
    if (!res.ok) throw new Error('Failed to fetch attempt');
    return res.json();
  },

  async getHistory(problemId: string): Promise<HydratedAttempt[]> {
    const res = await fetch(`/api/attempts/history?problemId=${problemId}`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  async getDelta(attemptId: string): Promise<AttemptDelta> {
    const res = await fetch(`/api/attempts/${attemptId}/delta`);
    if (!res.ok) throw new Error('Failed to calculate attempt delta');
    return res.json();
  },

  async previewParse(rawContent: string): Promise<Submission> {
    const res = await fetch('/api/parse/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawContent }),
    });
    if (!res.ok) throw new Error('Preview parse failed');
    return res.json();
  },
};
