const express = require('express');
const Topic = require('../models/Topic');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all topics
router.get('/topics', async (req, res) => {
    try {
        const topics = await Topic.getAll();
        res.json({ topics });
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
});

// Start a new quiz
router.post('/start', authMiddleware, async (req, res) => {
    try {
        const { topicId } = req.body;

        if (!topicId) {
            return res.status(400).json({ error: 'Topic ID is required' });
        }

        // Check if topic has enough questions
        const questionCount = await Question.countByTopic(topicId);
        if (questionCount < 20) {
            return res.status(400).json({ 
                error: `Not enough questions. Topic has ${questionCount} questions but needs 20.` 
            });
        }

        // Get random questions
        const questions = await Question.getRandomByTopic(topicId, 20);

        // Create quiz attempt
        const userId = req.user.isGuest ? null : req.user.userId;
        const sessionId = req.user.isGuest ? req.user.sessionId : null;
        
        const attempt = await QuizAttempt.create(userId, topicId, sessionId);

        // Format questions (remove correct answer from response)
        const formattedQuestions = questions.map(q => ({
            id: q.id,
            question: q.question_text,
            options: {
                a: q.option_a,
                b: q.option_b,
                c: q.option_c,
                d: q.option_d
            },
            difficulty: q.difficulty
        }));

        res.json({
            attemptId: attempt.lastID,
            questions: formattedQuestions,
            totalQuestions: 20
        });
    } catch (error) {
        console.error('Error starting quiz:', error);
        res.status(500).json({ error: 'Failed to start quiz' });
    }
});

// Submit quiz answers
router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const { attemptId, answers } = req.body;

        if (!attemptId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'Invalid submission data' });
        }

        let correctCount = 0;
        const results = [];

        // Check each answer
        for (const answer of answers) {
            const question = await Question.findById(answer.questionId);
            if (!question) continue;

            const isCorrect = question.correct_answer === answer.userAnswer;
            if (isCorrect) correctCount++;

            // Save response
            await QuizAttempt.saveResponse(
                attemptId,
                answer.questionId,
                answer.userAnswer,
                isCorrect
            );

            results.push({
                questionId: answer.questionId,
                questionText: question.question_text,
                options: {
                    a: question.option_a,
                    b: question.option_b,
                    c: question.option_c,
                    d: question.option_d
                },
                isCorrect,
                correctAnswer: question.correct_answer,
                userAnswer: answer.userAnswer
            });
        }

        // Update attempt with score
        await QuizAttempt.complete(attemptId, correctCount, answers.length);

        res.json({
            score: correctCount,
            totalQuestions: answers.length,
            percentage: ((correctCount / answers.length) * 100).toFixed(2),
            results
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

// Get quiz history
router.get('/history', authMiddleware, async (req, res) => {
    try {
        let history;
        
        if (req.user.isGuest) {
            history = await QuizAttempt.getGuestHistory(req.user.sessionId);
        } else {
            history = await QuizAttempt.getUserHistory(req.user.userId);
        }

        res.json({ history });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch quiz history' });
    }
});

// Get quiz details
router.get('/attempt/:id', authMiddleware, async (req, res) => {
    try {
        const attemptId = req.params.id;
        const attempt = await QuizAttempt.findById(attemptId);
        
        if (!attempt) {
            return res.status(404).json({ error: 'Quiz attempt not found' });
        }

        const responses = await QuizAttempt.getResponses(attemptId);

        res.json({ 
            attempt,
            responses
        });
    } catch (error) {
        console.error('Error fetching attempt:', error);
        res.status(500).json({ error: 'Failed to fetch quiz attempt' });
    }
});

module.exports = router;
