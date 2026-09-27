/**
 * @typedef {Object} CriterionScore
 * @property {string} criterionId
 * @property {string} criterionName
 * @property {'Structural' | 'Reasoning' | 'Extensibility'} category
 * @property {number} score - 0 to 5
 * @property {number} maxScore - 5
 * @property {string} explanation
 * @property {string[]} evidenceRefs - Class names, methods, or relationship mentions
 * @property {string[]} strengths
 * @property {string[]} improvements
 * 
 * @typedef {Object} EvaluationResult
 * @property {string} id
 * @property {string} attemptId
 * @property {number} overallScore - 0 to 100 percentage
 * @property {string} overallSummary
 * @property {CriterionScore[]} criteria
 * @property {boolean} isPartial - True if LLM timed out/failed and deterministic fallback was used
 * @property {string} engineVersion
 * @property {string} generatedAt
 */

export const CriterionCategories = Object.freeze({
  STRUCTURAL: 'Structural',
  REASONING: 'Reasoning',
  EXTENSIBILITY: 'Extensibility',
});
