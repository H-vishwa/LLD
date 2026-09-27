export class SubmissionParserService {
  /**
   * Parses free-form or markdown-structured submission into structured domain entities:
   * - DesignBlocks (classes, interfaces, enums)
   * - Relationships (ClassA -> ClassB : verb)
   * - Rationale (design decisions, trade-offs)
   * 
   * @param {string} rawContent
   * @returns {import('../models/submission.model.js').Submission}
   */
  parse(rawContent) {
    const parseErrors = [];
    if (!rawContent || rawContent.trim().length === 0) {
      return {
        rawContent: rawContent || '',
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

  /**
   * @private
   */
  extractDesignBlocks(content, parseErrors) {
    const blocks = [];
    const seenNames = new Set();

    // Matches class, interface, enum, abstract class declarations
    const declarationRegex = /(?:export\s+)?(abstract\s+class|class|interface|enum)\s+([A-Za-z0-9_]+)(?:<[^>]+>)?(?:\s+(?:extends|implements)\s+[^{]+)?\s*\{([^}]*)\}/gs;

    let match;
    while ((match = declarationRegex.exec(content)) !== null) {
      const rawKind = match[1].trim();
      const name = match[2].trim();
      const body = match[3];

      let kind = 'class';
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

    // Fallback: If no block regex matched, check for single-line class statements
    if (blocks.length === 0) {
      const simpleRegex = /(?:abstract\s+class|class|interface|enum)\s+([A-Za-z0-9_]+)/g;
      let simpleMatch;
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

  /**
   * @private
   */
  extractMembers(body, kind) {
    const fields = [];
    const methods = [];

    if (kind === 'enum') {
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

      if (line.includes('(') && line.includes(')')) {
        const methodMatch = line.match(/(?:public|private|protected)?\s*(?:async)?\s*([A-Za-z0-9_]+)\s*\([^)]*\)/);
        if (methodMatch) {
          methods.push(methodMatch[1]);
        } else {
          methods.push(line.replace(/[{};]/g, '').trim());
        }
      } else {
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

  /**
   * @private
   */
  extractRelationships(content) {
    const relationships = [];
    const relRegex = /([A-Za-z0-9_]+)\s*(?:->|=>|--)\s*([A-Za-z0-9_]+)\s*(?::|\(([^)]+)\))\s*([A-Za-z0-9_]+)?/g;

    let match;
    while ((match = relRegex.exec(content)) !== null) {
      const from = match[1].trim();
      const to = match[2].trim();
      const rawVerb = (match[4] || match[3] || 'uses').trim().toLowerCase();

      let type = 'uses';
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

  /**
   * @private
   */
  extractRationale(content) {
    const rationaleMatch = content.match(/##\s*(?:Rationale|Design Rationale|Trade-offs|Reasoning)([\s\S]*?)(?:##|$)/i);
    if (rationaleMatch && rationaleMatch[1]) {
      return rationaleMatch[1].trim();
    }

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
