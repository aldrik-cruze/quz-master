const express = require('express');
const User = require('../models/User');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const Topic = require('../models/Topic');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware, adminMiddleware);

// Get dashboard statistics
router.get('/statistics', async (req, res) => {
    try {
        const users = await User.getAll();
        const stats = await QuizAttempt.getStatistics();
        const topics = await Topic.getAll();
        const questions = await Question.getAll();

        res.json({
            totalUsers: users.length,
            totalAttempts: stats.total_attempts || 0,
            averageScore: parseFloat(stats.avg_score || 0).toFixed(2),
            highestScore: stats.highest_score || 0,
            totalTopics: topics.length,
            totalQuestions: questions.length
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.getAll();
        
        // Get stats for each user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const stats = await User.getUserStats(user.id);
                return { ...user, stats };
            })
        );

        res.json({ users: usersWithStats });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Update user status
router.put('/users/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        await User.updateStatus(id, isActive ? 1 : 0);
        res.json({ message: 'User status updated successfully' });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

// Get all questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.getAll();
        res.json({ questions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// Add new question
router.post('/questions', async (req, res) => {
    try {
        const { topicId, questionText, optionA, optionB, optionC, optionD, correctAnswer, difficulty } = req.body;

        if (!topicId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const result = await Question.create(
            topicId, questionText, optionA, optionB, optionC, optionD, correctAnswer, difficulty
        );

        res.status(201).json({ 
            message: 'Question added successfully',
            questionId: result.lastID
        });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ error: 'Failed to add question' });
    }
});

// Update question
router.put('/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { questionText, optionA, optionB, optionC, optionD, correctAnswer, difficulty } = req.body;

        await Question.update(id, {
            questionText, optionA, optionB, optionC, optionD, correctAnswer, difficulty
        });

        res.json({ message: 'Question updated successfully' });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Failed to update question' });
    }
});

// Delete question
router.delete('/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Question.delete(id);
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

// Get all quiz attempts
router.get('/attempts', async (req, res) => {
    try {
        const attempts = await QuizAttempt.getAll();
        res.json({ attempts });
    } catch (error) {
        console.error('Error fetching attempts:', error);
        res.status(500).json({ error: 'Failed to fetch quiz attempts' });
    }
});

module.exports = router;
