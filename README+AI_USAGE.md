# ArchJudge — Low-Level Design (LLD) Practice Platform
# & AI Usage Decision Audit Log

[![Tests](https://img.shields.io/badge/tests-8%20passed-brightgreen.svg)]() [![Architecture](https://img.shields.io/badge/architecture-hybrid%20monolith-blue.svg)]() [![Patterns](https://img.shields.io/badge/patterns-Strategy%20%7C%20Template%20%7C%20Repository-purple.svg)]()

> **Combined Deliverable File**: Contains full project **README** (architecture, run instructions, design highlights) and **AI_USAGE.md** (audit log of AI proposals, critiques, and architectural decisions).

---

# Part 1: Project README

ArchJudge is a production-grade Low-Level Design practice platform that evaluates object-oriented system design submissions using a **hybrid evaluation architecture**: deterministic structural analysis combined with qualitative LLM architectural reasoning.

## 🏗️ Repository Architecture & File Structure

The project is structured according to strict Clean Architecture and Object-Oriented principles with dedicated `client` and `server` directories:

```
LLD/
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
│   │   │   ├── ConfirmModal.jsx           # In-app confirmation dialog
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

---
---

# Part 2: AI_USAGE.md — Architectural Decision Log

This document records key decisions made during the design and implementation of the ArchJudge platform, specifically highlighting where AI suggestions were evaluated, accepted, modified, or rejected.

---

### Decision 1: Submission Format (Code Sandbox vs. Structured Text)
- **AI Proposal**: Implement a Docker-based code execution sandbox where learners write runnable TypeScript or Java code with automated Jest test suites.
- **Evaluation**:
  - *Risk*: A Docker sandbox tests whether the learner's syntax compiles and whether basic algorithms work. It completely misses architectural trade-offs, encourages giant monolithic classes that pass unit tests, and adds huge deployment / security overhead.
- **Decision**: **REJECTED**. Chose structured Markdown text (`## Design`, `## Relationships`, `## Rationale`). This captures the real essence of whiteboard LLD interviews without execution baggage.

---

### Decision 2: Evaluator Extensibility Seam (Strategy vs. Single Class)
- **AI Proposal**: Write a single `EvaluationService` class that performs both regex checks and LLM calls in one long method.
- **Evaluation**:
  - *Risk*: Violates the Single Responsibility Principle and Open/Closed Principle. Adding a new evaluation style (e.g. static linter, test runner, diagram validator) would require modifying the core service.
- **Decision**: **ACCEPTED REFACTOR**. Implemented the **Strategy Pattern** with an explicit `IEvaluator` interface, separating `DeterministicEvaluator`, `LLMEvaluator`, and orchestrating them via `CompositeEvaluator` (Template Method Pattern).

---

### Decision 3: Handling LLM Failures & Latency
- **AI Proposal**: Keep the frontend HTTP request open and block the UI with a spinner while waiting for the LLM to reply; if the LLM fails, display a generic 500 error toast and prompt the user to re-submit.
- **Evaluation**:
  - *Risk*: LLM APIs regularly experience 5–15 second latency spikes or rate-limiting. Blocking the browser thread degrades UX, and failing the whole submission loses the candidate's work and provides zero feedback.
- **Decision**: **ACCEPTED REFACTOR & HARDENING**.
  1. Made submission strictly asynchronous: status moves `Submitted -> Evaluating -> Evaluated`.
  2. Implemented exponential backoff retry.
  3. If retries expire, return a **Partial Evaluation** (`isPartial: true`) displaying deterministic structural feedback immediately, with a clear banner explaining that semantic feedback was delayed.

---

### Decision 4: Live Editor Feedback Mechanism
- **AI Proposal**: Require learners to click a separate "Validate Syntax" button before they are allowed to submit.
- **Evaluation**:
  - *Critique*: Adds unnecessary friction. Learners should immediately see whether their class blocks and relationships are being detected while they write.
- **Decision**: **MODIFIED & ACCEPTED**. Implemented a live, debounced `/api/parse/preview` inspector bar at the bottom of the workspace that updates in real time, displaying counts of detected classes, interfaces, relationships, and rationale quality as the learner types.

---

### Decision 5: Client-Server Modular Decoupling & Modern Tailwind CSS UI
- **AI Proposal**: Keep all client components inside a monolithic `src/client` subfolder relying on ad-hoc CSS rules and native browser dialogs (`window.confirm()`, `window.alert()`).
- **Evaluation**:
  - *Critique*: A monolithic source structure obscures the client/server boundary, and native browser alert/confirm dialogs look unpolished and disrupt modern SPA interaction.
- **Decision**: **ACCEPTED & REFACTORED**. 
  1. Extracted dedicated, decoupled `client/` and `server/` top-level packages orchestrated by root workspaces.
  2. Migrated the design system to **Tailwind CSS** with glassmorphism, responsive grid layouts, custom typography (Outfit, Inter, JetBrains Mono), and dark-mode color tokens.
  3. Replaced native browser `confirm()` and `alert()` popups with custom, accessible [ConfirmModal.jsx](file:///c:/Users/asus/OneDrive/Desktop/HIMANSHU/Project/LLD/client/src/components/ConfirmModal.jsx) and non-blocking floating error toast notifications.
