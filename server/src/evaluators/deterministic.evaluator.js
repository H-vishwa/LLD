import { IEvaluator } from './evaluator.interface.js';

export class DeterministicEvaluator extends IEvaluator {
  constructor() {
    super('DeterministicEvaluator');
  }

  /**
   * @param {import('../domain/models/submission.model.js').Submission} submission
   * @param {import('../domain/models/problem.model.js').Problem} problem
   * @returns {Promise<import('../domain/models/evaluation.model.js').EvaluationResult>}
   */
  async evaluate(submission, problem) {
    const criteria = [];

    // Dimension 1: Single Responsibility & Modularity (SRP)
    const srpScore = this.evaluateSRP(submission);
    criteria.push(srpScore);

    // Dimension 2: Abstraction & Design Patterns
    const abstractionScore = this.evaluateAbstraction(submission, problem);
    criteria.push(abstractionScore);

    // Dimension 3: Relationship & Coupling Correctness
    const relationshipScore = this.evaluateRelationships(submission);
    criteria.push(relationshipScore);

    // Dimension 4: Completeness (baseline structural check)
    const completenessScore = this.evaluateCompleteness(submission, problem);
    criteria.push(completenessScore);

    // Compute deterministic aggregate score (0 - 100)
    const totalScorePoints = criteria.reduce((sum, c) => sum + c.score, 0);
    const maxPossiblePoints = criteria.length * 5;
    const overallScore = Math.round((totalScorePoints / maxPossiblePoints) * 100);

    const overallSummary = this.generateSummary(criteria, overallScore);

    return {
      id: `det-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      attemptId: '',
      overallScore,
      overallSummary,
      criteria,
      isPartial: false,
      engineVersion: 'deterministic-v1.2',
      generatedAt: new Date().toISOString(),
    };
  }

  evaluateSRP(submission) {
    const blocks = submission.designBlocks;
    const godClasses = [];
    const wellStructured = [];
    const evidenceRefs = [];
    const strengths = [];
    const improvements = [];

    if (blocks.length === 0) {
      return {
        criterionId: 'srp_separation',
        criterionName: 'Single Responsibility & Modularity',
        category: 'Structural',
        score: 0,
        maxScore: 5,
        explanation: 'No classes or interfaces found in the submission.',
        evidenceRefs: [],
        strengths: [],
        improvements: ['Define clear class and interface blocks encapsulating cohesive responsibilities.'],
      };
    }

    for (const b of blocks) {
      if (b.kind === 'enum') continue;

      const fieldCount = b.fields.length;
      const methodCount = b.methods.length;

      if ((fieldCount >= 6 && methodCount >= 5) || methodCount >= 8) {
        godClasses.push(b.name);
        evidenceRefs.push(b.name);
      } else {
        wellStructured.push(b.name);
      }
    }

    let score = 5;
    if (godClasses.length > 0) {
      score = Math.max(1, 4 - godClasses.length * 1.5);
      improvements.push(
        `High coupling detected in [${godClasses.join(', ')}]. Consider decomposing into smaller domain delegates or strategies.`
      );
    } else {
      strengths.push('Classes demonstrate concise, focused method and state boundaries without monolithic bloat.');
    }

    if (wellStructured.length > 0) {
      evidenceRefs.push(...wellStructured.slice(0, 3));
      strengths.push(`Modular decomposition observed in: ${wellStructured.slice(0, 3).join(', ')}.`);
    }

    return {
      criterionId: 'srp_separation',
      criterionName: 'Single Responsibility & Modularity',
      category: 'Structural',
      score: Math.min(5, Math.max(0, Math.round(score * 10) / 10)),
      maxScore: 5,
      explanation:
        godClasses.length > 0
          ? `Identified ${godClasses.length} potentially bloated class(es) with high method/field counts.`
          : 'High degree of modularity with clear separation of concerns.',
      evidenceRefs: Array.from(new Set(evidenceRefs)),
      strengths,
      improvements,
    };
  }

  evaluateAbstraction(submission, problem) {
    const blocks = submission.designBlocks;
    const interfaces = blocks.filter((b) => b.kind === 'interface');
    const abstracts = blocks.filter((b) => b.kind === 'abstract class');
    const evidenceRefs = [];
    const strengths = [];
    const improvements = [];

    const totalAbstractions = interfaces.length + abstracts.length;
    evidenceRefs.push(...interfaces.map((i) => i.name), ...abstracts.map((a) => a.name));

    let score = 3;
    if (totalAbstractions === 0) {
      score = 2;
      improvements.push('No interfaces or abstract classes detected. Define abstractions for pluggable algorithms or policies.');
    } else if (totalAbstractions >= 2) {
      score = 5;
      strengths.push(
        `Good polymorphism: Introduced ${totalAbstractions} abstraction(s) (${interfaces.map((i) => i.name).join(', ')}).`
      );
    } else {
      score = 3.5;
      strengths.push(`Includes abstraction (${[...interfaces, ...abstracts].map((x) => x.name).join(', ')}).`);
      improvements.push('Consider creating interfaces for secondary variable concerns (e.g. pricing, scheduling, or state handlers).');
    }

    return {
      criterionId: 'appropriate_abstraction',
      criterionName: 'Abstraction & Design Patterns',
      category: 'Structural',
      score,
      maxScore: 5,
      explanation:
        totalAbstractions > 0
          ? `Found ${totalAbstractions} explicit contract(s) / abstract base(s) promoting loose coupling.`
          : 'System relies purely on concrete classes without inversion of control.',
      evidenceRefs,
      strengths,
      improvements,
    };
  }

  evaluateRelationships(submission) {
    const rels = submission.relationships;
    const blocks = submission.designBlocks;
    const classNames = new Set(blocks.map((b) => b.name.toLowerCase()));
    const evidenceRefs = [];
    const strengths = [];
    const improvements = [];

    if (rels.length === 0) {
      return {
        criterionId: 'relationship_integrity',
        criterionName: 'Relationship & Coupling Correctness',
        category: 'Structural',
        score: 1.5,
        maxScore: 5,
        explanation: 'No explicit relationships specified in the design submission.',
        evidenceRefs: [],
        strengths: [],
        improvements: ['Explicitly declare relationships (e.g. ClassA -> ClassB : uses | extends | composes).'],
      };
    }

    let validRelsCount = 0;
    const compositionCount = rels.filter((r) => r.type === 'composes' || r.type === 'aggregates').length;
    const inheritanceCount = rels.filter((r) => r.type === 'extends' || r.type === 'implements').length;

    for (const r of rels) {
      evidenceRefs.push(`${r.from} -> ${r.to}`);
      if (classNames.has(r.from.toLowerCase()) && classNames.has(r.to.toLowerCase())) {
        validRelsCount++;
      }
    }

    let score = 3;
    if (validRelsCount === rels.length && rels.length >= 3) {
      score = 4.5;
      strengths.push('All relationships reference defined classes with valid association types.');
    } else if (validRelsCount < rels.length / 2) {
      score = 2;
      improvements.push('Several relationship statements reference classes not defined in the design blocks.');
    }

    if (compositionCount > 0 && inheritanceCount > 0) {
      strengths.push('Balanced use of composition and inheritance (favoring composition over deep inheritance).');
      score = Math.min(5, score + 0.5);
    } else if (inheritanceCount > 4 && compositionCount === 0) {
      improvements.push('Noticeable inheritance bias: consider composition for dynamic runtime behavior.');
    }

    return {
      criterionId: 'relationship_integrity',
      criterionName: 'Relationship & Coupling Correctness',
      category: 'Structural',
      score,
      maxScore: 5,
      explanation: `Validated ${validRelsCount} consistent relationship link(s) across ${rels.length} defined association(s).`,
      evidenceRefs: evidenceRefs.slice(0, 5),
      strengths,
      improvements,
    };
  }

  evaluateCompleteness(submission, problem) {
    const blocks = submission.designBlocks;
    const classNamesLower = blocks.map((b) => b.name.toLowerCase());
    const evidenceRefs = [];
    const strengths = [];
    const improvements = [];

    let expectedKeywords = [];
    if (problem.id === 'parking-lot') {
      expectedKeywords = ['vehicle', 'spot', 'ticket', 'lot', 'strategy'];
    } else if (problem.id === 'elevator-system') {
      expectedKeywords = ['elevator', 'controller', 'state', 'request', 'floor'];
    } else if (problem.id === 'vending-machine') {
      expectedKeywords = ['item', 'inventory', 'state', 'machine', 'cash'];
    }

    const matchedKeywords = expectedKeywords.filter((keyword) =>
      classNamesLower.some((name) => name.includes(keyword))
    );

    const matchRatio = expectedKeywords.length > 0 ? matchedKeywords.length / expectedKeywords.length : 1;
    let score = Math.round(matchRatio * 5 * 10) / 10;

    matchedKeywords.forEach((kw) => evidenceRefs.push(`Concept: ${kw}`));

    if (matchRatio >= 0.8) {
      strengths.push(`High domain completeness: covered ${matchedKeywords.length}/${expectedKeywords.length} core problem domains.`);
    } else {
      const missing = expectedKeywords.filter((kw) => !matchedKeywords.includes(kw));
      improvements.push(`Missing key problem domain concepts: [${missing.join(', ')}].`);
    }

    return {
      criterionId: 'domain_completeness',
      criterionName: 'Domain Requirement Coverage',
      category: 'Structural',
      score,
      maxScore: 5,
      explanation: `Captured ${matchedKeywords.length} of ${expectedKeywords.length} foundational domain concepts.`,
      evidenceRefs,
      strengths,
      improvements,
    };
  }

  generateSummary(criteria, overallScore) {
    const topStrengths = criteria.flatMap((c) => c.strengths).slice(0, 2);
    const keyImprovements = criteria.flatMap((c) => c.improvements).slice(0, 2);

    let grade = 'Fair';
    if (overallScore >= 85) grade = 'Excellent';
    else if (overallScore >= 70) grade = 'Solid';
    else if (overallScore < 50) grade = 'Needs Work';

    return `Deterministic Assessment (${grade} - ${overallScore}%): ${topStrengths.join(' ')} ${
      keyImprovements.length > 0 ? `Key areas for refinement: ${keyImprovements.join(' ')}` : ''
    }`.trim();
  }
}
