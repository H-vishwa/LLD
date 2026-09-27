import { Attempt } from '../models/attempt.model.js';

export interface IAttemptRepository {
  create(attempt: Attempt): Promise<Attempt>;
  findById(id: string): Promise<Attempt | null>;
  findByLearnerAndProblem(learnerId: string, problemId: string): Promise<Attempt[]>;
  update(attempt: Attempt): Promise<Attempt>;
  findLatestAttempt(learnerId: string, problemId: string): Promise<Attempt | null>;
}
