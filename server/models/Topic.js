const { dbGet, dbAll, dbRun } = require('../config/database');

class Topic {
    static async create(name, description, icon = '📚') {
        const sql = `INSERT INTO topics (name, description, icon) VALUES (?, ?, ?)`;
        return await dbRun(sql, [name, description, icon]);
    }

    static async getAll() {
        const sql = `
            SELECT 
                t.*,
                COUNT(q.id) as question_count
            FROM topics t
            LEFT JOIN questions q ON t.id = q.topic_id
            GROUP BY t.id
            ORDER BY t.name
        `;
        return await dbAll(sql);
    }

    static async findById(id) {
        const sql = `SELECT * FROM topics WHERE id = ?`;
        return await dbGet(sql, [id]);
    }

    static async findByName(name) {
        const sql = `SELECT * FROM topics WHERE name = ?`;
        return await dbGet(sql, [name]);
    }
}

module.exports = Topic;
