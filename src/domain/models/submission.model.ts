export type BlockKind = 'class' | 'interface' | 'enum' | 'abstract class';

export interface DesignBlock {
  name: string;
  kind: BlockKind;
  fields: string[];
  methods: string[];
  rawText: string;
  startLine?: number;
}

export type RelationshipType = 'uses' | 'extends' | 'implements' | 'composes' | 'aggregates';

export interface Relationship {
  from: string;
  to: string;
  type: RelationshipType;
  description?: string;
  rawText?: string;
}

export interface Submission {
  rawContent: string;
  designBlocks: DesignBlock[];
  relationships: Relationship[];
  rationaleText: string;
  parsedSuccessfully: boolean;
  parseErrors: string[];
}
