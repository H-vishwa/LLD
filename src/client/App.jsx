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
import './App.css';

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
      alert(`Submission error: ${err.message}`);
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
    }
  };

  const handleViewDelta = async () => {
    if (!currentAttempt || !currentAttempt.previousAttemptId) return;
    try {
      const deltaData = await api.getDelta(currentAttempt.id);
      setDelta(deltaData);
      setShowDeltaModal(true);
    } catch (err) {
      alert(`Delta error: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        onGoHome={() => setView('problems')}
        onOpenDocs={() => setView('docs')}
        activeView={view}
      />

      <main className="main-layout">
        {view === 'problems' && (
          <ProblemList
            problems={problems}
            onSelectProblem={handleSelectProblem}
            isLoading={loadingProblems}
          />
        )}

        {view === 'workspace' && selectedProblem && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setView('problems')}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                ← Back to Challenges
              </button>
            </div>

            <div className="workspace-grid">
              <ProblemDetail problem={selectedProblem} />
              <SubmissionForm
                problem={selectedProblem}
                previousAttemptId={previousAttemptId}
                previousContent={previousContent}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>

            <AttemptHistory
              attempts={history}
              onSelectAttempt={handleInspectHistoricalAttempt}
            />
          </div>
        )}

        {view === 'feedback' && currentAttempt && (
          <div>
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
