import { Attempt } from '../domain/models/attempt.model.js';
import { IAttemptRepository } from '../domain/repositories/attempt.repository.interface.js';
import { IEvaluationRepository } from '../domain/repositories/evaluation.repository.interface.js';
import { IProblemRepository } from '../domain/repositories/problem.repository.interface.js';
import { SubmissionParserService } from '../domain/services/submission-parser.service.js';
import { IEvaluator } from '../evaluators/evaluator.interface.js';

export interface EvaluationJob {
  attemptId: string;
  enqueuedAt: string;
  retryCount: number;
  maxRetries: number;
}

export class EvaluationQueue {
  private queue: EvaluationJob[] = [];
  private isProcessing = false;
  private attemptRepo: IAttemptRepository;
  private evalRepo: IEvaluationRepository;
  private problemRepo: IProblemRepository;
  private evaluator: IEvaluator;
  private parser: SubmissionParserService;

  constructor(
    attemptRepo: IAttemptRepository,
    evalRepo: IEvaluationRepository,
    problemRepo: IProblemRepository,
    evaluator: IEvaluator,
    parser = new SubmissionParserService()
  ) {
    this.attemptRepo = attemptRepo;
    this.evalRepo = evalRepo;
    this.problemRepo = problemRepo;
    this.evaluator = evaluator;
    this.parser = parser;
  }

  public enqueue(attemptId: string): void {
    this.queue.push({
      attemptId,
      enqueuedAt: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 2,
    });

    // Start processing async (non-blocking)
    setTimeout(() => {
      this.processNext().catch((err) => console.error('Queue processing error:', err));
    }, 50);
  }

  public async processNext(): Promise<void> {
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

      // Update attempt status to Evaluating
      attempt.status = 'Evaluating';
      await this.attemptRepo.update(attempt);

      const problem = await this.problemRepo.findById(attempt.problemId);
      if (!problem) {
        throw new Error(`Problem ${attempt.problemId} not found`);
      }

      // Parse submission
      const parsedSubmission = this.parser.parse(attempt.rawContent);
      attempt.submission = parsedSubmission;

      // Run evaluation
      const evalResult = await this.evaluator.evaluate(parsedSubmission, problem);
      evalResult.attemptId = attempt.id;

      // Persist evaluation result
      await this.evalRepo.save(evalResult);

      // Update attempt to Evaluated
      attempt.status = 'Evaluated';
      attempt.resultId = evalResult.id;
      attempt.evaluatedAt = new Date().toISOString();
      await this.attemptRepo.update(attempt);
    } catch (err: any) {
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

  public getQueueLength(): number {
    return this.queue.length;
  }
}
