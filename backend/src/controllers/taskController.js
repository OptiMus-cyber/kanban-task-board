const Task = require('../models/Task');
const Column = require('../models/Column');
const Board = require('../models/Board');
const pool = require('../config/database');

const createTask = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title, description = '' } = req.body;

    const column = await Column.getById(columnId);
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    // Verify user owns this board
    const board = await Board.getById(column.board_id);
    if (board.user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Get position (number of tasks in column)
    const tasks = await Task.getByColumnId(columnId);
    const position = tasks.length;

    const task = await Task.create(columnId, title, description, position);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description } = req.body;

    const task = await Task.getById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const column = await Column.getById(task.column_id);
    const board = await Board.getById(column.board_id);

    if (board.user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await Task.update(taskId, title, description);
    res.json(updated);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.getById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const column = await Column.getById(task.column_id);
    const board = await Board.getById(column.board_id);

    if (board.user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Task.delete(taskId);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

const moveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { columnId, position } = req.body;

    const task = await Task.getById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const sourceColumn = await Column.getById(task.column_id);
    const targetColumn = await Column.getById(columnId);
    if (!targetColumn) {
      return res.status(404).json({ error: 'Target column not found' });
    }

    const board = await Board.getById(sourceColumn.board_id);
    if (board.user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const oldColumnId = task.column_id;
    const oldPosition = task.position;

    if (oldColumnId === parseInt(columnId)) {
      // Same column
      if (position < oldPosition) {
        // Move up: shift tasks from position to oldPosition-1 down by 1
        await pool.query(
          'UPDATE tasks SET position = position + 1 WHERE column_id = $1 AND position >= $2 AND position < $3',
          [columnId, position, oldPosition]
        );
      } else if (position > oldPosition) {
        // Move down: shift tasks from oldPosition+1 to position up by 1
        await pool.query(
          'UPDATE tasks SET position = position - 1 WHERE column_id = $1 AND position > $2 AND position <= $3',
          [columnId, oldPosition, position]
        );
      }
      // Update the task's position
      await pool.query('UPDATE tasks SET position = $1 WHERE id = $2', [position, taskId]);
    } else {
      // Different column
      // Shift old column from oldPosition+1 to end down by 1
      await pool.query(
        'UPDATE tasks SET position = position - 1 WHERE column_id = $1 AND position > $2',
        [oldColumnId, oldPosition]
      );
      // Shift new column from position to end up by 1
      await pool.query(
        'UPDATE tasks SET position = position + 1 WHERE column_id = $1 AND position >= $2',
        [columnId, position]
      );
      // Update the task's column and position
      await pool.query('UPDATE tasks SET column_id = $1, position = $2 WHERE id = $3', [columnId, position, taskId]);
    }

    const updated = await Task.getById(taskId);
    res.json(updated);
  } catch (error) {
    console.error('Error moving task:', error);
    res.status(500).json({ error: 'Failed to move task' });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  moveTask
};
