/**
 * Pre-seeded attempts for the demonstration prototype.
 * Provides the hiring team with out-of-the-box historical progression and delta comparisons.
 */

export const PRESEEDED_ATTEMPTS = [
  {
    id: 'att-demo-001',
    problemId: 'parking-lot',
    learnerId: 'default-learner',
    status: 'Evaluated',
    rawContent: `## Design

\`\`\`typescript
class Vehicle {
  public licenseNumber: string;
  public vehicleType: string;
}

class MonolithicParkingManager {
  private spots: any[];
  private tickets: any[];
  private revenue: number;
  private pricingMode: string;
  private attendants: string[];
  private gates: any[];
  private sensors: any[];
  
  public assignSpot(vehicle: Vehicle) {}
  public calculateFee(duration: number) {}
  public printTicket() {}
  public openGate() {}
  public checkSensors() {}
  public auditFinances() {}
  public alertSecurity() {}
  public triggerFireAlarm() {}
}
\`\`\`

## Relationships
MonolithicParkingManager -> Vehicle : uses

## Rationale
I built a single centralized manager to control parking spot allocation, ticketing, and billing in one place for simplicity.
`,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    evaluatedAt: new Date(Date.now() - 3600000 * 2 + 5000).toISOString(),
    resultId: 'eval-demo-001',
  },
  {
    id: 'att-demo-002',
    problemId: 'parking-lot',
    learnerId: 'default-learner',
    status: 'Evaluated',
    previousAttemptId: 'att-demo-001',
    rawContent: `## Design

\`\`\`typescript
enum SpotType { MOTORCYCLE, COMPACT, LARGE }
enum SpotStatus { AVAILABLE, OCCUPIED, MAINTENANCE }

abstract class Vehicle {
  protected licenseNumber: string;
  protected spotTypeNeeded: SpotType;
}

class Car extends Vehicle {}
class Motorcycle extends Vehicle {}
class ElectricBus extends Vehicle {}

class ParkingSpot {
  private id: string;
  private spotType: SpotType;
  private status: SpotStatus;
  private currentVehicle?: Vehicle;
  public assignVehicle(vehicle: Vehicle): boolean {}
  public removeVehicle(): void {}
}

interface ParkingStrategy {
  findSpot(spots: ParkingSpot[], vehicle: Vehicle): ParkingSpot | null;
}

interface PricingStrategy {
  calculateFee(durationHours: number, vehicleType: SpotType): number;
}

class EVSurchargePricingStrategy implements PricingStrategy {
  calculateFee(durationHours: number, vehicleType: SpotType): number {}
}

class ParkingTicket {
  private ticketId: string;
  private entryTime: Date;
  private spotId: string;
}

class ParkingLot {
  private spots: ParkingSpot[];
  private parkingStrategy: ParkingStrategy;
  private pricingStrategy: PricingStrategy;
  public issueTicket(vehicle: Vehicle): ParkingTicket {}
  public processExit(ticket: ParkingTicket): number {}
}
\`\`\`

## Relationships
Car -> Vehicle : extends
Motorcycle -> Vehicle : extends
ElectricBus -> Vehicle : extends
ParkingSpot -> Vehicle : composes
ParkingSpot -> SpotStatus : uses
ParkingLot -> ParkingSpot : composes
ParkingLot -> ParkingStrategy : uses
ParkingLot -> PricingStrategy : uses
ParkingLot -> ParkingTicket : uses
EVSurchargePricingStrategy -> PricingStrategy : implements

## Rationale
Decomposed the monolithic manager into distinct single-responsibility entities following SOLID principles:
1. ParkingSpot encapsulates state transitions (State pattern).
2. Spot allocation and pricing use the Strategy Pattern to decouple volatile billing rules from the core lot.
3. Extensibility hook: Added EVSurchargePricingStrategy which satisfies the Open/Closed Principle without touching core ticket or lot orchestration.
`,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    submittedAt: new Date(Date.now() - 1800000).toISOString(),
    evaluatedAt: new Date(Date.now() - 1800000 + 4000).toISOString(),
    resultId: 'eval-demo-002',
  }
];

