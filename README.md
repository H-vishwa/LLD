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
│   ├── domain/                            # Core Domain Layer (Pure Modern JavaScript, Zero Frameworks)
│   │   ├── models/
│   │   │   ├── problem.model.js           # Problem entity & extensibility hooks
│   │   │   ├── submission.model.js        # DesignBlock, Relationship, Submission value objects
│   │   │   ├── attempt.model.js           # Attempt lifecycle & delta calculation
│   │   │   └── evaluation.model.js        # CriterionScore, EvaluationResult
│   │   ├── repositories/                  # Repository Pattern Base Classes
│   │   │   ├── problem.repository.interface.js
│   │   │   ├── attempt.repository.interface.js
│   │   │   └── evaluation.repository.interface.js
│   │   └── services/
│   │       ├── submission-parser.service.js # Resilient Markdown & code block parser
│   │       └── rubric.service.js          # 5 weighted evaluation dimensions
│   │
│   ├── evaluators/                        # Strategy Pattern Implementation
│   │   ├── evaluator.interface.js         # IEvaluator base contract
│   │   ├── deterministic.evaluator.js     # Structural checks (God class, SRP, associations)
│   │   ├── llm.evaluator.js               # Semantic reasoning & extensibility evaluation
│   │   └── composite.evaluator.js         # Template Method: coordinates multi-stage evaluation
│   │
│   ├── prompts/
│   │   └── llm-evaluator.prompt.js        # Reviewable LLM prompt with strict JSON schema
│   │
│   ├── data/                              # Data Persistence Layer
│   │   ├── seed-problems.js               # 3 Seed Problems (Parking Lot, Elevator, Vending)
│   │   ├── in-memory-problem.repository.js
│   │   ├── in-memory-attempt.repository.js
│   │   └── in-memory-evaluation.repository.js
│   │
│   ├── queue/                             # Asynchronous Job Execution
│   │   └── evaluation-queue.js            # Non-blocking async queue with retry & fallback
│   │
│   ├── server/                            # Backend API (Express)
│   │   ├── controllers/
│   │   │   ├── problem.controller.js
│   │   │   └── attempt.controller.js
│   │   ├── app.js                         # Express setup with Dependency Injection
│   │   └── server.js                      # Server entry point
│   │
│   └── client/                            # Modern Frontend (React + Vite + Vanilla CSS)
│       ├── index.html                     # Outfit & JetBrains Mono typography
│       ├── App.css                        # Glassmorphic dark design system
│       ├── App.jsx                        # Root orchestrator
│       ├── main.jsx                       # React mounting entrypoint
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProblemList.jsx            # Problem directory & difficulty badges
│       │   ├── ProblemDetail.jsx          # Requirements, constraints, extensibility prompt
│       │   ├── SubmissionForm.jsx         # Monospace editor with live parse inspector
│       │   ├── FeedbackView.jsx           # Criterion score cards, evidence badges, ring score
│       │   ├── AttemptHistory.jsx         # Score progression timeline
│       │   ├── AttemptDeltaModal.jsx      # Side-by-side iteration delta comparison
│       │   └── DocsView.jsx               # In-app architecture and research viewer
│       └── services/
│           └── api.service.js             # Client API interface
│
├── tests/                                 # Automated Test Suite (Vitest)
│   ├── submission-parser.test.js          # Block, member, relationship, & empty input parsing
│   ├── deterministic.evaluator.test.js    # God-class penalties & modularity rewards
│   ├── composite.evaluator.test.js        # Multi-stage evaluation & partial timeout fallback
│   └── evaluation-queue.test.js           # Async state lifecycle: Submitted -> Evaluating -> Evaluated
│
├── package.json
├── vite.config.js
└── vitest.config.js
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
