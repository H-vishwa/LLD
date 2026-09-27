import { EvaluationResult } from '../domain/models/evaluation.model.js';
import { IEvaluationRepository } from '../domain/repositories/evaluation.repository.interface.js';

export class InMemoryEvaluationRepository implements IEvaluationRepository {
  private results: Map<string, EvaluationResult> = new Map();
  private attemptToResultId: Map<string, string> = new Map();

  async save(result: EvaluationResult): Promise<EvaluationResult> {
    const copy = { ...result };
    this.results.set(copy.id, copy);
    this.attemptToResultId.set(copy.attemptId, copy.id);
    return { ...copy };
  }

  async findById(id: string): Promise<EvaluationResult | null> {
    const found = this.results.get(id);
    return found ? { ...found } : null;
  }

  async findByAttemptId(attemptId: string): Promise<EvaluationResult | null> {
    const resultId = this.attemptToResultId.get(attemptId);
    if (!resultId) return null;
    return this.findById(resultId);
  }
}
