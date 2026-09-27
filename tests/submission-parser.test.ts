import { describe, it, expect } from 'vitest';
import { SubmissionParserService } from '../src/domain/services/submission-parser.service.js';

describe('SubmissionParserService', () => {
  const parser = new SubmissionParserService();

  it('parses valid classes, interfaces, enums and members', () => {
    const rawContent = `
## Design
\`\`\`typescript
enum SpotType {
  COMPACT,
  LARGE
}

interface ParkingStrategy {
  findSpot(spots: any[]): any;
}

class ParkingLot {
  private floors: any[];
  public issueTicket(vehicle: any): any {}
}
\`\`\`

## Relationships
ParkingLot -> ParkingStrategy : uses

## Rationale
Used strategy pattern to make spot allocation pluggable.
`;

    const parsed = parser.parse(rawContent);

    expect(parsed.parsedSuccessfully).toBe(true);
    expect(parsed.designBlocks.length).toBe(3);

    const enumBlock = parsed.designBlocks.find((b) => b.name === 'SpotType');
    expect(enumBlock?.kind).toBe('enum');
    expect(enumBlock?.fields).toContain('COMPACT');

    const interfaceBlock = parsed.designBlocks.find((b) => b.name === 'ParkingStrategy');
    expect(interfaceBlock?.kind).toBe('interface');
    expect(interfaceBlock?.methods).toContain('findSpot');

    const classBlock = parsed.designBlocks.find((b) => b.name === 'ParkingLot');
    expect(classBlock?.kind).toBe('class');
    expect(classBlock?.fields).toContain('floors');
    expect(classBlock?.methods).toContain('issueTicket');

    expect(parsed.relationships.length).toBe(1);
    expect(parsed.relationships[0].from).toBe('ParkingLot');
    expect(parsed.relationships[0].to).toBe('ParkingStrategy');
    expect(parsed.relationships[0].type).toBe('uses');

    expect(parsed.rationaleText).toContain('strategy pattern');
  });

  it('handles empty submission gracefully without throwing', () => {
    const parsed = parser.parse('');
    expect(parsed.parsedSuccessfully).toBe(false);
    expect(parsed.designBlocks).toEqual([]);
    expect(parsed.parseErrors.length).toBeGreaterThan(0);
  });

  it('detects missing classes and warns about short rationale', () => {
    const parsed = parser.parse('Just some notes without any code or classes');
    expect(parsed.parsedSuccessfully).toBe(false);
    expect(parsed.parseErrors.some((e) => e.includes('No class, interface, or enum'))).toBe(true);
  });
});
