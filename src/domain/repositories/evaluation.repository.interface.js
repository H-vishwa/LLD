/**
 * Base interface for Evaluation repository
 */
export class IEvaluationRepository {
  async save(result) {
    throw new Error('Method not implemented: save');
  }

  async findById(id) {
    throw new Error('Method not implemented: findById');
  }

  async findByAttemptId(attemptId) {
    throw new Error('Method not implemented: findByAttemptId');
  }
}
