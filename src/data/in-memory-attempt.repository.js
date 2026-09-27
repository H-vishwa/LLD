import { IAttemptRepository } from '../domain/repositories/attempt.repository.interface.js';

export class InMemoryAttemptRepository extends IAttemptRepository {
  constructor() {
    super();
    this.attempts = new Map();
  }

  async create(attempt) {
    const copy = { ...attempt };
    this.attempts.set(copy.id, copy);
    return { ...copy };
  }

  async findById(id) {
    const found = this.attempts.get(id);
    return found ? { ...found } : null;
  }

  async findByLearnerAndProblem(learnerId, problemId) {
    return Array.from(this.attempts.values())
      .filter((a) => a.learnerId === learnerId && a.problemId === problemId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async update(attempt) {
    if (!this.attempts.has(attempt.id)) {
      throw new Error(`Attempt with id ${attempt.id} not found`);
    }
    const copy = { ...attempt };
    this.attempts.set(copy.id, copy);
    return { ...copy };
  }

  async findLatestAttempt(learnerId, problemId) {
    const all = await this.findByLearnerAndProblem(learnerId, problemId);
    if (all.length === 0) return null;
    return all[all.length - 1];
  }
}
