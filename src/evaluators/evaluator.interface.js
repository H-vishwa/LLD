/**
 * Strategy Pattern base contract for Evaluator implementations
 */
export class IEvaluator {
  constructor(name = 'IEvaluator') {
    this.name = name;
  }

  /**
   * @param {import('../domain/models/submission.model.js').Submission} submission
   * @param {import('../domain/models/problem.model.js').Problem} problem
   * @returns {Promise<import('../domain/models/evaluation.model.js').EvaluationResult>}
   */
  async evaluate(submission, problem) {
    throw new Error('Method not implemented: evaluate');
  }
}
