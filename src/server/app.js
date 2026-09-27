import express from 'express';
import cors from 'cors';
import path from 'path';
import { InMemoryProblemRepository } from '../data/in-memory-problem.repository.js';
import { InMemoryAttemptRepository } from '../data/in-memory-attempt.repository.js';
import { InMemoryEvaluationRepository } from '../data/in-memory-evaluation.repository.js';
import { DeterministicEvaluator } from '../evaluators/deterministic.evaluator.js';
import { LLMEvaluator } from '../evaluators/llm.evaluator.js';
import { CompositeEvaluator } from '../evaluators/composite.evaluator.js';
import { SubmissionParserService } from '../domain/services/submission-parser.service.js';
import { EvaluationQueue } from '../queue/evaluation-queue.js';
import { ProblemController } from './controllers/problem.controller.js';
import { AttemptController } from './controllers/attempt.controller.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '5mb' }));

  // Dependency Injection & Inversion of Control
  const problemRepo = new InMemoryProblemRepository();
  const attemptRepo = new InMemoryAttemptRepository();
  const evalRepo = new InMemoryEvaluationRepository();
  const parser = new SubmissionParserService();

  const deterministicEvaluator = new DeterministicEvaluator();
  const llmEvaluator = new LLMEvaluator();
  const compositeEvaluator = new CompositeEvaluator(deterministicEvaluator, llmEvaluator);

  const evalQueue = new EvaluationQueue(
    attemptRepo,
    evalRepo,
    problemRepo,
    compositeEvaluator,
    parser
  );

  const problemController = new ProblemController(problemRepo);
  const attemptController = new AttemptController(attemptRepo, evalRepo, evalQueue, parser);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      queueLength: evalQueue.getQueueLength(),
    });
  });

  // Problem routes
  app.get('/api/problems', problemController.getAll);
  app.get('/api/problems/:id', problemController.getById);

  // Attempt routes
  app.post('/api/attempts', attemptController.create);
  app.get('/api/attempts/:id', attemptController.getById);
  app.get('/api/attempts/history', attemptController.getHistory);
  app.get('/api/attempts/:id/delta', attemptController.getDelta);
  app.post('/api/parse/preview', attemptController.previewParse);

  // Serve static client bundle if built
  const clientDist = path.resolve(process.cwd(), 'dist/client');
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'), (err) => {
      if (err) next();
    });
  });

  return {
    app,
    problemRepo,
    attemptRepo,
    evalRepo,
    evalQueue,
    compositeEvaluator,
  };
}
