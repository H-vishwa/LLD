import React, { useState, useEffect } from 'react';
import { api } from './services/api.service.js';
import { Navbar } from './components/Navbar.jsx';
import { ProblemList } from './components/ProblemList.jsx';
import { ProblemDetail } from './components/ProblemDetail.jsx';
import { SubmissionForm } from './components/SubmissionForm.jsx';
import { FeedbackView } from './components/FeedbackView.jsx';
import { AttemptHistory } from './components/AttemptHistory.jsx';
import { AttemptDeltaModal } from './components/AttemptDeltaModal.jsx';
import { DocsView } from './components/DocsView.jsx';
import { AlertCircle, X } from 'lucide-react';

export const App = () => {
  const [view, setView] = useState('problems');
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loadingProblems, setLoadingProblems] = useState(true);

  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [history, setHistory] = useState([]);

  const [previousAttemptId, setPreviousAttemptId] = useState(undefined);
  const [previousContent, setPreviousContent] = useState(undefined);

  const [delta, setDelta] = useState(null);
  const [showDeltaModal, setShowDeltaModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      setLoadingProblems(true);
      const data = await api.getProblems();
      setProblems(data);
    } catch (err) {
      console.error('Failed to load problems:', err);
      setErrorMessage(`Failed to load problems: ${err.message}`);
    } finally {
      setLoadingProblems(false);
    }
  };

  const handleSelectProblem = async (problem) => {
    setSelectedProblem(problem);
    setPreviousAttemptId(undefined);
    setPreviousContent(undefined);
    setView('workspace');
    await loadHistory(problem.id);
  };

  const loadHistory = async (problemId) => {
    try {
      const data = await api.getHistory(problemId);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleSubmit = async (rawContent) => {
    if (!selectedProblem) return;
    try {
      setIsSubmitting(true);
      const newAttempt = await api.submitAttempt(
        selectedProblem.id,
        rawContent,
        previousAttemptId
      );

      setCurrentAttempt(newAttempt);
      setCurrentEvaluation(null);
      setView('feedback');

      pollAttempt(newAttempt.id);
    } catch (err) {
      setErrorMessage(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pollAttempt = (attemptId) => {
    const interval = setInterval(async () => {
      try {
        const data = await api.getAttempt(attemptId);
        setCurrentAttempt(data.attempt);

        if (data.attempt.status === 'Evaluated' && data.evaluation) {
          setCurrentEvaluation(data.evaluation);
          clearInterval(interval);
          if (selectedProblem) {
            loadHistory(selectedProblem.id);
          }
        } else if (data.attempt.status === 'Failed') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Polling error', err);
        clearInterval(interval);
      }
    }, 600);
  };

  const handleRetry = () => {
    if (currentAttempt) {
      setPreviousAttemptId(currentAttempt.id);
      setPreviousContent(currentAttempt.rawContent);
    }
    setView('workspace');
  };

  const handleInspectHistoricalAttempt = async (attemptId) => {
    try {
      const data = await api.getAttempt(attemptId);
      setCurrentAttempt(data.attempt);
      setCurrentEvaluation(data.evaluation);
      setView('feedback');
    } catch (err) {
      console.error('Failed to inspect attempt:', err);
      setErrorMessage(`Failed to load attempt: ${err.message}`);
    }
  };

  const handleViewDelta = async () => {
    if (!currentAttempt || !currentAttempt.previousAttemptId) return;
    try {
      const deltaData = await api.getDelta(currentAttempt.id);
      setDelta(deltaData);
      setShowDeltaModal(true);
    } catch (err) {
      setErrorMessage(`Delta comparison error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <Navbar
        onGoHome={() => setView('problems')}
        onOpenDocs={() => setView('docs')}
        activeView={view}
      />

      {/* Floating Error Notification Toast */}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-rose-950/90 border border-rose-500/30 text-rose-200 p-4 rounded-xl shadow-2xl backdrop-blur-md flex items-start gap-3 animate-in slide-in-from-bottom duration-200">
          <AlertCircle size={20} className="text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed flex-1">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 text-rose-400 hover:text-white rounded transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {view === 'problems' && (
          <ProblemList
            problems={problems}
            onSelectProblem={handleSelectProblem}
            isLoading={loadingProblems}
          />
        )}

        {view === 'workspace' && selectedProblem && (
          <div className="space-y-6">
            <div>
              <button
                className="btn-secondary-tw text-xs"
                onClick={() => setView('problems')}
              >
                ← Back to Challenges
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5">
                <ProblemDetail problem={selectedProblem} />
              </div>
              <div className="lg:col-span-7">
                <SubmissionForm
                  problem={selectedProblem}
                  previousAttemptId={previousAttemptId}
                  previousContent={previousContent}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>

            <AttemptHistory
              attempts={history}
              onSelectAttempt={handleInspectHistoricalAttempt}
            />
          </div>
        )}

        {view === 'feedback' && currentAttempt && (
          <div className="space-y-8">
            <FeedbackView
              attempt={currentAttempt}
              evaluation={currentEvaluation}
              onRetry={handleRetry}
              onViewDelta={handleViewDelta}
              onBackToProblem={() => setView('workspace')}
            />

            {selectedProblem && (
              <AttemptHistory
                attempts={history}
                onSelectAttempt={handleInspectHistoricalAttempt}
              />
            )}
          </div>
        )}

        {view === 'docs' && <DocsView onBack={() => setView('problems')} />}
      </main>

      <AttemptDeltaModal
        delta={delta}
        onClose={() => setShowDeltaModal(false)}
      />
    </div>
  );
};
