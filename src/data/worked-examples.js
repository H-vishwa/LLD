/**
 * Worked examples for each problem:
 * 1. Strong Example: Demonstrates OOP patterns, loose coupling, and OCP extensibility hook.
 * 2. Anti-Pattern / Weak Example: Demonstrates monolithic god objects, excessive responsibilities, and hardcoded policies.
 */

export const WORKED_EXAMPLES = {
  'parking-lot': {
    strong: `## Design

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
    antiPattern: `## Design

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
`
  },
  'elevator-system': {
    strong: `## Design

\`\`\`typescript
enum Direction { UP, DOWN, IDLE }
enum DoorState { OPEN, CLOSING, CLOSED, OBSTRUCTED }

interface ElevatorState {
  handleFloorArrival(elevator: ElevatorCar, floor: number): void;
  requestStop(elevator: ElevatorCar, floor: number): void;
}

class IdleState implements ElevatorState {}
class MovingState implements ElevatorState {}
class EmergencyStopState implements ElevatorState {}

class ElevatorCar {
  private id: string;
  private currentFloor: number;
  private direction: Direction;
  private doorState: DoorState;
  private state: ElevatorState;
  private maxWeightCapacity: number;
  public moveTo(floor: number): void {}
  public openDoor(): void {}
  public closeDoor(): void {}
}

interface DispatchStrategy {
  selectElevator(elevators: ElevatorCar[], floor: number, direction: Direction): ElevatorCar;
}

class LookDispatchStrategy implements DispatchStrategy {}
class ExpressVIPDispatchStrategy implements DispatchStrategy {}

class ElevatorController {
  private elevators: ElevatorCar[];
  private strategy: DispatchStrategy;
  public handleHallCall(floor: number, direction: Direction): void {}
  public handleCarCall(carId: string, floor: number): void {}
}
\`\`\`

## Relationships
ElevatorCar -> ElevatorState : uses
IdleState -> ElevatorState : implements
MovingState -> ElevatorState : implements
EmergencyStopState -> ElevatorState : implements
ElevatorController -> ElevatorCar : composes
ElevatorController -> DispatchStrategy : uses
LookDispatchStrategy -> DispatchStrategy : implements
ExpressVIPDispatchStrategy -> DispatchStrategy : implements

## Rationale
1. Applied the State Pattern for ElevatorCar to encapsulate transition rules and safety interlocks without nested conditionals.
2. Isolated car dispatching using the Strategy Pattern with LookDispatchStrategy.
3. Extensibility hook: Added ExpressVIPDispatchStrategy to support express shuttling directly to penthouses during rush hours without altering the controller orchestrator (OCP).
`,
    antiPattern: `## Design

\`\`\`typescript
class MegaElevator {
  private car1Floor: number;
  private car2Floor: number;
  private car1Direction: string;
  private car2Direction: string;
  private car1DoorsOpen: boolean;
  private car2DoorsOpen: boolean;
  private hallButtonsPressed: any[];
  private carButtonsPressed: any[];

  public moveAllElevators() {}
  public dispatchAlgorithm() {}
  public ringOverloadBell() {}
  public openCar1Doors() {}
  public openCar2Doors() {}
  public cancelAlarm() {}
  public serviceMaintenance() {}
}
\`\`\`

## Relationships
MegaElevator -> MegaElevator : uses

## Rationale
Kept all elevators and buttons inside a single MegaElevator class to avoid having too many files and classes.
`
  },
  'vending-machine': {
    strong: `## Design

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
class SoldOutState implements VendingMachineState {}

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

interface PricingPolicy {
  calculateTotal(items: Item[]): number;
}

class ComboDiscountPricingPolicy implements PricingPolicy {
  calculateTotal(items: Item[]): number {}
}

class VendingMachine {
  private state: VendingMachineState;
  private inventory: Inventory;
  private pricingPolicy: PricingPolicy;
  private balance: number;
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
SoldOutState -> VendingMachineState : implements
VendingMachine -> Inventory : composes
Inventory -> Item : aggregates
VendingMachine -> PricingPolicy : uses
ComboDiscountPricingPolicy -> PricingPolicy : implements

## Rationale
1. Implemented the State Pattern for transaction flows (Idle, HasMoney, Dispensing, SoldOut) to prevent invalid state operations and refund issues.
2. Encapsulated inventory tracking separately from transaction state.
3. Extensibility hook: Introduced PricingPolicy and ComboDiscountPricingPolicy to handle combo discounts cleanly without modifying state transition handlers (OCP).
`,
    antiPattern: `## Design

\`\`\`typescript
class VendingBox {
  private coins: number;
  private item1Name: string;
  private item1Price: number;
  private item1Count: number;
  private item2Name: string;
  private item2Price: number;
  private item2Count: number;

  public putMoney(val: number) {}
  public pressButton1() {}
  public pressButton2() {}
  public dropItem() {}
  public giveChange() {}
  public countRevenue() {}
}
\`\`\`

## Relationships
VendingBox -> VendingBox : uses

## Rationale
I stored items directly as fields on VendingBox because the machine only has a couple items.
`
  }
};
