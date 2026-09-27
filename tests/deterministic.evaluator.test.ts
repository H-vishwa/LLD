import { describe, it, expect } from 'vitest';
import { DeterministicEvaluator } from '../src/evaluators/deterministic.evaluator.js';
import { SEED_PROBLEMS } from '../src/data/seed-problems.js';
import { Submission } from '../src/domain/models/submission.model.js';

describe('DeterministicEvaluator', () => {
  const evaluator = new DeterministicEvaluator();
  const parkingProblem = SEED_PROBLEMS[0];

  it('penalizes god classes with bloated fields and methods', async () => {
    const bloatedSubmission: Submission = {
      rawContent: '...',
      parsedSuccessfully: true,
      parseErrors: [],
      rationaleText: 'Monolithic manager handles everything',
      relationships: [],
      designBlocks: [
        {
          name: 'MegaGodParkingLotManager',
          kind: 'class',
          fields: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'],
          methods: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'],
          rawText: 'class MegaGodParkingLotManager {}',
        },
      ],
    };

    const result = await evaluator.evaluate(bloatedSubmission, parkingProblem);
    const srpCriterion = result.criteria.find((c) => c.criterionId === 'srp_separation');

    expect(srpCriterion).toBeDefined();
    expect(srpCriterion!.score).toBeLessThanOrEqual(2.5);
    expect(srpCriterion!.evidenceRefs).toContain('MegaGodParkingLotManager');
    expect(srpCriterion!.improvements.some((i) => i.includes('MegaGodParkingLotManager'))).toBe(true);
  });

  it('rewards modular designs with abstractions and relationships', async () => {
    const modularSubmission: Submission = {
      rawContent: '...',
      parsedSuccessfully: true,
      parseErrors: [],
      rationaleText: 'Clean strategy separation for pricing and parking assignment',
      relationships: [
        { from: 'ParkingLot', to: 'ParkingStrategy', type: 'uses' },
        { from: 'ParkingLot', to: 'ParkingSpot', type: 'composes' },
        { from: 'Car', to: 'Vehicle', type: 'extends' },
      ],
      designBlocks: [
        { name: 'Vehicle', kind: 'abstract class', fields: ['licenseNumber'], methods: [], rawText: '' },
        { name: 'Car', kind: 'class', fields: [], methods: [], rawText: '' },
        { name: 'ParkingSpot', kind: 'class', fields: ['id', 'status'], methods: ['assign'], rawText: '' },
        { name: 'ParkingTicket', kind: 'class', fields: ['ticketId'], methods: [], rawText: '' },
        { name: 'ParkingStrategy', kind: 'interface', fields: [], methods: ['findSpot'], rawText: '' },
        { name: 'ParkingLot', kind: 'class', fields: ['floors'], methods: ['park', 'exit'], rawText: '' },
      ],
    };

    const result = await evaluator.evaluate(modularSubmission, parkingProblem);
    const srp = result.criteria.find((c) => c.criterionId === 'srp_separation');
    const abstraction = result.criteria.find((c) => c.criterionId === 'appropriate_abstraction');
    const rels = result.criteria.find((c) => c.criterionId === 'relationship_integrity');

    expect(srp?.score).toBeGreaterThanOrEqual(4.0);
    expect(abstraction?.score).toBe(5);
    expect(rels?.score).toBeGreaterThanOrEqual(4.5);
    expect(result.overallScore).toBeGreaterThanOrEqual(80);
  });
});
