import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Layers, Award } from 'lucide-react';

export const DocsView = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('architecture');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top navigation header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <button className="btn-secondary-tw text-xs" onClick={onBack}>
          <ArrowLeft size={15} /> <span>Back to Challenges</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            className={activeTab === 'architecture' ? 'btn-primary-tw text-xs py-1.5 px-3' : 'btn-secondary-tw text-xs py-1.5 px-3'}
            onClick={() => setActiveTab('architecture')}
          >
            <Layers size={14} /> <span>Design Note</span>
          </button>
          <button
            className={activeTab === 'research' ? 'btn-primary-tw text-xs py-1.5 px-3' : 'btn-secondary-tw text-xs py-1.5 px-3'}
            onClick={() => setActiveTab('research')}
          >
            <BookOpen size={14} /> <span>Research Note</span>
          </button>
          <button
            className={activeTab === 'rubric' ? 'btn-primary-tw text-xs py-1.5 px-3' : 'btn-secondary-tw text-xs py-1.5 px-3'}
            onClick={() => setActiveTab('rubric')}
          >
            <Award size={14} /> <span>Rubric & Grading</span>
          </button>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-10 space-y-6">
        {activeTab === 'architecture' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-heading text-white">Architecture & Design Note</h2>
              <p className="text-slate-400 text-sm mt-1">
                Architectural decisions, patterns used, and design rationale behind the ArchJudge platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-2 hover:border-indigo-500/20 transition-colors">
                <h4 className="text-indigo-400 font-semibold text-sm">1. Strategy Pattern (`IEvaluator`)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Interchangeable evaluation engines (`DeterministicEvaluator`, `LLMEvaluator`, `CompositeEvaluator`). Extensible to new submission types without touching Attempt domain logic.
                </p>
              </div>

              <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-2 hover:border-emerald-500/20 transition-colors">
                <h4 className="text-emerald-400 font-semibold text-sm">2. Template Method Pattern</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  `CompositeEvaluator` enforces the evaluation lifecycle: run fast deterministic structural AST heuristics first, run LLM semantic judgment second, and merge into weighted rubric scores.
                </p>
              </div>

              <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-2 hover:border-cyan-500/20 transition-colors">
                <h4 className="text-cyan-400 font-semibold text-sm">3. Repository Pattern</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  `IProblemRepository`, `IAttemptRepository`, `IEvaluationRepository` separate business logic from data storage. In-memory data store can be swapped for SQLite / Postgres with zero domain refactoring.
                </p>
              </div>

              <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-2 hover:border-amber-500/20 transition-colors">
                <h4 className="text-amber-400 font-semibold text-sm">4. Non-Blocking Async Queue</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Attempt status moves Submitted &rarr; Evaluating &rarr; Evaluated. On LLM timeout, automatically retries with backoff and gracefully degrades to partial structural results without blocking the user.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="text-lg font-bold font-heading text-white">The Two Simple Change Tests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20 space-y-2">
                  <div className="font-semibold text-indigo-300 text-sm">Change Test A: Text &rarr; Class Diagrams</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-200">Domain Model Impact: ZERO.</strong> The Submission entity abstracts DesignBlocks and Relationships. A diagram parser simply emits into this exact model without touching Attempt, Problem, or Evaluators.
                  </p>
                </div>

                <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 space-y-2">
                  <div className="font-semibold text-emerald-300 text-sm">Change Test B: Adding Human Review / Linters</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-200">Practice Flow Impact: ZERO.</strong> Thanks to the Strategy Pattern, a HumanReviewEvaluator or LinterEvaluator implements IEvaluator and plugs into CompositeEvaluator without altering queue, controllers, or storage.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 space-y-1.5">
              <div className="font-semibold text-slate-200 text-sm">
                Practical Scaling: What component to separate first when growing?
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">The EvaluationQueue Worker:</strong> Decouple the async evaluation queue into an independent background worker (e.g., Redis BullMQ + AWS Lambda/Cloud Run). Web API endpoints remain lightweight and instant (&lt;50ms), while compute-heavy AST analysis and high-latency LLM calls scale independently.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'research' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-heading text-white">Research Note: Pedagogical & Market Analysis</h2>
              <p className="text-slate-400 text-sm mt-1">
                Why existing coding judges fail at LLD, and how ArchJudge solves the open-ended grading dilemma.
              </p>
            </div>

            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
              <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-2">
                <h4 className="text-white font-bold text-base">The Core Learner Problem</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In Low-Level Design interviews, there is never a single "correct" solution. Two candidate solutions with completely different class splits (e.g. strategy vs state pattern) can both be valid. Existing platforms (LeetCode, HackerRank) evaluate via binary test cases (`assert parkingLot.park() == true`), which tests algorithmic syntax rather than architectural trade-offs, modularity, or extensibility.
                </p>
              </div>

              <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-3">
                <h4 className="text-white font-bold text-base">Comparison with Existing Approaches</h4>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-2">
                  <li><strong className="text-slate-200">Competitive Programming Judges:</strong> Fast and deterministic, but blind to code smell, God classes, and SRP.</li>
                  <li><strong className="text-slate-200">Pure LLM Chat (ChatGPT/Claude):</strong> Subject to prompt drift, hallucinated scores, and expensive / slow latency without structured baseline checks.</li>
                  <li><strong className="text-slate-200">ArchJudge Hybrid Approach:</strong> Deterministic AST parser provides instant structural grounding (God classes, relationship consistency), while semantic LLM judges rationale and OCP extensibility.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rubric' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-heading text-white">Evaluation Rubric & Weights</h2>
              <p className="text-slate-400 text-sm mt-1">
                Standardized 5-dimension rubric ensuring consistent, reproducible scoring across varied submissions.
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-xl border border-white/5 transition-colors space-y-1">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-white">1. Single Responsibility & Modularity (SRP)</span>
                  <span className="text-indigo-400 font-mono text-xs">25% Weight</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluates class cohesiveness, method/field distribution, and penalizes bloated God objects.
                </p>
              </div>

              <div className="bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-xl border border-white/5 transition-colors space-y-1">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-white">2. Abstraction & Design Patterns</span>
                  <span className="text-indigo-400 font-mono text-xs">25% Weight</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluates presence and appropriate calibration of interfaces, abstract classes, and GoF patterns (Strategy, State, Factory).
                </p>
              </div>

              <div className="bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-xl border border-white/5 transition-colors space-y-1">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-white">3. Extensibility & Open/Closed Principle</span>
                  <span className="text-indigo-400 font-mono text-xs">20% Weight</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Judges how well the architecture absorbs the problem's specific "What if X changes" extensibility hook.
                </p>
              </div>

              <div className="bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-xl border border-white/5 transition-colors space-y-1">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-white">4. Relationship & Coupling Integrity</span>
                  <span className="text-indigo-400 font-mono text-xs">15% Weight</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Checks declared associations, favors composition over deep inheritance, and validates link references.
                </p>
              </div>

              <div className="bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-xl border border-white/5 transition-colors space-y-1">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-white">5. Architectural Rationale & Trade-offs</span>
                  <span className="text-indigo-400 font-mono text-xs">15% Weight</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
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
