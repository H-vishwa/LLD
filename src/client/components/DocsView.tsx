import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Layers, Cpu, Award } from 'lucide-react';

interface DocsViewProps {
  onBack: () => void;
}

export const DocsView: React.FC<DocsViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'research' | 'rubric'>('architecture');

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Challenges
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${activeTab === 'architecture' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('architecture')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Layers size={14} /> Design Note
          </button>
          <button
            className={`btn ${activeTab === 'research' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('research')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <BookOpen size={14} /> Research Note
          </button>
          <button
            className={`btn ${activeTab === 'rubric' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('rubric')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Award size={14} /> Rubric & Grading
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {activeTab === 'architecture' && (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Architecture & Design Note</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Architectural decisions, patterns used, and design rationale behind the ArchJudge platform.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ color: '#818cf8', marginBottom: '0.5rem' }}>1. Strategy Pattern (`IEvaluator`)</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Interchangeable evaluation engines (`DeterministicEvaluator`, `LLMEvaluator`, `CompositeEvaluator`). Extensible to new submission types (e.g. Unit tests or diagram parsers) without touching Attempt domain logic.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ color: '#34d399', marginBottom: '0.5rem' }}>2. Template Method Pattern</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  `CompositeEvaluator` enforces the evaluation lifecycle: run fast deterministic structural AST heuristics first, run LLM semantic judgment second, and merge into weighted rubric scores.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ color: '#06b6d4', marginBottom: '0.5rem' }}>3. Repository Pattern</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  `IProblemRepository`, `IAttemptRepository`, `IEvaluationRepository` separate business logic from data storage. In-memory data store can be swapped for SQLite / Postgres with zero domain refactoring.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>4. Non-Blocking Async Queue</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Attempt status moves Submitted &rarr; Evaluating &rarr; Evaluated. On LLM timeout, automatically retries with backoff and gracefully degrades to partial structural results without blocking the user.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#ffffff' }}>The Two Simple Change Tests</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ fontWeight: 600, color: '#a5b4fc', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Change Test A: Text &rarr; Class Diagrams</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <strong>Domain Model Impact: ZERO.</strong> The Submission entity abstracts DesignBlocks and Relationships. A diagram parser (PlantUML or visual canvas) simply emits into this exact model without touching Attempt, Problem, or Evaluators.
                  </p>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontWeight: 600, color: '#34d399', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Change Test B: Adding Human Review / Linters</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <strong>Practice Flow Impact: ZERO.</strong> Thanks to the Strategy Pattern, a HumanReviewEvaluator or LinterEvaluator implements IEvaluator and plugs into CompositeEvaluator without altering queue, controllers, or storage.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                Practical Scaling: What component to separate first when growing?
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                <strong>The EvaluationQueue Worker</strong>: Decouple the async evaluation queue into an independent background worker (e.g., Redis BullMQ + AWS Lambda/Cloud Run). Web API endpoints remain lightweight and instant (&lt;50ms), while compute-heavy AST analysis and high-latency LLM calls scale independently.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'research' && (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Research Note: Pedagogical & Market Analysis</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Why existing coding judges fail at LLD, and how ArchJudge solves the open-ended grading dilemma.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.7' }}>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.4rem' }}>The Core Learner Problem</h4>
                <p>
                  In Low-Level Design interviews, there is never a single "correct" solution. Two candidate solutions with completely different class splits (e.g. strategy vs state pattern) can both be valid. Existing platforms (LeetCode, HackerRank) evaluate via binary test cases (`assert parkingLot.park() == true`), which tests algorithmic syntax rather than architectural trade-offs, modularity, or extensibility.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.4rem' }}>Comparison with Existing Approaches</h4>
                <ul style={{ paddingLeft: '1.25rem' }}>
                  <li><strong>Competitive Programming Judges:</strong> Fast and deterministic, but blind to code smell, God classes, and SRP.</li>
                  <li><strong>Pure LLM Chat (ChatGPT/Claude):</strong> Subject to prompt drift, hallucinated scores, and expensive / slow latency without structured baseline checks.</li>
                  <li><strong>ArchJudge Hybrid Approach:</strong> Deterministic AST parser provides instant structural grounding (God classes, relationship consistency), while semantic LLM judges rationale and OCP extensibility.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rubric' && (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Evaluation Rubric & Weights</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Standardized 5-dimension rubric ensuring consistent, reproducible scoring across varied submissions.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span style={{ color: '#ffffff' }}>1. Single Responsibility & Modularity (SRP)</span>
                  <span style={{ color: '#818cf8' }}>25% Weight</span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Evaluates class cohesiveness, method/field distribution, and penalizes bloated God objects.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span style={{ color: '#ffffff' }}>2. Abstraction & Design Patterns</span>
                  <span style={{ color: '#818cf8' }}>25% Weight</span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Evaluates presence and appropriate calibration of interfaces, abstract classes, and GoF patterns (Strategy, State, Factory).
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span style={{ color: '#ffffff' }}>3. Extensibility & Open/Closed Principle</span>
                  <span style={{ color: '#818cf8' }}>20% Weight</span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Judges how well the architecture absorbs the problem's specific "What if X changes" extensibility hook.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span style={{ color: '#ffffff' }}>4. Relationship & Coupling Integrity</span>
                  <span style={{ color: '#818cf8' }}>15% Weight</span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Checks declared associations, favors composition over deep inheritance, and validates link references.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span style={{ color: '#ffffff' }}>5. Architectural Rationale & Trade-offs</span>
                  <span style={{ color: '#818cf8' }}>15% Weight</span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Assesses clarity, depth, and intentional justification of architectural trade-offs in written rationale.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
