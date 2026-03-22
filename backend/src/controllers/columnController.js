const Column = require('../models/Column');
const Board = require('../models/Board');

const createColumn = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { name } = req.body;

    const board = await Board.getById(boardId);
    if (!board || board.user_id !== req.userId) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Get highest position
    const columns = await Column.getByBoardId(boardId);
    const position = columns.length;

    const column = await Column.create(boardId, name, position);
    res.status(201).json(column);
  } catch (error) {
    console.error('Error creating column:', error);
    res.status(500).json({ error: 'Failed to create column' });
  }
};

const updateColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { name } = req.body;

    const column = await Column.getById(columnId);
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    // Verify user owns this board
    const board = await Board.getById(column.board_id);
    if (board.user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await Column.update(columnId, name);
    res.json(updated);
  } catch (error) {
    console.error('Error updating column:', error);
    res.status(500).json({ error: 'Failed to update column' });
  }
};

const deleteColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    const column = await Column.getById(columnId);
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    // Verify user owns this board
    const board = await Board.getById(column.board_id);
    if (board.user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Column.delete(columnId);
    res.json({ message: 'Column deleted' });
  } catch (error) {
    console.error('Error deleting column:', error);
    res.status(500).json({ error: 'Failed to delete column' });
  }
};

module.exports = {
  createColumn,
  updateColumn,
  deleteColumn
};
