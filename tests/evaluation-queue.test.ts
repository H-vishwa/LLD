import { describe, it, expect } from 'vitest';
import { EvaluationQueue } from '../src/queue/evaluation-queue.js';
import { InMemoryAttemptRepository } from '../src/data/in-memory-attempt.repository.js';
import { InMemoryEvaluationRepository } from '../src/data/in-memory-evaluation.repository.js';
import { InMemoryProblemRepository } from '../src/data/in-memory-problem.repository.js';
import { DeterministicEvaluator } from '../src/evaluators/deterministic.evaluator.js';
import { Attempt } from '../src/domain/models/attempt.model.js';

describe('EvaluationQueue (Async Processing & Reliability)', () => {
  it('processes an enqueued attempt asynchronously to completion', async () => {
    const attemptRepo = new InMemoryAttemptRepository();
    const evalRepo = new InMemoryEvaluationRepository();
    const problemRepo = new InMemoryProblemRepository();
    const evaluator = new DeterministicEvaluator();

    const queue = new EvaluationQueue(attemptRepo, evalRepo, problemRepo, evaluator);

    const initialAttempt: Attempt = {
      id: 'test-attempt-1',
      problemId: 'parking-lot',
      learnerId: 'learner-1',
      status: 'Submitted',
      rawContent: `
## Design
\`\`\`typescript
class Vehicle {}
class ParkingLot {}
\`\`\`
## Relationships
ParkingLot -> Vehicle : uses
## Rationale
Simple prototype
`,
      createdAt: new Date().toISOString(),
    };

    await attemptRepo.create(initialAttempt);

    queue.enqueue(initialAttempt.id);

    // Wait briefly for queue async event loop to process
    await new Promise((resolve) => setTimeout(resolve, 300));

    const updated = await attemptRepo.findById(initialAttempt.id);
    expect(updated?.status).toBe('Evaluated');
    expect(updated?.resultId).toBeDefined();

    const evalResult = await evalRepo.findByAttemptId(initialAttempt.id);
    expect(evalResult).toBeDefined();
    expect(evalResult?.overallScore).toBeGreaterThan(0);
  });
});
