export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: string;
  title: string;
  shortDescription: string;
  requirementsMarkdown: string;
  constraints: string[];
  difficulty: Difficulty;
  tags: string[];
  extensibilityPrompt: string; // The "What if X changes" evaluation hook
  starterTemplate: string;
}
