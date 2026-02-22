const { dbGet, dbAll, dbRun } = require('../config/database');

class Question {
    static async create(topicId, questionText, optionA, optionB, optionC, optionD, correctAnswer, difficulty = 'medium') {
        const sql = `
            INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        return await dbRun(sql, [topicId, questionText, optionA, optionB, optionC, optionD, correctAnswer, difficulty]);
    }

    static async findById(id) {
        const sql = `SELECT * FROM questions WHERE id = ?`;
        return await dbGet(sql, [id]);
    }

    static async getByTopicId(topicId) {
        const sql = `SELECT * FROM questions WHERE topic_id = ? ORDER BY RANDOM()`;
        return await dbAll(sql, [topicId]);
    }

    static async getRandomByTopic(topicId, limit = 20) {
        const sql = `SELECT * FROM questions WHERE topic_id = ? ORDER BY RANDOM() LIMIT ?`;
        return await dbAll(sql, [topicId, limit]);
    }

    static async getAll() {
        const sql = `
            SELECT q.*, t.name as topic_name 
            FROM questions q
            JOIN topics t ON q.topic_id = t.id
            ORDER BY t.name, q.id
        `;
        return await dbAll(sql);
    }

    static async update(id, data) {
        const { questionText, optionA, optionB, optionC, optionD, correctAnswer, difficulty } = data;
        const sql = `
            UPDATE questions 
            SET question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ?, difficulty = ?
            WHERE id = ?
        `;
        return await dbRun(sql, [questionText, optionA, optionB, optionC, optionD, correctAnswer, difficulty, id]);
    }

    static async delete(id) {
        const sql = `DELETE FROM questions WHERE id = ?`;
        return await dbRun(sql, [id]);
    }

    static async countByTopic(topicId) {
        const sql = `SELECT COUNT(*) as count FROM questions WHERE topic_id = ?`;
        const result = await dbGet(sql, [topicId]);
        return result.count;
    }
}

module.exports = Question;
