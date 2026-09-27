/**
 * Base interface for Problem repository
 */
export class IProblemRepository {
  async findAll() {
    throw new Error('Method not implemented: findAll');
  }

  async findById(id) {
    throw new Error('Method not implemented: findById');
  }

  async save(problem) {
    throw new Error('Method not implemented: save');
  }
}
