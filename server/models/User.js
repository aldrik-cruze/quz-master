const { dbGet, dbAll, dbRun } = require('../config/database');

class User {
    static async create(username, email, hashedPassword, role = 'user') {
        const sql = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
        return await dbRun(sql, [username, email, hashedPassword, role]);
    }

    static async findByUsername(username) {
        const sql = `SELECT * FROM users WHERE username = ?`;
        return await dbGet(sql, [username]);
    }

    static async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        return await dbGet(sql, [email]);
    }

    static async findById(id) {
        const sql = `SELECT id, username, email, role, is_active, created_at FROM users WHERE id = ?`;
        return await dbGet(sql, [id]);
    }

    static async getAll() {
        const sql = `SELECT id, username, email, role, is_active, created_at FROM users ORDER BY created_at DESC`;
        return await dbAll(sql);
    }

    static async updateStatus(id, isActive) {
        const sql = `UPDATE users SET is_active = ? WHERE id = ?`;
        return await dbRun(sql, [isActive, id]);
    }

    static async getUserStats(userId) {
        const sql = `
            SELECT 
                COUNT(*) as total_quizzes,
                AVG(score) as avg_score,
                MAX(score) as best_score,
                MIN(score) as lowest_score
            FROM quiz_attempts 
            WHERE user_id = ? AND completed_at IS NOT NULL
        `;
        return await dbGet(sql, [userId]);
    }
}

module.exports = User;
