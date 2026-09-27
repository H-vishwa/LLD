export class AttemptController {
  /**
   * @param {import('../../domain/repositories/attempt.repository.interface.js').IAttemptRepository} attemptRepo
   * @param {import('../../domain/repositories/evaluation.repository.interface.js').IEvaluationRepository} evalRepo
   * @param {import('../../queue/evaluation-queue.js').EvaluationQueue} evalQueue
   * @param {import('../../domain/services/submission-parser.service.js').SubmissionParserService} parser
   */
  constructor(attemptRepo, evalRepo, evalQueue, parser) {
    this.attemptRepo = attemptRepo;
    this.evalRepo = evalRepo;
    this.evalQueue = evalQueue;
    this.parser = parser;
  }

  create = async (req, res) => {
    try {
      const { problemId, learnerId = 'default-learner', rawContent, previousAttemptId } = req.body;

      if (!problemId || !rawContent) {
        res.status(400).json({ error: 'problemId and rawContent are required' });
        return;
      }

      const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newAttempt = {
        id: attemptId,
        problemId,
        learnerId,
        status: 'Submitted',
        rawContent,
        createdAt: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
        previousAttemptId: previousAttemptId || undefined,
      };

      const created = await this.attemptRepo.create(newAttempt);
      this.evalQueue.enqueue(created.id);

      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  getById = async (req, res) => {
    try {
      const attempt = await this.attemptRepo.findById(req.params.id);
      if (!attempt) {
        res.status(404).json({ error: 'Attempt not found' });
        return;
      }

      let evaluationResult = null;
      if (attempt.resultId) {
        evaluationResult = await this.evalRepo.findById(attempt.resultId);
      }

      res.json({
        attempt,
        evaluation: evaluationResult,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  getHistory = async (req, res) => {
    try {
      const { problemId, learnerId = 'default-learner' } = req.query;

      if (!problemId) {
        res.status(400).json({ error: 'problemId query parameter is required' });
        return;
      }

      const attempts = await this.attemptRepo.findByLearnerAndProblem(
        String(learnerId),
        String(problemId)
      );

      const hydrated = await Promise.all(
        attempts.map(async (att) => {
          let evaluation = null;
          if (att.resultId) {
            evaluation = await this.evalRepo.findById(att.resultId);
          }
          return {
            ...att,
            score: evaluation ? evaluation.overallScore : null,
          };
        })
      );

      res.json(hydrated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  getDelta = async (req, res) => {
    try {
      const currentAttempt = await this.attemptRepo.findById(req.params.id);
      if (!currentAttempt || !currentAttempt.previousAttemptId) {
        res.status(404).json({ error: 'Attempt has no previous attempt to compare against.' });
        return;
      }

      const prevAttempt = await this.attemptRepo.findById(currentAttempt.previousAttemptId);
      if (!prevAttempt) {
        res.status(404).json({ error: 'Previous attempt not found.' });
        return;
      }

      const currentEval = currentAttempt.resultId
        ? await this.evalRepo.findById(currentAttempt.resultId)
        : null;
      const prevEval = prevAttempt.resultId
        ? await this.evalRepo.findById(prevAttempt.resultId)
        : null;

      const currentParsed = this.parser.parse(currentAttempt.rawContent);
      const prevParsed = this.parser.parse(prevAttempt.rawContent);

      const currentClasses = new Set(currentParsed.designBlocks.map((b) => b.name));
      const prevClasses = new Set(prevParsed.designBlocks.map((b) => b.name));

      const addedClasses = Array.from(currentClasses).filter((c) => !prevClasses.has(c));
      const removedClasses = Array.from(prevClasses).filter((c) => !currentClasses.has(c));

      const criteriaDeltas = [];
      if (currentEval && prevEval) {
        for (const currCrit of currentEval.criteria) {
          const prevCrit = prevEval.criteria.find((c) => c.criterionId === currCrit.criterionId);
          if (prevCrit) {
            criteriaDeltas.push({
              criterionId: currCrit.criterionId,
              criterionName: currCrit.criterionName,
              previousScore: prevCrit.score,
              currentScore: currCrit.score,
              diff: Math.round((currCrit.score - prevCrit.score) * 10) / 10,
            });
          }
        }
      }

      const delta = {
        currentAttemptId: currentAttempt.id,
        previousAttemptId: prevAttempt.id,
        scoreDifference:
          currentEval && prevEval ? currentEval.overallScore - prevEval.overallScore : 0,
        addedClasses,
        removedClasses,
        criteriaDeltas,
      };

      res.json(delta);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  previewParse = (req, res) => {
    try {
      const { rawContent } = req.body;
      const parsed = this.parser.parse(rawContent || '');
      res.json(parsed);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
}
