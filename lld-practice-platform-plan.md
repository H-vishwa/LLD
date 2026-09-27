# LLD Practice Platform — Build Plan (for Antigravity)

This is a build-ready plan for a 2-day take-home: a small platform where a learner
practices Low-Level Design (LLD) problems, submits a solution, and gets structured
feedback. Scope is intentionally tight — monolith, 3 problems, one submission format,
deterministic checks + one LLM pass for feedback.

---

## 1. MVP Scope (what we are building, and NOT building)

**Building:**
- 3 seeded LLD problems (Parking Lot, Elevator System, Vending Machine) with requirements text
- Attempt flow: choose problem → write a solution (Markdown + code blocks, single text area) → submit
- Async evaluation: deterministic structural checks (parsed from submitted code/pseudo-UML) + one LLM
  rubric pass for design reasoning
- Feedback screen: per-criterion score + explanation + suggested improvements
- Attempt history per learner per problem, with score trend
- Retry loop: new attempt references the previous one so learners can see delta

**Not building:** auth beyond a mock user id, multi-tenant orgs, real-time collaboration,
plagiarism detection, code execution/sandboxing of arbitrary languages, HLD/scale features.
A simple monolith (single service + single DB) is the target architecture.

---

## 2. Submission Format Decision

Learner submits **structured text**, not compiled/run code:
- A "Design" section: classes/interfaces as fenced code blocks (any language, or pseudocode),
  each tagged so the parser can find them
- A "Rationale" section: free text — why these responsibilities, what trade-offs were considered
- Optional: a plain-text relationship list (`ClassA -> ClassB : uses`) for a lightweight relationship graph, instead of requiring an actual diagram tool

This keeps input meaningful (it captures classes, responsibilities, relationships, and reasoning —
the actual things being graded) without needing a code execution sandbox or diagram editor for a
2-day build. It's the answer to "what must a learner provide for an attempt to be meaningful."

---

## 3. Core Domain Model (LLD focus — this is the part graded 25%)

```
Problem
  id, title, requirementsMarkdown, constraints[], difficulty, tags[]

Attempt
  id, problemId, learnerId, status (Draft | Submitted | Evaluating | Evaluated | Failed)
  submission: Submission
  createdAt, submittedAt
  previousAttemptId (nullable) -> supports "try again" delta view

Submission
  designBlocks: DesignBlock[]      // parsed classes/interfaces
  relationships: Relationship[]    // parsed "A -> B : verb" lines
  rationaleText: string

DesignBlock
  name, kind (class|interface|enum), fields[], methods[], rawText

Relationship
  from, to, type (uses|extends|implements|composes|aggregates)

EvaluationResult
  id, attemptId
  criteria: CriterionScore[]       // one per rubric dimension
  overallScore, overallSummary
  generatedAt, engineVersion

CriterionScore
  criterionName, score (0-5), explanation, evidenceRefs[] (which DesignBlock/line it's about)

Evaluator (interface)              // <- the extensibility seam, see Q4 below
  + evaluate(Submission, Problem) -> EvaluationResult

  implementations:
  - DeterministicEvaluator   (structural checks — always runs first, fast, free)
  - LLMEvaluator             (reasoning checks — runs second, calls an LLM)
  - CompositeEvaluator       (runs both, merges CriterionScores into one EvaluationResult)

EvaluationQueue / EvaluationJob
  attemptId, status, attempts (retry count), lastError
```

**Key patterns to actually use (not just name-drop):**
- **Strategy pattern** for `Evaluator` — deterministic and LLM evaluators are interchangeable
  implementations of the same interface. This is the answer to Q3/Q4 below.
- **Template method** inside `CompositeEvaluator` for the fixed "run structural checks, then run
  reasoning checks, then merge" sequence.
- **Repository pattern** for Problem/Attempt/EvaluationResult persistence, so swapping storage
  later doesn't touch domain logic.

---

## 4. Answering the Assignment's Design Questions Directly

**What must a learner provide for an attempt to be meaningful?**
Classes/interfaces with named responsibilities, explicit relationships between them, and a
rationale for the choices — not just "code that runs." A parking lot that compiles but has no
separation between `ParkingSpot`, `Vehicle`, and `PricingStrategy` is not a meaningful LLD
attempt even if it works.

**What makes feedback useful when multiple valid solutions exist?**
Feedback must be criterion-based and reference-specific, not a single pass/fail score. Each
`CriterionScore` cites which class/line it's reacting to, and the rubric criteria themselves
(Single Responsibility, appropriate abstraction, extensibility for a stated future requirement,
correct pattern use where relevant) are checked independent of *which* concrete design the
learner chose. Two different valid designs should both be able to score well on the same rubric.

**Which parts should be deterministic vs. LLM-judged?**
- Deterministic: presence of required entities (e.g. "must model at least one strategy/interface
  for X"), structural smells (god classes with too many responsibilities by field/method count,
  missing relationships between things that should relate, naming collisions), completeness
  (did they address every stated requirement in the problem).
- LLM: reasoning quality — is the abstraction *appropriate* (not just present), is the
  rationale coherent, does the design actually extend cleanly to the problem's stated "what if X
  changes" case. This is inherently a judgment call, which is why it's the LLM's job and not
  deterministic code's.

**Extensibility to another evaluation approach or submission format later?**
The `Evaluator` interface and `Submission` being a structured object (not raw text) are the two
seams. A future "runnable code" submission format adds a new field to `Submission` and a new
`Evaluator` implementation (e.g. `TestExecutionEvaluator`) without touching `Attempt`, the queue,
or the feedback UI.

