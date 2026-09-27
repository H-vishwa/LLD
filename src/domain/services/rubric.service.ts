export interface RubricDimension {
  id: string;
  name: string;
  category: 'Structural' | 'Reasoning' | 'Extensibility';
  description: string;
  weight: number; // percentage of total score (sums to 100)
  maxScore: number;
}

export const RUBRIC_DIMENSIONS: RubricDimension[] = [
  {
    id: 'srp_separation',
    name: 'Single Responsibility & Modularity',
    category: 'Structural',
    description: 'Classes possess focused responsibilities without bloated "god objects". Clean separation of entity, policy, and state.',
    weight: 25,
    maxScore: 5,
  },
  {
    id: 'appropriate_abstraction',
    name: 'Abstraction & Design Patterns',
    category: 'Structural',
    description: 'Appropriate use of interfaces, abstract classes, and standard GoF patterns (Strategy, State, Factory, Observer) where warranted.',
    weight: 25,
    maxScore: 5,
  },
  {
    id: 'relationship_integrity',
    name: 'Relationship & Coupling Correctness',
    category: 'Structural',
    description: 'Correct modeling of associations (composition over inheritance where appropriate, clean dependency direction).',
    weight: 15,
    maxScore: 5,
  },
  {
    id: 'extensibility_readiness',
    name: 'Extensibility & Open/Closed Principle',
    category: 'Extensibility',
    description: 'Ability of the design to absorb new requirements and future changes without cascading modifications.',
    weight: 20,
    maxScore: 5,
  },
  {
    id: 'tradeoff_rationale',
    name: 'Architectural Rationale & Trade-offs',
    category: 'Reasoning',
    description: 'Clear, coherent justification of design choices, alternative options considered, and acknowledged limitations.',
    weight: 15,
    maxScore: 5,
  },
];
