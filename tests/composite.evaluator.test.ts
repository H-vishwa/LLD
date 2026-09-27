import { describe, it, expect } from 'vitest';
import { CompositeEvaluator } from '../src/evaluators/composite.evaluator.js';
import { DeterministicEvaluator } from '../src/evaluators/deterministic.evaluator.js';
import { LLMEvaluator } from '../src/evaluators/llm.evaluator.js';
import { SEED_PROBLEMS } from '../src/data/seed-problems.js';
import { Submission } from '../src/domain/models/submission.model.js';

describe('CompositeEvaluator (Template Method & Reliability)', () => {
  const problem = SEED_PROBLEMS[0];
  const sampleSubmission: Submission = {
    rawContent: 'Sample raw content',
    parsedSuccessfully: true,
    parseErrors: [],
    rationaleText: 'Used strategy pattern to handle variable EV billing and surge rates cleanly without modifying core lot.',
    relationships: [{ from: 'ParkingLot', to: 'ParkingStrategy', type: 'uses' }],
    designBlocks: [
      { name: 'Vehicle', kind: 'abstract class', fields: [], methods: [], rawText: '' },
      { name: 'ParkingStrategy', kind: 'interface', fields: [], methods: ['findSpot'], rawText: '' },
      { name: 'ParkingLot', kind: 'class', fields: ['floors'], methods: ['park'], rawText: '' },
    ],
  };

  it('merges deterministic and LLM criteria into composite score', async () => {
    const composite = new CompositeEvaluator(
      new DeterministicEvaluator(),
      new LLMEvaluator()
    );

    const result = await composite.evaluate(sampleSubmission, problem);

    expect(result.isPartial).toBe(false);
    expect(result.criteria.length).toBeGreaterThanOrEqual(4);
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.engineVersion).toContain('composite-hybrid');

    // Check presence of both structural and reasoning criteria
    const hasSrp = result.criteria.some((c) => c.criterionId === 'srp_separation');
    const hasExtensibility = result.criteria.some((c) => c.criterionId === 'extensibility_readiness');
    expect(hasSrp).toBe(true);
    expect(hasExtensibility).toBe(true);
  });

  it('gracefully degrades to partial evaluation when LLM times out or fails', async () => {
    const failingLLM = new LLMEvaluator({ forceFailure: true });
    const compositeWithFailingLLM = new CompositeEvaluator(
      new DeterministicEvaluator(),
      failingLLM,
      { maxRetries: 1, timeoutMs: 500 }
    );

    const result = await compositeWithFailingLLM.evaluate(sampleSubmission, problem);

    expect(result.isPartial).toBe(true);
    expect(result.overallSummary).toContain('Deep LLM reasoning evaluation is temporarily unavailable');
    expect(result.criteria.length).toBeGreaterThan(0);
  });
});
