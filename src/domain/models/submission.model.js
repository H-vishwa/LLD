/**
 * @typedef {'class' | 'interface' | 'enum' | 'abstract class'} BlockKind
 * 
 * @typedef {Object} DesignBlock
 * @property {string} name
 * @property {BlockKind} kind
 * @property {string[]} fields
 * @property {string[]} methods
 * @property {string} rawText
 * @property {number} [startLine]
 * 
 * @typedef {'uses' | 'extends' | 'implements' | 'composes' | 'aggregates'} RelationshipType
 * 
 * @typedef {Object} Relationship
 * @property {string} from
 * @property {string} to
 * @property {RelationshipType} type
 * @property {string} [description]
 * @property {string} [rawText]
 * 
 * @typedef {Object} Submission
 * @property {string} rawContent
 * @property {DesignBlock[]} designBlocks
 * @property {Relationship[]} relationships
 * @property {string} rationaleText
 * @property {boolean} parsedSuccessfully
 * @property {string[]} parseErrors
 */

export const RelationshipTypes = Object.freeze({
  USES: 'uses',
  EXTENDS: 'extends',
  IMPLEMENTS: 'implements',
  COMPOSES: 'composes',
  AGGREGATES: 'aggregates',
});
