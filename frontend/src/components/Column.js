import React, { useState, useEffect, Fragment } from 'react';
import { useAuth } from '../hooks/useAuth';
import TaskCard from './TaskCard';
import * as api from '../services/api';
import './Column.css';

function Column({ column, board, onColumnsChange, onTasksChange, onTaskMove }) {
  const { token } = useAuth();
  const tasks = column.tasks || [];
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState(null);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingColumnName, setEditingColumnName] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  const [dragOverZone, setDragOverZone] = useState(null);

  useEffect(() => {
    setColumnName(column.name);
  }, [column.name]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTaskTitle.trim() && token) {
      try {
        setError(null);
        const newTask = await api.createTask(
          column.id,
          newTaskTitle,
          newTaskDescription,
          token
        );
        onTasksChange(column.id, [...tasks, newTask]);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setShowNewTaskForm(false);
      } catch (error) {
        const message = error.response?.data?.error || error.message || 'Failed to create task';
        setError(message);
        console.error('Error creating task:', error);
      }
    }
  };

  const handleUpdateTask = async (taskId, title, description) => {
    try {
      await api.updateTask(taskId, title, description, token);
      const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, title, description } : t);
      onTasksChange(column.id, updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleUpdateColumnName = async () => {
    if (columnName.trim() && columnName !== column.name && token) {
      try {
        setError(null);
        await api.updateColumn(column.id, columnName, token);
        setEditingColumnName(false);
      } catch (error) {
        const message = error.response?.data?.error || error.message || 'Failed to update column name';
        setError(message);
        console.error('Error updating column:', error);
        setColumnName(column.name);
      }
    } else {
      setColumnName(column.name);
      setEditingColumnName(false);
    }
  };

  const handleDeleteColumn = async () => {
    if (window.confirm(`Are you sure you want to delete the "${column.name}" column? This will also delete all tasks in it.`)) {
      try {
        setError(null);
        await api.deleteColumn(column.id, token);
        onColumnsChange(columns => columns.filter(c => c.id !== column.id));
      } catch (error) {
        const message = error.response?.data?.error || error.message || 'Failed to delete column';
        setError(message);
        console.error('Error deleting column:', error);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (token) {
      try {
        setError(null);
        await api.deleteTask(taskId, token);
        onTasksChange(column.id, tasks.filter((t) => t.id !== taskId));
      } catch (error) {
        const message = error.response?.data?.error || error.message || 'Failed to delete task';
        setError(message);
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ taskId: task.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, position) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverZone(position);
  };

  const handleDragLeave = () => {
    setDragOverZone(null);
  };

  const handleDrop = async (e, position) => {
    e.preventDefault();
    setDragOverZone(null);
    const droppedData = e.dataTransfer.getData('application/json');
    if (!droppedData) return;

    const { taskId } = JSON.parse(droppedData);
    if (!taskId || !token) return;

    try {
      setError(null);
      await api.moveTask(taskId, column.id, position, token);
      await onTaskMove();
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to move task';
      setError(message);
      console.error('Error moving task:', error);
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        {error && <div className="column-error">{error}</div>}
        {editingColumnName ? (
          <div className="column-name-edit">
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              onBlur={handleUpdateColumnName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUpdateColumnName();
                }
              }}
              autoFocus
            />
          </div>
        ) : (
          <h3 onClick={() => setEditingColumnName(true)} className="column-name">
            {column.name}
          </h3>
        )}
        <span className="task-count">{tasks.length}</span>
      </div>

      <div className="tasks-container">
        {tasks.length > 0 ? (
          <>
            {tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <div
                  className={`drop-zone ${dragOverZone === index ? 'drag-over' : ''}`}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                />
                <TaskCard
                  task={task}
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onUpdate={handleUpdateTask}
                />
              </React.Fragment>
            ))}
            <div
              className={`drop-zone ${dragOverZone === tasks.length ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, tasks.length)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, tasks.length)}
            />
          </>
        ) : (
          <div
            className="empty-column"
            onDragOver={(e) => handleDragOver(e, 0)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 0)}
          >
            <p>Drop tasks here</p>
          </div>
        )}
      </div>

      {showNewTaskForm && (
        <div className="new-task-form">
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
            />
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Description (optional)"
              rows="2"
            />
            <div className="form-actions">
              <button type="submit" className="btn-sm btn-primary">
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowNewTaskForm(false)}
                className="btn-sm btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showNewTaskForm && (
        <button
          onClick={() => setShowNewTaskForm(true)}
          className="add-task-btn"
        >
          + Add Task
        </button>
      )}
    </div>
  );
}

export default Column;
