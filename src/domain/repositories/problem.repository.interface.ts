import { Problem } from '../models/problem.model.js';

export interface IProblemRepository {
  findAll(): Promise<Problem[]>;
  findById(id: string): Promise<Problem | null>;
  save(problem: Problem): Promise<void>;
}
