/**
 * @typedef {'Draft' | 'Submitted' | 'Evaluating' | 'Evaluated' | 'Failed'} AttemptStatus
 * 
 * @typedef {Object} Attempt
 * @property {string} id
 * @property {string} problemId
 * @property {string} learnerId
 * @property {AttemptStatus} status
 * @property {string} rawContent
 * @property {import('./submission.model.js').Submission} [submission]
 * @property {string} [resultId]
 * @property {string} [errorMessage]
 * @property {string} createdAt
 * @property {string} [submittedAt]
 * @property {string} [evaluatedAt]
 * @property {string} [previousAttemptId] - Links to prior attempt for comparison / delta view
 * 
 * @typedef {Object} AttemptDelta
 * @property {string} currentAttemptId
 * @property {string} previousAttemptId
 * @property {number} scoreDifference
 * @property {string[]} addedClasses
 * @property {string[]} removedClasses
 * @property {Array<{
 *   criterionId: string,
 *   criterionName: string,
 *   previousScore: number,
 *   currentScore: number,
 *   diff: number
 * }>} criteriaDeltas
 */

export const AttemptStatuses = Object.freeze({
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  EVALUATING: 'Evaluating',
  EVALUATED: 'Evaluated',
  FAILED: 'Failed',
});
