import { Submission } from './submission.model.js';

export type AttemptStatus = 'Draft' | 'Submitted' | 'Evaluating' | 'Evaluated' | 'Failed';

export interface Attempt {
  id: string;
  problemId: string;
  learnerId: string;
  status: AttemptStatus;
  rawContent: string;
  submission?: Submission;
  resultId?: string;
  errorMessage?: string;
  createdAt: string;
  submittedAt?: string;
  evaluatedAt?: string;
  previousAttemptId?: string; // Links to prior attempt for comparison / delta view
}

export interface AttemptDelta {
  currentAttemptId: string;
  previousAttemptId: string;
  scoreDifference: number; // e.g. +15 or -5
  addedClasses: string[];
  removedClasses: string[];
  criteriaDeltas: {
    criterionId: string;
    criterionName: string;
    previousScore: number;
    currentScore: number;
    diff: number;
  }[];
}
