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
├── server/                                # Dedicated Backend (Node.js + Express)
│   ├── src/
│   │   ├── domain/                        # Core Domain Layer (Models, Repositories, Services)
│   │   │   ├── models/                    # Problem, Submission, Attempt, Evaluation entities
│   │   │   ├── repositories/              # Repository interfaces
│   │   │   └── services/                  # SubmissionParser & Rubric services
│   │   ├── evaluators/                    # Strategy pattern evaluators (Deterministic, LLM, Composite)
│   │   ├── prompts/                       # LLM prompt schemas
│   │   ├── data/                          # In-memory repositories & seed problems
│   │   ├── queue/                         # Async non-blocking evaluation queue
│   │   ├── controllers/                   # Problem & Attempt controllers
│   │   ├── app.js                         # Express factory & IoC container
│   │   └── server.js                      # Server listener entry point
│   ├── tests/                             # Server Vitest test suite
│   ├── package.json                       # Server package specification
│   └── vitest.config.js                   # Server test configuration
│
├── client/                                # Dedicated Frontend (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/                    # Modern Tailwind CSS components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProblemList.jsx            # Challenges directory & difficulty badges
│   │   │   ├── ProblemDetail.jsx          # Requirements & Extensibility hook
│   │   │   ├── SubmissionForm.jsx         # Code editor & structural inspector
│   │   │   ├── FeedbackView.jsx           # Score breakdown & qualitative analysis
│   │   │   ├── AttemptHistory.jsx         # Attempt progression cards
│   │   │   ├── AttemptDeltaModal.jsx      # Side-by-side retry delta modal
│   │   │   └── DocsView.jsx               # In-app architecture & research docs
│   │   ├── services/                      # Axios/Fetch API client
│   │   ├── data/                          # Interactive worked examples
│   │   ├── App.jsx                        # Root React component
│   │   ├── index.css                      # Tailwind CSS design system & utilities
│   │   └── main.jsx                       # React DOM mounting
│   ├── index.html                         # Entry HTML with Outfit & Inter typography
│   ├── tailwind.config.js                 # Tailwind CSS configuration
│   ├── postcss.config.js                  # PostCSS configuration
│   ├── vite.config.js                     # Vite build and proxy configuration
│   └── package.json                       # Client package specification
│
└── package.json                           # Root workspace orchestrator
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