**What happens if evaluation takes time or fails?**
Attempt status moves `Submitted -> Evaluating` immediately (learner sees "evaluating" state, not
a spinner blocking the UI); evaluation runs as an async job. On LLM failure/timeout, retry with
backoff up to N times; if still failing, mark `EvaluationResult` as partial — return the
deterministic score immediately with a note that reasoning feedback is delayed/unavailable, rather
than blocking the whole result on the LLM call. This is the one deliberately-light HLD touch the
assignment allows.

---

## 5. Day-by-Day Build Plan

**Day 1 — Domain + deterministic path (get one attempt fully working end to end, without the LLM)**
1. Scaffold monolith: single backend service, single DB (SQLite/Postgres), one frontend
2. Implement domain model above; seed 3 problems
3. Build attempt flow UI: pick problem → submission form (design blocks + relationships +
   rationale) → submit
4. Implement `DeterministicEvaluator` fully (this is safe, fast, and demonstrable without any
   API key/network dependency)
5. Implement Attempt/EvaluationResult persistence + history list view
6. Write tests for: DeterministicEvaluator scoring rules, submission parsing, attempt state
   transitions

**Day 2 — LLM path, polish, docs**
1. Implement `LLMEvaluator`: fixed rubric prompt, structured JSON output (criteria + scores +
   explanations), parse and merge into `CompositeEvaluator`
2. Add async job handling for evaluation + failure/timeout/retry path from Q5 above
3. Feedback screen: per-criterion breakdown, evidence references, compare-to-previous-attempt view
4. Edge case tests: malformed submission (no classes found), LLM timeout, LLM returns invalid
   JSON, retry-after-failure
5. Write Research note, Design note, README, AI_USAGE.md
6. Final pass against the grading weights table (below) — spend remaining time on whichever
   weighted area is thinnest, not on more features

---

## 6. Grading-Weight Self-Check (do this before submitting)

| Area | Weight | Where it lives in this plan |
|---|---|---|
| Problem understanding & research | 15% | Research note — see §7 |
| Product thinking / creativity | 15% | Submission format decision (§2), retry/delta framing |
| LLD / domain design | 25% | §3 domain model — spend the most real effort here |
| Evaluation & feedback approach | 15% | §4, Deterministic+LLM split, criterion-referenced feedback |
| Extensibility & engineering judgement | 10% | `Evaluator` interface, structured `Submission` |
| Implementation quality | 10% | Day 1/2 plan actually finishing the core loop end-to-end |
| Testing & reliability | 5% | Test list in §5, failure/timeout handling in §4 |
| AI usage | 5% | AI_USAGE.md — log real accept/reject decisions as you go, don't backfill |

---

## 7. Deliverables Checklist

- [ ] Research note (1–2 pages): learner problem, 2–3 existing tools/approaches researched
      (e.g. existing LLD practice sites, coding-judge platforms, how they handle open-ended
      grading), gaps, and why this MVP's direction addresses them
- [ ] Design note: MVP summary, user flow diagram, domain model (§3), evaluation approach (§4),
      trade-offs explicitly called out (e.g. "chose structured-text submission over diagram tool
      because...")
- [ ] Working prototype: full loop, problem selection through feedback and history
- [ ] Tests: deterministic evaluator rules + at least 3 failure/edge cases
- [ ] README: run instructions, key decisions, known limitations
- [ ] AI_USAGE.md: 3–5 real AI-assisted decisions, what was accepted/rejected and why

---

## 8. Other Source Material to Prepare Alongside This Plan

Hand these to Antigravity together with this plan, not just the plan alone — they materially
change output quality for a task like this:

1. **The 3 seed problem statements in final form** — write these out fully (requirements,
   constraints, a "what if X changes" extensibility hook per problem) before the build starts,
   rather than letting the coding agent invent them ad hoc. Inconsistent problem quality will
   drag down the "problem understanding" grading line.
2. **The rubric criteria list, spelled out** — e.g. "Single Responsibility (0–5)", "Appropriate
   abstraction level (0–5)", "Handles stated extensibility case (0–5)", "Relationship correctness
   (0–5)", "Naming/clarity (0–5)". Decide this before coding the evaluator, not while writing the
   LLM prompt — it's the single artifact both evaluators are graded against.
3. **One worked example submission per problem** (a deliberately mediocre one and a strong one)
   — used to sanity-check that both evaluators actually discriminate between good and bad designs
   before you trust their output.
4. **The LLM evaluator's system prompt as a separate reviewable file** — since "which parts
   should be deterministic vs LLM" is a graded question, the prompt itself should show the rubric
   criteria and require structured JSON output; keep it version-controlled next to the code, not
   inline in a string buried in application logic.
5. **A short existing-tools research list** — 2–3 real products/approaches (LLD interview-prep
   sites, competitive programming judges, code-review AI tools) with one line each on how they
   handle "more than one valid answer," to ground the Research note in something real rather than
   assumptions.
6. **Sample data/fixtures for tests** — a handful of pre-written submissions (valid, malformed,
   empty) so the deterministic evaluator's edge-case tests don't depend on the async LLM path at
   all.
7. **This assignment's original brief** — worth keeping alongside the plan so grading-weight
   alignment (§6) stays checkable against the source, not just this derived plan.
