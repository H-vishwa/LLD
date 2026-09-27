import { EvaluationResult } from '../models/evaluation.model.js';

export interface IEvaluationRepository {
  save(result: EvaluationResult): Promise<EvaluationResult>;
  findById(id: string): Promise<EvaluationResult | null>;
  findByAttemptId(attemptId: string): Promise<EvaluationResult | null>;
}
