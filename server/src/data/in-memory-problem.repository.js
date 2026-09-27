import { IProblemRepository } from '../domain/repositories/problem.repository.interface.js';
import { SEED_PROBLEMS } from './seed-problems.js';

export class InMemoryProblemRepository extends IProblemRepository {
  constructor(initialProblems = SEED_PROBLEMS) {
    super();
    this.problems = new Map();
    for (const prob of initialProblems) {
      this.problems.set(prob.id, { ...prob });
    }
  }

  async findAll() {
    return Array.from(this.problems.values());
  }

  async findById(id) {
    const found = this.problems.get(id);
    return found ? { ...found } : null;
  }

  async save(problem) {
    this.problems.set(problem.id, { ...problem });
  }
}
