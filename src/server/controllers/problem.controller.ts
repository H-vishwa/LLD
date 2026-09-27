import { Request, Response } from 'express';
import { IProblemRepository } from '../../domain/repositories/problem.repository.interface.js';

export class ProblemController {
  constructor(private problemRepo: IProblemRepository) {}

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const problems = await this.problemRepo.findAll();
      res.json(problems);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const problem = await this.problemRepo.findById(req.params.id);
      if (!problem) {
        res.status(404).json({ error: `Problem ${req.params.id} not found` });
        return;
      }
      res.json(problem);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}
