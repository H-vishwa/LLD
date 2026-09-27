import { IEvaluationRepository } from '../domain/repositories/evaluation.repository.interface.js';
import { PRESEEDED_EVALUATIONS } from './seed-attempts.js';

export class InMemoryEvaluationRepository extends IEvaluationRepository {
  constructor(initialEvaluations = PRESEEDED_EVALUATIONS) {
    super();
    this.results = new Map();
    this.attemptToResultId = new Map();
    for (const ev of initialEvaluations) {
      this.results.set(ev.id, { ...ev });
      this.attemptToResultId.set(ev.attemptId, ev.id);
    }
  }

  async save(result) {
    const copy = { ...result };
    this.results.set(copy.id, copy);
    this.attemptToResultId.set(copy.attemptId, copy.id);
    return { ...copy };
  }

  async findById(id) {
    const found = this.results.get(id);
    return found ? { ...found } : null;
  }

  async findByAttemptId(attemptId) {
    const resultId = this.attemptToResultId.get(attemptId);
    if (!resultId) return null;
    return this.findById(resultId);
  }
}
