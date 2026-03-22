import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as api from '../services/api';

export const useTasks = (boardId) => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTask = useCallback(
    async (columnId, title, description = '') => {
      if (!token) return;
      try {
        setError(null);
        const data = await api.createTask(columnId, title, description, token);
        setTasks([...tasks, data]);
        return data;
      } catch (err) {
        const message = err.response?.data?.error || err.message || 'Failed to create task';
        setError(message);
        console.error('Error creating task:', err);
      }
    },
    [token, tasks]
  );

  const updateTask = useCallback(
    async (taskId, title, description) => {
      if (!token) return;
      try {
        setError(null);
        const data = await api.updateTask(taskId, title, description, token);
        setTasks(tasks.map((t) => (t.id === taskId ? data : t)));
        return data;
      } catch (err) {
        const message = err.response?.data?.error || err.message || 'Failed to update task';
        setError(message);
        console.error('Error updating task:', err);
      }
    },
    [token, tasks]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      if (!token) return;
      try {
        setError(null);
        await api.deleteTask(taskId, token);
        setTasks(tasks.filter((t) => t.id !== taskId));
      } catch (err) {
        const message = err.response?.data?.error || err.message || 'Failed to delete task';
        setError(message);
        console.error('Error deleting task:', err);
      }
    },
    [token, tasks]
  );

  const moveTask = useCallback(
    async (taskId, columnId, position) => {
      if (!token) return;
      try {
        setError(null);
        const data = await api.moveTask(taskId, columnId, position, token);
        setTasks(tasks.map((t) => (t.id === taskId ? data : t)));
        return data;
      } catch (err) {
        const message = err.response?.data?.error || err.message || 'Failed to move task';
        setError(message);
        console.error('Error moving task:', err);
      }
    },
    [token, tasks]
  );

  return {
    tasks,
    setTasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    moveTask
  };
};
