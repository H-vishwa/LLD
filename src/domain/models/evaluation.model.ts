export interface CriterionScore {
  criterionId: string;
  criterionName: string;
  category: 'Structural' | 'Reasoning' | 'Extensibility';
  score: number; // 0 to 5
  maxScore: number; // 5
  explanation: string;
  evidenceRefs: string[]; // Class names, methods, or relationship mentions
  strengths: string[];
  improvements: string[];
}

export interface EvaluationResult {
  id: string;
  attemptId: string;
  overallScore: number; // 0 - 100 percentage
  overallSummary: string;
  criteria: CriterionScore[];
  isPartial: boolean; // True if LLM timed out/failed and deterministic fallback was used
  engineVersion: string;
  generatedAt: string;
}
