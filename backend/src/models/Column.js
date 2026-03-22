const pool = require('../config/database');

class Column {
  static async create(boardId, name, position) {
    const result = await pool.query(
      'INSERT INTO columns (board_id, name, position) VALUES ($1, $2, $3) RETURNING *',
      [boardId, name, position]
    );
    return result.rows[0];
  }

  static async getByBoardId(boardId) {
    const result = await pool.query(
      'SELECT * FROM columns WHERE board_id = $1 ORDER BY position ASC',
      [boardId]
    );
    return result.rows;
  }

  static async update(id, name) {
    const result = await pool.query(
      'UPDATE columns SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM columns WHERE id = $1', [id]);
  }

  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM columns WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Column;
