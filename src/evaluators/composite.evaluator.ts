import { CriterionScore, EvaluationResult } from '../domain/models/evaluation.model.js';
import { Problem } from '../domain/models/problem.model.js';
import { Submission } from '../domain/models/submission.model.js';
import { RUBRIC_DIMENSIONS } from '../domain/services/rubric.service.js';
import { DeterministicEvaluator } from './deterministic.evaluator.js';
import { IEvaluator } from './evaluator.interface.js';
import { LLMEvaluator } from './llm.evaluator.js';

export class CompositeEvaluator implements IEvaluator {
  public readonly name = 'CompositeEvaluator';
  private deterministicEvaluator: DeterministicEvaluator;
  private llmEvaluator: LLMEvaluator;
  private maxRetries: number;
  private timeoutMs: number;

  constructor(
    deterministicEvaluator = new DeterministicEvaluator(),
    llmEvaluator = new LLMEvaluator(),
    options: { maxRetries?: number; timeoutMs?: number } = {}
  ) {
    this.deterministicEvaluator = deterministicEvaluator;
    this.llmEvaluator = llmEvaluator;
    this.maxRetries = options.maxRetries ?? 2;
    this.timeoutMs = options.timeoutMs ?? 5000;
  }

  /**
   * Template Method coordinating multi-stage evaluation:
   * 1. Deterministic structural check (always executes first)
   * 2. LLM reasoning pass (with timeout & retry backoff)
   * 3. Merge criteria & compute weighted rubric score
   * 4. Graceful degradation to partial result if LLM fails
   */
  public async evaluate(submission: Submission, problem: Problem): Promise<EvaluationResult> {
    // Step 1: Deterministic evaluation (fast, structural)
    const deterministicResult = await this.deterministicEvaluator.evaluate(submission, problem);

    // Step 2: LLM evaluation with retry and timeout wrapper
    let llmResult: EvaluationResult | null = null;
    let attemptsLeft = this.maxRetries;

    while (attemptsLeft >= 0 && !llmResult) {
      try {
        llmResult = await this.executeWithTimeout(
          this.llmEvaluator.evaluate(submission, problem),
          this.timeoutMs
        );
      } catch (err) {
        attemptsLeft--;
        if (attemptsLeft < 0) {
          console.warn('LLM evaluation attempts exhausted or timed out. Falling back to partial deterministic result.');
          break;
        }
        // Small backoff before retry
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    // Step 3: Handle LLM failure -> Graceful partial degradation
    if (!llmResult) {
      return {
        ...deterministicResult,
        id: `eval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        isPartial: true,
        overallSummary: `${deterministicResult.overallSummary} (Note: Deep LLM reasoning evaluation is temporarily unavailable; showing structural assessment.)`,
      };
    }

    // Step 4: Merge CriterionScores & calculate weighted overall score
    return this.mergeResults(deterministicResult, llmResult);
  }

  private async executeWithTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    let timer: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      clearTimeout(timer!);
    }
  }

  private mergeResults(detResult: EvaluationResult, llmResult: EvaluationResult): EvaluationResult {
    // Combine criteria (avoiding duplicates by criterionId)
    const mergedCriteriaMap = new Map<string, CriterionScore>();

    for (const c of detResult.criteria) {
      mergedCriteriaMap.set(c.criterionId, c);
    }

    for (const c of llmResult.criteria) {
      if (mergedCriteriaMap.has(c.criterionId)) {
        // Average scores if both evaluators touched the dimension, or take LLM for qualitative
        const existing = mergedCriteriaMap.get(c.criterionId)!;
        mergedCriteriaMap.set(c.criterionId, {
          ...c,
          score: Math.round(((existing.score + c.score) / 2) * 10) / 10,
          strengths: Array.from(new Set([...existing.strengths, ...c.strengths])),
          improvements: Array.from(new Set([...existing.improvements, ...c.improvements])),
          evidenceRefs: Array.from(new Set([...existing.evidenceRefs, ...c.evidenceRefs])),
        });
      } else {
        mergedCriteriaMap.set(c.criterionId, c);
      }
    }

    const mergedCriteria = Array.from(mergedCriteriaMap.values());

    // Compute weighted overall score according to RUBRIC_DIMENSIONS
    let weightedSum = 0;
    let totalWeight = 0;

    for (const criterion of mergedCriteria) {
      const dimension = RUBRIC_DIMENSIONS.find((d) => d.id === criterion.criterionId);
      const weight = dimension ? dimension.weight : 20;
      weightedSum += (criterion.score / criterion.maxScore) * weight;
      totalWeight += weight;
    }

    const finalScore = Math.round((weightedSum / (totalWeight || 100)) * 100);

    const overallSummary = `Comprehensive Evaluation (${finalScore}%): Structural and reasoning checks completed. Identified ${mergedCriteria.flatMap(
      (c) => c.strengths
    ).length} strong architectural attributes and ${mergedCriteria.flatMap((c) => c.improvements).length} targeted improvements.`;

    return {
      id: `eval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      attemptId: '',
      overallScore: Math.min(100, Math.max(0, finalScore)),
      overallSummary,
      criteria: mergedCriteria,
      isPartial: false,
      engineVersion: 'composite-hybrid-v1.0',
      generatedAt: new Date().toISOString(),
    };
  }
}