export const PRESEEDED_EVALUATIONS = [
  {
    id: 'eval-demo-001',
    attemptId: 'att-demo-001',
    overallScore: 42,
    overallSummary: 'Deterministic Assessment (Needs Work - 42%): Classes exhibit high coupling. Identified bloated God class with monolithic responsibilities.',
    criteria: [
      {
        criterionId: 'srp_separation',
        criterionName: 'Single Responsibility & Modularity',
        category: 'Structural',
        score: 1.5,
        maxScore: 5,
        explanation: 'Identified 1 potentially bloated class with high method/field counts.',
        evidenceRefs: ['MonolithicParkingManager'],
        strengths: [],
        improvements: ['High coupling detected in [MonolithicParkingManager]. Decompose into smaller domain delegates or strategies.'],
      },
      {
        criterionId: 'appropriate_abstraction',
        criterionName: 'Abstraction & Design Patterns',
        category: 'Structural',
        score: 1.5,
        maxScore: 5,
        explanation: 'System relies purely on concrete classes without inversion of control.',
        evidenceRefs: ['MonolithicParkingManager'],
        strengths: [],
        improvements: ['No interfaces or abstract classes detected. Define abstractions for pluggable algorithms or policies.'],
      },
      {
        criterionId: 'relationship_integrity',
        criterionName: 'Relationship & Coupling Correctness',
        category: 'Structural',
        score: 2.0,
        maxScore: 5,
        explanation: 'Sparse association network. Only 1 relationship defined.',
        evidenceRefs: ['MonolithicParkingManager -> Vehicle'],
        strengths: [],
        improvements: ['Explicitly declare relationships (e.g. ClassA -> ClassB : uses | extends | composes).'],
      },
      {
        criterionId: 'extensibility_readiness',
        criterionName: 'Extensibility Readiness (OCP)',
        category: 'Extensibility',
        score: 2.0,
        maxScore: 5,
        explanation: 'Design violates Open/Closed Principle. Any new vehicle type or pricing requires modifying MonolithicParkingManager.',
        evidenceRefs: [],
        strengths: [],
        improvements: ['Introduce polymorphic interfaces to support future requirements without modifying core classes.'],
      },
      {
        criterionId: 'tradeoff_rationale',
        criterionName: 'Architectural Rationale & Trade-offs',
        category: 'Reasoning',
        score: 2.0,
        maxScore: 5,
        explanation: 'Minimal rationale provided without architectural trade-off justification.',
        evidenceRefs: ['Learner Rationale Statement'],
        strengths: [],
        improvements: ['Explain why specific responsibilities were segregated and discuss trade-offs.'],
      },
    ],
    isPartial: false,
    engineVersion: 'composite-hybrid-v1.0',
    generatedAt: new Date(Date.now() - 3600000 * 2 + 5000).toISOString(),
  },
  {
    id: 'eval-demo-002',
    attemptId: 'att-demo-002',
    overallScore: 92,
    overallSummary: 'Comprehensive Evaluation (92%): Exceptional architectural decomposition. Applied Strategy and State patterns to achieve high cohesion and Open/Closed extensibility.',
    criteria: [
      {
        criterionId: 'srp_separation',
        criterionName: 'Single Responsibility & Modularity',
        category: 'Structural',
        score: 4.8,
        maxScore: 5,
        explanation: 'High degree of modularity with clear separation of concerns.',
        evidenceRefs: ['ParkingSpot', 'ParkingLot', 'Vehicle'],
        strengths: [
          'Classes demonstrate concise, focused method and state boundaries without monolithic bloat.',
          'Modular decomposition observed in: ParkingSpot, ParkingLot, EVSurchargePricingStrategy.'
        ],
        improvements: [],
      },
      {
        criterionId: 'appropriate_abstraction',
        criterionName: 'Abstraction & Design Patterns',
        category: 'Structural',
        score: 5.0,
        maxScore: 5,
        explanation: 'Found 3 explicit contracts/abstract bases promoting loose coupling.',
        evidenceRefs: ['ParkingStrategy', 'PricingStrategy', 'Vehicle'],
        strengths: [
          'Good polymorphism: Introduced abstractions for variable algorithms.',
          'Elegantly applied Strategy pattern to isolate volatile pricing and allocation rules.'
        ],
        improvements: [],
      },
      {
        criterionId: 'relationship_integrity',
        criterionName: 'Relationship & Coupling Correctness',
        category: 'Structural',
        score: 4.8,
        maxScore: 5,
        explanation: 'Validated 10 consistent relationship links across defined associations.',
        evidenceRefs: ['ParkingLot -> ParkingStrategy', 'ParkingLot -> ParkingSpot', 'EVSurchargePricingStrategy -> PricingStrategy'],
        strengths: [
          'All relationships reference defined classes with valid association types.',
          'Balanced use of composition and inheritance (favoring composition over deep inheritance trees).'
        ],
        improvements: [],
      },
      {
        criterionId: 'extensibility_readiness',
        criterionName: 'Extensibility Readiness (OCP)',
        category: 'Extensibility',
        score: 4.8,
        maxScore: 5,
        explanation: 'Satisfies OCP for hook: "What if we introduce Electric Vehicle (EV) charging spots that bill both parking time and kilowatt-hours consumed?".',
        evidenceRefs: ['EVSurchargePricingStrategy', 'Open/Closed Principle conformance'],
        strengths: [
          'Directly addresses extensibility: satisfies OCP by allowing pluggable additions for EV billing.'
        ],
        improvements: [],
      },
      {
        criterionId: 'tradeoff_rationale',
        criterionName: 'Architectural Rationale & Trade-offs',
        category: 'Reasoning',
        score: 4.7,
        maxScore: 5,
        explanation: 'Deep articulation of architectural trade-offs and intentional design boundaries.',
        evidenceRefs: ['Learner Rationale Statement'],
        strengths: [
          'Thoughtful articulation of architectural trade-offs and intentional design boundaries.'
        ],
        improvements: [],
      },
    ],
    isPartial: false,
    engineVersion: 'composite-hybrid-v1.0',
    generatedAt: new Date(Date.now() - 1800000 + 4000).toISOString(),
  }
];
