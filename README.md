# ArchJudge — Low-Level Design (LLD) Practice Platform

[![Tests](https://img.shields.io/badge/tests-8%20passed-brightgreen.svg)]() [![Architecture](https://img.shields.io/badge/architecture-hybrid%20monolith-blue.svg)]() [![Patterns](https://img.shields.io/badge/patterns-Strategy%20%7C%20Template%20%7C%20Repository-purple.svg)]()

ArchJudge is a production-grade Low-Level Design practice platform that evaluates object-oriented system design submissions using a **hybrid evaluation architecture**: deterministic structural analysis combined with qualitative LLM architectural reasoning.

---

## 🏗️ Repository Architecture & File Structure

The project is structured according to strict Clean Architecture and Object-Oriented principles:

```
├── docs/                                  # Graded project deliverables
│   ├── RESEARCH_NOTE.md                   # Pedagogical & market analysis (15% weight)
│   ├── DESIGN_NOTE.md                     # Domain model, architecture, trade-offs (25% weight)
│   └── AI_USAGE.md                        # AI decision audit log (5% weight)
│
├── src/
│   ├── domain/                            # Core Domain Layer (Pure TypeScript, Zero Frameworks)
│   │   ├── models/
│   │   │   ├── problem.model.ts           # Problem entity & extensibility hooks
│   │   │   ├── submission.model.ts        # DesignBlock, Relationship, Submission value objects
│   │   │   ├── attempt.model.ts           # Attempt lifecycle & delta calculation
│   │   │   └── evaluation.model.ts        # CriterionScore, EvaluationResult
│   │   ├── repositories/                  # Repository Pattern Interfaces
│   │   │   ├── problem.repository.interface.ts
│   │   │   ├── attempt.repository.interface.ts
│   │   │   └── evaluation.repository.interface.ts
│   │   └── services/
│   │       ├── submission-parser.service.ts # Resilient Markdown & code block parser
│   │       └── rubric.service.ts          # 5 weighted evaluation dimensions
│   │
│   ├── evaluators/                        # Strategy Pattern Implementation
│   │   ├── evaluator.interface.ts         # IEvaluator contract
│   │   ├── deterministic.evaluator.ts     # Structural checks (God class, SRP, associations)
│   │   ├── llm.evaluator.ts               # Semantic reasoning & extensibility evaluation
│   │   └── composite.evaluator.ts         # Template Method: coordinates multi-stage evaluation
│   │
│   ├── prompts/
│   │   └── llm-evaluator.prompt.ts        # Reviewable LLM prompt with strict JSON schema
│   │
│   ├── data/                              # Data Persistence Layer
│   │   ├── seed-problems.ts               # 3 Seed Problems (Parking Lot, Elevator, Vending)
│   │   ├── in-memory-problem.repository.ts
│   │   ├── in-memory-attempt.repository.ts
│   │   └── in-memory-evaluation.repository.ts
│   │
│   ├── queue/                             # Asynchronous Job Execution
│   │   └── evaluation-queue.ts            # Non-blocking async queue with retry & fallback
│   │
│   ├── server/                            # Backend API (Express)
│   │   ├── controllers/
│   │   │   ├── problem.controller.ts
│   │   │   └── attempt.controller.ts
│   │   ├── app.ts                         # Express setup with Dependency Injection
│   │   └── server.ts                      # Server entry point
│   │
│   └── client/                            # Modern Frontend (React + Vite + Vanilla CSS)
│       ├── index.html                     # Outfit & JetBrains Mono typography
│       ├── App.css                        # Glassmorphic dark design system
│       ├── App.tsx                        # Root orchestrator
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── ProblemList.tsx            # Problem directory & difficulty badges
│       │   ├── ProblemDetail.tsx          # Requirements, constraints, extensibility prompt
│       │   ├── SubmissionForm.tsx         # Monospace editor with live parse inspector
│       │   ├── FeedbackView.tsx           # Criterion score cards, evidence badges, ring score
│       │   ├── AttemptHistory.tsx         # Score progression timeline
│       │   ├── AttemptDeltaModal.tsx      # Side-by-side iteration delta comparison
│       │   └── DocsView.tsx               # In-app architecture and research viewer
│       └── services/
│           └── api.service.ts             # Typed client API interface
│
├── tests/                                 # Automated Test Suite (Vitest)
│   ├── submission-parser.test.ts          # Block, member, relationship, & empty input parsing
│   ├── deterministic.evaluator.test.ts    # God-class penalties & modularity rewards
│   ├── composite.evaluator.test.ts        # Multi-stage evaluation & partial timeout fallback
│   └── evaluation-queue.test.ts           # Async state lifecycle: Submitted -> Evaluating -> Evaluated
│
├── package.json
├── tsconfig.json
├── tsconfig.server.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended; verified on Node v26)
- **npm** (v9 or higher)

### 2. Installation
```bash
npm install
```

### 3. Run Development Mode
Starts both the Express API (port 5000) and the Vite frontend (port 3000) concurrently:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Tests
Runs all unit and integration tests across domain logic, evaluators, and async queue:
```bash
npm test
```

### 5. Build and Run Production Monolith
```bash
npm run build
npm start
```
Runs the unified single-process monolith on [http://localhost:5000](http://localhost:5000).

---

## 🎯 Key Design Highlights

1. **Meta-Demonstration of LLD**:
   - The platform teaching LLD itself implements classic Gang of Four patterns:
     - **Strategy Pattern** on `IEvaluator`
     - **Template Method Pattern** on `CompositeEvaluator`
     - **Repository Pattern** on `Problem`, `Attempt`, and `Evaluation`
2. **Deterministic + Qualitative Hybrid**:
   - Deterministic checks run immediately, costing $0 and providing grounded structural evidence (detects bloated God classes $\ge 6$ methods/fields, missing relationships, empty submissions).
   - Semantic checks judge trade-offs and specifically verify the problem's **Extensibility Hook** (e.g. adding EV charging spots or VIP elevator modes).
3. **Graceful Degradation on Latency / Failures**:
   - If the LLM provider fails or times out, the `CompositeEvaluator` retries with backoff and automatically falls back to a **Partial Result** (`isPartial = true`), surfacing the deterministic structural assessment immediately.
4. **Iterative Learning Loop (Attempt Delta)**:
   - When a learner clicks "Try Again (Iterate)", the new attempt links to `previousAttemptId`.
   - The platform calculates an **Attempt Delta Modal** showing net score change (+15%), introduced classes, consolidated classes, and criterion-by-criterion score diffs.
