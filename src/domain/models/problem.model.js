/**
 * @typedef {'Easy' | 'Medium' | 'Hard'} Difficulty
 * 
 * @typedef {Object} Problem
 * @property {string} id
 * @property {string} title
 * @property {string} shortDescription
 * @property {string} requirementsMarkdown
 * @property {string[]} constraints
 * @property {Difficulty} difficulty
 * @property {string[]} tags
 * @property {string} extensibilityPrompt - The "What if X changes" evaluation hook
 * @property {string} starterTemplate
 */

export const ProblemDifficulties = Object.freeze({
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
});
