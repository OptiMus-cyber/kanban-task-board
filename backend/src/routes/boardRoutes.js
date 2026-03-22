const express = require('express');
const {
  getBoards,
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard
} = require('../controllers/boardController');
const { validateBoardCreate } = require('../middleware/validation');
const { createColumn, updateColumn, deleteColumn } = require('../controllers/columnController');
const { validateColumnCreate, validateColumnUpdate } = require('../middleware/validation');

const router = express.Router();

// Board routes
router.get('/', getBoards);
router.post('/', validateBoardCreate, createBoard);
router.get('/:boardId', getBoard);
router.put('/:boardId', validateBoardCreate, updateBoard);
router.delete('/:boardId', deleteBoard);

// Column routes - place specific routes before parameterized routes
router.put('/columns/:columnId', validateColumnUpdate, updateColumn);
router.delete('/columns/:columnId', deleteColumn);
router.post('/:boardId/columns', validateColumnCreate, createColumn);

module.exports = router;
