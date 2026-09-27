export const api = {
  async getProblems() {
    const res = await fetch('/api/problems');
    if (!res.ok) throw new Error('Failed to load problems');
    return res.json();
  },

  async getProblem(id) {
    const res = await fetch(`/api/problems/${id}`);
    if (!res.ok) throw new Error(`Failed to load problem ${id}`);
    return res.json();
  },

  async submitAttempt(problemId, rawContent, previousAttemptId) {
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

  async getAttempt(id) {
    const res = await fetch(`/api/attempts/${id}`);
    if (!res.ok) throw new Error('Failed to fetch attempt');
    return res.json();
  },

  async getHistory(problemId) {
    const res = await fetch(`/api/attempts/history?problemId=${problemId}`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  async getDelta(attemptId) {
    const res = await fetch(`/api/attempts/${attemptId}/delta`);
    if (!res.ok) throw new Error('Failed to calculate attempt delta');
    return res.json();
  },

  async previewParse(rawContent) {
    const res = await fetch('/api/parse/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawContent }),
    });
    if (!res.ok) throw new Error('Preview parse failed');
    return res.json();
  },
};
