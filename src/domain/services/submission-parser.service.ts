import { BlockKind, DesignBlock, Relationship, RelationshipType, Submission } from '../models/submission.model.js';

export class SubmissionParserService {
  /**
   * Parses free-form or markdown-structured submission into structured domain entities:
   * - DesignBlocks (classes, interfaces, enums)
   * - Relationships (ClassA -> ClassB : verb)
   * - Rationale (design decisions, trade-offs)
   */
  public parse(rawContent: string): Submission {
    const parseErrors: string[] = [];
    if (!rawContent || rawContent.trim().length === 0) {
      return {
        rawContent,
        designBlocks: [],
        relationships: [],
        rationaleText: '',
        parsedSuccessfully: false,
        parseErrors: ['Submission is empty. Please provide class definitions and design rationale.'],
      };
    }

    const designBlocks = this.extractDesignBlocks(rawContent, parseErrors);
    const relationships = this.extractRelationships(rawContent);
    const rationaleText = this.extractRationale(rawContent);

    if (designBlocks.length === 0) {
      parseErrors.push('No class, interface, or enum definitions detected. Check syntax or code block fencing.');
    }

    if (rationaleText.trim().length < 20) {
      parseErrors.push('Design rationale is missing or too brief. Please explain architectural trade-offs.');
    }

    return {
      rawContent,
      designBlocks,
      relationships,
      rationaleText,
      parsedSuccessfully: designBlocks.length > 0,
      parseErrors,
    };
  }

  private extractDesignBlocks(content: string, parseErrors: string[]): DesignBlock[] {
    const blocks: DesignBlock[] = [];
    const seenNames = new Set<string>();

    // Matches class, interface, enum, abstract class declarations
    // e.g., class Car, abstract class Vehicle, interface ParkingStrategy, enum SpotType
    const declarationRegex = /(?:export\s+)?(abstract\s+class|class|interface|enum)\s+([A-Za-z0-9_]+)(?:<[^>]+>)?(?:\s+(?:extends|implements)\s+[^{]+)?\s*\{([^}]*)\}/gs;

    let match: RegExpExecArray | null;
    while ((match = declarationRegex.exec(content)) !== null) {
      const rawKind = match[1].trim();
      const name = match[2].trim();
      const body = match[3];

      let kind: BlockKind = 'class';
      if (rawKind.includes('interface')) kind = 'interface';
      else if (rawKind.includes('enum')) kind = 'enum';
      else if (rawKind.includes('abstract')) kind = 'abstract class';

      if (seenNames.has(name.toLowerCase())) {
        parseErrors.push(`Duplicate class/interface name detected: '${name}'.`);
      }
      seenNames.add(name.toLowerCase());

      const { fields, methods } = this.extractMembers(body, kind);

      blocks.push({
        name,
        kind,
        fields,
        methods,
        rawText: match[0],
      });
    }

    // Fallback: If no block regex matched, check for single-line class statements: e.g. "class Foo {}" or "class Foo extends Bar;"
    if (blocks.length === 0) {
      const simpleRegex = /(?:abstract\s+class|class|interface|enum)\s+([A-Za-z0-9_]+)/g;
      let simpleMatch: RegExpExecArray | null;
      while ((simpleMatch = simpleRegex.exec(content)) !== null) {
        const name = simpleMatch[1].trim();
        if (!seenNames.has(name.toLowerCase())) {
          seenNames.add(name.toLowerCase());
          blocks.push({
            name,
            kind: 'class',
            fields: [],
            methods: [],
            rawText: simpleMatch[0],
          });
        }
      }
    }

    return blocks;
  }

  private extractMembers(body: string, kind: BlockKind): { fields: string[]; methods: string[] } {
    const fields: string[] = [];
    const methods: string[] = [];

    if (kind === 'enum') {
      // In enums, lines are enum members
      const enumMembers = body
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith('//') && !s.startsWith('/*'));
      return { fields: enumMembers, methods: [] };
    }

    const lines = body.split('\n');
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
        continue;
      }

      // Check if line represents a method: contains parentheses ()
      if (line.includes('(') && line.includes(')')) {
        // e.g. public assignVehicle(vehicle: Vehicle): boolean {} or void handle()
        const methodMatch = line.match(/(?:public|private|protected)?\s*(?:async)?\s*([A-Za-z0-9_]+)\s*\([^)]*\)/);
        if (methodMatch) {
          methods.push(methodMatch[1]);
        } else {
          methods.push(line.replace(/[{};]/g, '').trim());
        }
      } else {
        // e.g. private id: string; or String name;
        const fieldMatch = line.match(/(?:public|private|protected)?\s*(?:readonly)?\s*([A-Za-z0-9_]+)\s*[:=]/);
        if (fieldMatch) {
          fields.push(fieldMatch[1]);
        } else {
          const cleaned = line.replace(/[{};]/g, '').trim();
          if (cleaned.length > 0 && !cleaned.includes('{') && !cleaned.includes('}')) {
            fields.push(cleaned);
          }
        }
      }
    }

    return { fields, methods };
  }

  private extractRelationships(content: string): Relationship[] {
    const relationships: Relationship[] = [];
    // Formats:
    // ClassA -> ClassB : uses
    // ClassA -> ClassB : extends
    // ClassA -> ClassB (uses)
    // ClassA => ClassB : composes
    const relRegex = /([A-Za-z0-9_]+)\s*(?:->|=>|--)\s*([A-Za-z0-9_]+)\s*(?::|\(([^)]+)\))\s*([A-Za-z0-9_]+)?/g;

    let match: RegExpExecArray | null;
    while ((match = relRegex.exec(content)) !== null) {
      const from = match[1].trim();
      const to = match[2].trim();
      const rawVerb = (match[4] || match[3] || 'uses').trim().toLowerCase();

      let type: RelationshipType = 'uses';
      if (rawVerb.includes('extend') || rawVerb.includes('inherit')) type = 'extends';
      else if (rawVerb.includes('implement')) type = 'implements';
      else if (rawVerb.includes('compose') || rawVerb.includes('has-a')) type = 'composes';
      else if (rawVerb.includes('aggregate')) type = 'aggregates';

      relationships.push({
        from,
        to,
        type,
        rawText: match[0].trim(),
      });
    }

    return relationships;
  }

  private extractRationale(content: string): string {
    // Look for ## Rationale or ## Trade-offs section
    const rationaleMatch = content.match(/##\s*(?:Rationale|Design Rationale|Trade-offs|Reasoning)([\s\S]*?)(?:##|$)/i);
    if (rationaleMatch && rationaleMatch[1]) {
      return rationaleMatch[1].trim();
    }

    // If no header, see if there are paragraphs after code blocks
    const parts = content.split(/```/);
    if (parts.length > 2) {
      const afterCode = parts.slice(2).join(' ').trim();
      if (afterCode.length > 30) {
        return afterCode;
      }
    }

    return content.length > 100 ? content.slice(-300).trim() : '';
  }
}
