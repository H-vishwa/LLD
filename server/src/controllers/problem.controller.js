export class ProblemController {
  /**
   * @param {import('../../domain/repositories/problem.repository.interface.js').IProblemRepository} problemRepo
   */
  constructor(problemRepo) {
    this.problemRepo = problemRepo;
  }

  getAll = async (_req, res) => {
    try {
      const problems = await this.problemRepo.findAll();
      res.json(problems);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  getById = async (req, res) => {
    try {
      const problem = await this.problemRepo.findById(req.params.id);
      if (!problem) {
        res.status(404).json({ error: `Problem ${req.params.id} not found` });
        return;
      }
      res.json(problem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
}
