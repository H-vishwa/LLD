# Research Note: Pedagogical & Market Analysis for LLD Practice

## 1. The Core Learner Problem
In software engineering interviews, Low-Level Design (LLD / Object-Oriented Design) represents a critical filter for Mid-to-Staff level engineers. Unlike Data Structures & Algorithms (DSA), which test algorithmic correctness with binary unit tests (`assert solution() == expected`), LLD evaluates **architectural judgment under ambiguity**:
- Separation of Concerns & Single Responsibility Principle (SRP)
- Appropriate abstraction levels (avoiding under-engineering or speculative over-engineering)
- Handling requirement volatility without modifying existing core classes (Open/Closed Principle)
- Explicit relationship modeling (favoring composition over brittle inheritance trees)
- Articulating trade-offs and rationale behind design boundaries

Currently, learners face a frustrating feedback gap:
1. **DSA Platforms (LeetCode, HackerRank, CodeSignal)**: Only check if code compiles and passes automated test cases. A candidate can write a 600-line monolithic God class with nested switches that passes all unit tests, yet would fail an actual LLD interview immediately.
2. **Generic LLM Chatbots (ChatGPT, Claude)**: Provide unstructured, non-standardized conversational critique. Scores drift wildly between sessions, feedback lacks rubric consistency, and learners cannot track quantitative progress or delta between iterations.
3. **Manual Human Mock Interviews**: High-fidelity and personalized, but prohibitively expensive ($100–$250/hour) and impossible to scale for daily practice.

---

## 2. Research on Existing Tools & Evaluation Approaches

We analyzed three primary categories of existing evaluation paradigms:

| Category | Typical Tools | How They Handle "Multiple Valid Solutions" | Core Limitations for LLD |
| :--- | :--- | :--- | :--- |
| **Automated Judges** | LeetCode, Judge0, HackerRank | Compiles and executes code against unit tests / I/O assertions. | Blind to code smells, encapsulation, and coupling. A single solution structure is implicitly mandated by the test harness. |
| **Static Analysis / Linters** | SonarQube, PMD, Checkstyle | Deterministic AST pattern checks for cyclomatic complexity, coupling, and God classes. | Fast and reliable, but completely incapable of evaluating semantic reasoning, domain model coherence, or rationale. |
| **AI Code Reviewers** | GitHub Copilot PR Review, CodiumAI | LLM prompt pass on pull requests with free-form markdown comments. | High variance, hallucination risk, no reproducible rubric, and prone to timeout failure during peak loads. |

---

## 3. The ArchJudge Direction & Why It Solves the Gap

ArchJudge introduces a **Hybrid Evaluation Engine** that bridges deterministic reliability with semantic intelligence:

1. **Submission Format without Docker Overhead**:
   Rather than demanding compilable, runnable code (which shifts the candidate's focus to boilerplate, package managers, and compilation errors), ArchJudge accepts **Structured Design Blocks (Classes/Interfaces) + Explicit Relationships (`A -> B : verb`) + Written Rationale**. This captures the exact artifacts an interviewer examines on a whiteboard in 45 minutes.

2. **Criterion-Referenced, Evidence-Grounded Rubric**:
   Instead of a single subjective score, evaluation is decomposed into 5 weighted dimensions:
   - *Single Responsibility & Modularity* (25%)
   - *Abstraction & Design Patterns* (25%)
   - *Extensibility & Open/Closed Principle* (20%)
   - *Relationship & Coupling Integrity* (15%)
   - *Architectural Rationale & Trade-offs* (15%)

3. **Deterministic Grounding + Semantic Judgment (Composite Evaluator)**:
   - Structural smells (God classes with $\ge 6$ fields/methods, missing associations, lack of interfaces) are caught deterministically via AST pattern rules with concrete code evidence tags.
   - Qualitative dimensions (pattern appropriateness, handling the problem's specific "What if X changes" extensibility hook, depth of trade-off rationale) are analyzed via an LLM rubric pass.

4. **Iterative Delta Feedback**:
   Learners can iterate on an existing attempt ("Try Again"). The platform computes an **Attempt Delta**, showing exact score changes across criteria alongside newly introduced or consolidated classes.
