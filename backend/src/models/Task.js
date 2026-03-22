const pool = require('../config/database');

class Task {
  static async create(columnId, title, description = '', position = 0) {
    const result = await pool.query(
      'INSERT INTO tasks (column_id, title, description, position) VALUES ($1, $2, $3, $4) RETURNING *',
      [columnId, title, description, position]
    );
    return result.rows[0];
  }

  static async getByColumnId(columnId) {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE column_id = $1 ORDER BY position ASC',
      [columnId]
    );
    return result.rows;
  }

  static async update(id, title, description) {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  }

  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async moveToColumn(id, columnId, position) {
    const result = await pool.query(
      'UPDATE tasks SET column_id = $1, position = $2 WHERE id = $3 RETURNING *',
      [columnId, position, id]
    );
    return result.rows[0];
  }

  static async reorderColumn(columnId) {
    const tasks = await this.getByColumnId(columnId);
    tasks.sort((a, b) => a.position - b.position);
    const updates = tasks.map((task, index) =>
      pool.query('UPDATE tasks SET position = $1 WHERE id = $2', [index, task.id])
    );
    await Promise.all(updates);
  }

  static async getTasksByBoardId(boardId) {
    const result = await pool.query(
      `SELECT t.* FROM tasks t
       JOIN columns c ON t.column_id = c.id
       WHERE c.board_id = $1
       ORDER BY c.position, t.position`,
      [boardId]
    );
    return result.rows;
  }
}

module.exports = Task;
