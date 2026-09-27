import { Problem } from '../domain/models/problem.model.js';
import { IProblemRepository } from '../domain/repositories/problem.repository.interface.js';
import { SEED_PROBLEMS } from './seed-problems.js';

export class InMemoryProblemRepository implements IProblemRepository {
  private problems: Map<string, Problem> = new Map();

  constructor(initialProblems: Problem[] = SEED_PROBLEMS) {
    for (const prob of initialProblems) {
      this.problems.set(prob.id, { ...prob });
    }
  }

  async findAll(): Promise<Problem[]> {
    return Array.from(this.problems.values());
  }

  async findById(id: string): Promise<Problem | null> {
    const found = this.problems.get(id);
    return found ? { ...found } : null;
  }

  async save(problem: Problem): Promise<void> {
    this.problems.set(problem.id, { ...problem });
  }
}
