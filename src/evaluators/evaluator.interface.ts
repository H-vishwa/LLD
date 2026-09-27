import { EvaluationResult } from '../domain/models/evaluation.model.js';
import { Problem } from '../domain/models/problem.model.js';
import { Submission } from '../domain/models/submission.model.js';

export interface IEvaluator {
  readonly name: string;
  evaluate(submission: Submission, problem: Problem): Promise<EvaluationResult>;
}
