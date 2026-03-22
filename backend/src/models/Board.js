const pool = require('../config/database');

class Board {
  static async create(userId, name = 'My Board') {
    const result = await pool.query(
      'INSERT INTO boards (user_id, name) VALUES ($1, $2) RETURNING *',
      [userId, name]
    );
    return result.rows[0];
  }

  static async getByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM boards WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async update(id, name) {
    const result = await pool.query(
      'UPDATE boards SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM boards WHERE id = $1', [id]);
  }

  static async getBoardWithColumns(boardId) {
    console.log('Fetching board with ID:', boardId);
    // Avoid nested aggregate JSON (PostgreSQL does not allow nested json_agg calls directly).
    // Fetch board, columns, and tasks in separate queries, then assemble in JS.
    const boardResult = await pool.query(
      'SELECT id, user_id, name, created_at FROM boards WHERE id = $1',
      [boardId]
    );

    console.log('Board result:', boardResult.rows);

    if (!boardResult.rows.length) {
      return null;
    }

    const board = boardResult.rows[0];

    const columnsResult = await pool.query(
      'SELECT id, board_id, name, position, created_at FROM columns WHERE board_id = $1 ORDER BY position ASC',
      [boardId]
    );

    console.log('Columns result:', columnsResult.rows);

    const columnIds = columnsResult.rows.map((column) => column.id);

    let tasksByColumn = {};
    if (columnIds.length > 0) {
      const tasksResult = await pool.query(
        'SELECT id, column_id, title, description, position, created_at FROM tasks WHERE column_id = ANY($1) ORDER BY position ASC',
        [columnIds]
      );

      console.log('Tasks result:', tasksResult.rows);

      tasksByColumn = tasksResult.rows.reduce((acc, task) => {
        const columnId = task.column_id;
        if (!acc[columnId]) {
          acc[columnId] = [];
        }
        acc[columnId].push(task);
        return acc;
      }, {});
    }

    board.columns = columnsResult.rows.map((column) => ({
      ...column,
      tasks: tasksByColumn[column.id] || []
    }));

    console.log('Final board:', board);
    return board;
  }
}

module.exports = Board;
