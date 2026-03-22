const Board = require('../models/Board');
const Column = require('../models/Column');

const getBoards = async (req, res) => {
  try {
    const boards = await Board.getByUserId(req.userId);
    res.json(boards);
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
};

const createBoard = async (req, res) => {
  try {
    const { name = 'My Board' } = req.body;
    const board = await Board.create(req.userId, name);

    // Create default columns
    await Column.create(board.id, 'To Do', 0);
    await Column.create(board.id, 'In Progress', 1);
    await Column.create(board.id, 'Done', 2);

    // Fetch board with columns
    const boardWithColumns = await Board.getBoardWithColumns(board.id);
    res.status(201).json(boardWithColumns);
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
};

const getBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.getById(boardId);

    if (!board || board.user_id !== req.userId) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const boardWithColumns = await Board.getBoardWithColumns(boardId);
    res.json(boardWithColumns);
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
};

const updateBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { name } = req.body;

    const board = await Board.getById(boardId);
    if (!board || board.user_id !== req.userId) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const updated = await Board.update(boardId, name);
    res.json(updated);
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ error: 'Failed to update board' });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await Board.getById(boardId);
    if (!board || board.user_id !== req.userId) {
      return res.status(404).json({ error: 'Board not found' });
    }

    await Board.delete(boardId);
    res.json({ message: 'Board deleted' });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
};

module.exports = {
  getBoards,
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard
};
