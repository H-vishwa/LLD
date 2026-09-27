import { Attempt } from '../domain/models/attempt.model.js';
import { IAttemptRepository } from '../domain/repositories/attempt.repository.interface.js';

export class InMemoryAttemptRepository implements IAttemptRepository {
  private attempts: Map<string, Attempt> = new Map();

  async create(attempt: Attempt): Promise<Attempt> {
    const copy = { ...attempt };
    this.attempts.set(copy.id, copy);
    return { ...copy };
  }

  async findById(id: string): Promise<Attempt | null> {
    const found = this.attempts.get(id);
    return found ? { ...found } : null;
  }

  async findByLearnerAndProblem(learnerId: string, problemId: string): Promise<Attempt[]> {
    return Array.from(this.attempts.values())
      .filter((a) => a.learnerId === learnerId && a.problemId === problemId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async update(attempt: Attempt): Promise<Attempt> {
    if (!this.attempts.has(attempt.id)) {
      throw new Error(`Attempt with id ${attempt.id} not found`);
    }
    const copy = { ...attempt };
    this.attempts.set(copy.id, copy);
    return { ...copy };
  }

  async findLatestAttempt(learnerId: string, problemId: string): Promise<Attempt | null> {
    const all = await this.findByLearnerAndProblem(learnerId, problemId);
    if (all.length === 0) return null;
    return all[all.length - 1];
  }
}
