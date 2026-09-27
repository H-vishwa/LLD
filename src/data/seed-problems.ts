import { Problem } from '../domain/models/problem.model.js';

export const SEED_PROBLEMS: Problem[] = [
  {
    id: 'parking-lot',
    title: 'Multi-Floor Smart Parking Lot',
    shortDescription: 'Design an automated multi-floor parking lot supporting multiple vehicle types, dynamic fee strategies, and spot allocation policies.',
    difficulty: 'Medium',
    tags: ['Strategy Pattern', 'State Pattern', 'Inheritance vs Composition', 'Concurrency Ready'],
    requirementsMarkdown: `### Overview
Design an object-oriented system for an automated multi-floor parking lot.

### Core Requirements
1. **Multiple Vehicle Types**: The lot supports Motorcycles, Cars, and Electric Buses. Each has different spot size requirements (MotorcycleSpot, CompactSpot, LargeSpot).
2. **Floor & Spot Management**: The parking lot contains multiple floors, and each floor has designated spot types.
3. **Dynamic Spot Allocation**: The system should support pluggable spot assignment algorithms:
   - Nearest to entrance
   - Best-fit (smallest viable spot for vehicle)
4. **Ticketing & Fee Calculation**:
   - Issue a ticket upon entry with timestamp and assigned spot.
   - Calculate fee upon exit using pluggable strategies (e.g. Flat rate, Hourly rate, Peak-hour surge rate).
5. **Payment Processing**: Process payment via Card or Cash before freeing the spot.`,
    constraints: [
      'Must avoid god-object ParkingManager by delegating responsibilities.',
      'Must use Strategy or Factory patterns for allocation and pricing.',
      'Must model explicit state for spots (Empty, Occupied, OutOfService).',
      'Extensibility: Adding a new vehicle type (e.g. Electric Sedan requiring a charging spot) should not modify core ticket/lot classes (OCP).'
    ],
    extensibilityPrompt: 'What if we introduce Electric Vehicle (EV) charging spots that bill both parking time and kilowatt-hours consumed?',
    starterTemplate: `## Design

\`\`\`typescript
enum SpotType {
  MOTORCYCLE,
  COMPACT,
  LARGE
}

enum SpotStatus {
  AVAILABLE,
  OCCUPIED,
  MAINTENANCE
}

abstract class Vehicle {
  protected licenseNumber: string;
  protected spotTypeNeeded: SpotType;
}

class Car extends Vehicle {}
class Motorcycle extends Vehicle {}
class Bus extends Vehicle {}

class ParkingSpot {
  private id: string;
  private floorId: string;
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

class ParkingTicket {
  private ticketId: string;
  private entryTime: Date;
  private spotId: string;
  private vehicleNumber: string;
}

class ParkingLot {
  private floors: ParkingFloor[];
  private parkingStrategy: ParkingStrategy;
  private pricingStrategy: PricingStrategy;
  
  public issueTicket(vehicle: Vehicle): ParkingTicket {}
  public processExit(ticket: ParkingTicket): number {}
}
\`\`\`

## Relationships
Vehicle -> SpotType : uses
Car -> Vehicle : extends
Motorcycle -> Vehicle : extends
Bus -> Vehicle : extends
ParkingSpot -> SpotStatus : uses
ParkingSpot -> Vehicle : composes
ParkingLot -> ParkingStrategy : uses
ParkingLot -> PricingStrategy : uses
ParkingLot -> ParkingTicket : uses

## Rationale
I separated the parking spot allocation strategy and pricing calculation using the Strategy Pattern to satisfy the Open/Closed Principle. If new surge pricing or EV metering is introduced, we simply implement new Strategy interfaces without touching the core ParkingLot orchestrator.
`
  },
  {
    id: 'elevator-system',
    title: 'Smart Multi-Car Elevator Controller',
    shortDescription: 'Design a high-rise building elevator controller managing multiple elevators, direction dispatching, and emergency states.',
    difficulty: 'Hard',
    tags: ['State Pattern', 'Observer Pattern', 'Scheduling Algorithms', 'Safety & Interlocks'],
    requirementsMarkdown: `### Overview
Design a software control system for a high-rise building with N elevator cars serving M floors.

### Core Requirements
1. **Elevator Car State**: Each car can be MOVING_UP, MOVING_DOWN, IDLE, or EMERGENCY_STOP. Cars have maximum weight capacity and current floor tracking.
2. **Floor Requests vs Internal Requests**:
   - Internal car panel: passenger selects destination floor.
   - External floor hall buttons: passenger requests UP or DOWN.
3. **Dispatching Algorithm**: Pluggable scheduling algorithm (e.g. SCAN/LOOK algorithm, Nearest Idle Car, or Energy-Saver mode) to route elevators to calls.
4. **Door & Safety Subsystem**: Automatic door opening/closing with safety sensor obstacle detection and overload alarm.`,
    constraints: [
      'Elevator state transitions must adhere to the State pattern to avoid nested switch statements.',
      'Elevator controller must coordinate dispatching without tightly coupling individual car hardware.',
      'Must handle request queues cleanly and avoid starvation.',
      'Extensibility: Adding VIP/Express elevator mode where specific cars skip floors 2-20 during rush hour.'
    ],
    extensibilityPrompt: 'What if during peak morning hours, two elevators are reserved for express express shuttling directly to top penthouses without stopping at intermediate floors?',
    starterTemplate: `## Design

\`\`\`typescript
enum Direction {
  UP,
  DOWN,
  IDLE
}

enum DoorState {
  OPEN,
  CLOSING,
  CLOSED,
  OBSTRUCTED
}

interface ElevatorState {
  handleFloorArrival(elevator: ElevatorCar, floor: number): void;
  requestStop(elevator: ElevatorCar, floor: number): void;
}

class ElevatorCar {
  private id: string;
  private currentFloor: number;
  private direction: Direction;
  private doorState: DoorState;
  private state: ElevatorState;
  private currentWeight: number;
  private maxWeightCapacity: number;
  
  public moveTo(floor: number): void {}
  public openDoor(): void {}
  public closeDoor(): void {}
}

interface DispatchStrategy {
  selectElevator(elevators: ElevatorCar[], requestFloor: number, direction: Direction): ElevatorCar;
}

class ElevatorController {
  private elevators: ElevatorCar[];
  private strategy: DispatchStrategy;
  
  public handleHallCall(floor: number, direction: Direction): void {}
  public handleCarCall(carId: string, destinationFloor: number): void {}
}
\`\`\`

## Relationships
ElevatorCar -> ElevatorState : uses
ElevatorCar -> Direction : uses
ElevatorCar -> DoorState : uses
ElevatorController -> ElevatorCar : composes
ElevatorController -> DispatchStrategy : uses

## Rationale
Using the State Pattern for ElevatorCar isolates complex motion and door transition logic from dispatching. The ElevatorController abstracts user calls and applies a pluggable DispatchStrategy, allowing easy changes between SCAN algorithm and nearest-neighbor dispatching.
`
  },
  {
    id: 'vending-machine',
    title: 'Stateful Snack & Beverage Vending Machine',
    shortDescription: 'Design an automated vending machine handling inventory slots, cash/card payment states, change return, and cancellation.',
    difficulty: 'Easy',
    tags: ['State Pattern', 'Inventory Management', 'Change Dispensing', 'Transactions'],
    requirementsMarkdown: `### Overview
Design the controller software for an unattended vending machine offering multiple snack and drink selections.

### Core Requirements
1. **Inventory Management**: Grid slots (e.g. A1, B2) with Item, unit price, and current quantity count.
2. **State Machine Flow**:
   - Idle / Ready: waiting for money or item selection
   - HasMoney / Selecting: balance inserted, choosing item
   - Dispensing: validating balance >= price, dispensing item, updating stock
   - DispenseComplete / ReturningChange: calculating and returning optimal coin/note change
3. **Payment Methods**: Accepts Coins, Notes, or Digital NFC/Card tap.
4. **Cancellation / Refund**: Learner can hit cancel at any time before dispensing to get complete refund.`,
    constraints: [
      'Must implement strict State pattern for Idle, HasMoney, Dispensing, and SoldOut states.',
      'Item inventory must be encapsulated in an Inventory / Rack class rather than loose lists.',
      'Must guarantee transactional integrity: do not deduct balance or item count until dispensing succeeds.',
      'Extensibility: Adding support for dynamic discount coupon codes or promotional bundle pricing (e.g. buy soda get chips 50% off).'
    ],
    extensibilityPrompt: 'What if we add promotional combo pricing (e.g. buying snack A + drink B gives a 20% discount on total)?',
    starterTemplate: `## Design

\`\`\`typescript
interface VendingMachineState {
  insertMoney(machine: VendingMachine, amount: number): void;
  selectItem(machine: VendingMachine, code: string): void;
  dispense(machine: VendingMachine): void;
  cancel(machine: VendingMachine): void;
}

class IdleState implements VendingMachineState {}
class HasMoneyState implements VendingMachineState {}
class DispensingState implements VendingMachineState {}

class Item {
  private id: string;
  private name: string;
  private price: number;
}

class Inventory {
  private slots: Map<string, { item: Item; quantity: number }>;
  
  public getItem(code: string): Item | null {}
  public deductStock(code: string): boolean {}
  public isAvailable(code: string): boolean {}
}

class VendingMachine {
  private state: VendingMachineState;
  private inventory: Inventory;
  private currentBalance: number;
  private selectedItemCode?: string;
  
  public setState(state: VendingMachineState): void {}
  public insertCash(amount: number): void {}
  public selectProduct(code: string): void {}
  public refund(): number {}
}
\`\`\`

## Relationships
VendingMachine -> VendingMachineState : uses
IdleState -> VendingMachineState : implements
HasMoneyState -> VendingMachineState : implements
DispensingState -> VendingMachineState : implements
VendingMachine -> Inventory : composes
Inventory -> Item : aggregates

## Rationale
The State Pattern prevents rigid nested conditional logic across payment, selection, and dispensing. Items and inventory are cleanly separated from state handling, ensuring inventory consistency during cancellation or failure.
`
  }
];
