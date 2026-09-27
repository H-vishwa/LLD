# AI Usage & Architectural Decision Log

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
