/**
 * Base interface for Attempt repository
 */
export class IAttemptRepository {
  async create(attempt) {
    throw new Error('Method not implemented: create');
  }

  async findById(id) {
    throw new Error('Method not implemented: findById');
  }

  async findByLearnerAndProblem(learnerId, problemId) {
    throw new Error('Method not implemented: findByLearnerAndProblem');
  }

  async update(attempt) {
    throw new Error('Method not implemented: update');
  }

  async findLatestAttempt(learnerId, problemId) {
    throw new Error('Method not implemented: findLatestAttempt');
  }
}
