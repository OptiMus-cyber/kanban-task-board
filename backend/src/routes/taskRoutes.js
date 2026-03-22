const express = require('express');
const { createTask, updateTask, deleteTask, moveTask } = require('../controllers/taskController');
const { validateTaskCreate, validateTaskUpdate, validateTaskReorder } = require('../middleware/validation');

const router = express.Router();

// Task routes
router.post('/columns/:columnId/tasks', validateTaskCreate, createTask);
router.put('/:taskId', validateTaskUpdate, updateTask);
router.delete('/:taskId', deleteTask);
router.patch('/:taskId/move', validateTaskReorder, moveTask);

module.exports = router;
