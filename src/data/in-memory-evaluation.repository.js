import { IEvaluationRepository } from '../domain/repositories/evaluation.repository.interface.js';

export class InMemoryEvaluationRepository extends IEvaluationRepository {
  constructor() {
    super();
    this.results = new Map();
    this.attemptToResultId = new Map();
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
