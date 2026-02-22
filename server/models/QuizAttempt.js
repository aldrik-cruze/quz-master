const { dbGet, dbAll, dbRun } = require('../config/database');

class QuizAttempt {
    static async create(userId, topicId, sessionId = null) {
        const sql = `
            INSERT INTO quiz_attempts (user_id, topic_id, session_id)
            VALUES (?, ?, ?)
        `;
        return await dbRun(sql, [userId, topicId, sessionId]);
    }

    static async complete(attemptId, score, totalQuestions) {
        const sql = `
            UPDATE quiz_attempts 
            SET score = ?, total_questions = ?, completed_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        return await dbRun(sql, [score, totalQuestions, attemptId]);
    }

    static async findById(id) {
        const sql = `
            SELECT qa.*, t.name as topic_name, u.username
            FROM quiz_attempts qa
            JOIN topics t ON qa.topic_id = t.id
            LEFT JOIN users u ON qa.user_id = u.id
            WHERE qa.id = ?
        `;
        return await dbGet(sql, [id]);
    }

    static async getUserHistory(userId) {
        const sql = `
            SELECT qa.*, t.name as topic_name
            FROM quiz_attempts qa
            JOIN topics t ON qa.topic_id = t.id
            WHERE qa.user_id = ? AND qa.completed_at IS NOT NULL
            ORDER BY qa.completed_at DESC
        `;
        return await dbAll(sql, [userId]);
    }

    static async getGuestHistory(sessionId) {
        const sql = `
            SELECT qa.*, t.name as topic_name
            FROM quiz_attempts qa
            JOIN topics t ON qa.topic_id = t.id
            WHERE qa.session_id = ? AND qa.completed_at IS NOT NULL
            ORDER BY qa.completed_at DESC
        `;
        return await dbAll(sql, [sessionId]);
    }

    static async getAll() {
        const sql = `
            SELECT qa.*, t.name as topic_name, u.username
            FROM quiz_attempts qa
            JOIN topics t ON qa.topic_id = t.id
            LEFT JOIN users u ON qa.user_id = u.id
            WHERE qa.completed_at IS NOT NULL
            ORDER BY qa.completed_at DESC
        `;
        return await dbAll(sql);
    }

    static async getStatistics() {
        const sql = `
            SELECT 
                COUNT(*) as total_attempts,
                COUNT(DISTINCT user_id) as unique_users,
                AVG(score) as avg_score,
                MAX(score) as highest_score
            FROM quiz_attempts
            WHERE completed_at IS NOT NULL
        `;
        return await dbGet(sql);
    }

    static async saveResponse(attemptId, questionId, userAnswer, isCorrect) {
        const sql = `
            INSERT INTO quiz_responses (attempt_id, question_id, user_answer, is_correct)
            VALUES (?, ?, ?, ?)
        `;
        return await dbRun(sql, [attemptId, questionId, userAnswer, isCorrect ? 1 : 0]);
    }

    static async getResponses(attemptId) {
        const sql = `
            SELECT qr.*, q.question_text, q.correct_answer
            FROM quiz_responses qr
            JOIN questions q ON qr.question_id = q.id
            WHERE qr.attempt_id = ?
        `;
        return await dbAll(sql, [attemptId]);
    }
}

module.exports = QuizAttempt;
