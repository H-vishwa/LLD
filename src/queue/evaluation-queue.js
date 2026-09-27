import { SubmissionParserService } from '../domain/services/submission-parser.service.js';

export class EvaluationQueue {
  /**
   * @param {import('../domain/repositories/attempt.repository.interface.js').IAttemptRepository} attemptRepo
   * @param {import('../domain/repositories/evaluation.repository.interface.js').IEvaluationRepository} evalRepo
   * @param {import('../domain/repositories/problem.repository.interface.js').IProblemRepository} problemRepo
   * @param {import('../evaluators/evaluator.interface.js').IEvaluator} evaluator
   * @param {SubmissionParserService} [parser]
   */
  constructor(
    attemptRepo,
    evalRepo,
    problemRepo,
    evaluator,
    parser = new SubmissionParserService()
  ) {
    this.queue = [];
    this.isProcessing = false;
    this.attemptRepo = attemptRepo;
    this.evalRepo = evalRepo;
    this.problemRepo = problemRepo;
    this.evaluator = evaluator;
    this.parser = parser;
  }

  enqueue(attemptId) {
    this.queue.push({
      attemptId,
      enqueuedAt: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 2,
    });

    setTimeout(() => {
      this.processNext().catch((err) => console.error('Queue processing error:', err));
    }, 50);
  }

  async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const job = this.queue.shift();
    if (!job) {
      this.isProcessing = false;
      return;
    }

    try {
      const attempt = await this.attemptRepo.findById(job.attemptId);
      if (!attempt) {
        console.warn(`Attempt ${job.attemptId} not found in queue processor.`);
        return;
      }

      attempt.status = 'Evaluating';
      await this.attemptRepo.update(attempt);

      const problem = await this.problemRepo.findById(attempt.problemId);
      if (!problem) {
        throw new Error(`Problem ${attempt.problemId} not found`);
      }

      const parsedSubmission = this.parser.parse(attempt.rawContent);
      attempt.submission = parsedSubmission;

      const evalResult = await this.evaluator.evaluate(parsedSubmission, problem);
      evalResult.attemptId = attempt.id;

      await this.evalRepo.save(evalResult);

      attempt.status = 'Evaluated';
      attempt.resultId = evalResult.id;
      attempt.evaluatedAt = new Date().toISOString();
      await this.attemptRepo.update(attempt);
    } catch (err) {
      console.error(`Evaluation failed for attempt ${job.attemptId}:`, err);

      if (job.retryCount < job.maxRetries) {
        job.retryCount++;
        this.queue.push(job);
      } else {
        const attempt = await this.attemptRepo.findById(job.attemptId);
        if (attempt) {
          attempt.status = 'Failed';
          attempt.errorMessage = err?.message || 'Evaluation job failed after maximum retries';
          await this.attemptRepo.update(attempt);
        }
      }
    } finally {
      this.isProcessing = false;
      if (this.queue.length > 0) {
        setTimeout(() => this.processNext(), 50);
      }
    }
  }

  getQueueLength() {
    return this.queue.length;
  }
}
