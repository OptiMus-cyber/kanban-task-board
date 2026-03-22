import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as api from '../services/api';

export const useBoard = () => {
  const { token } = useAuth();
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBoards = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await api.getBoards(token);
      setBoards(data);
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to fetch boards';
      setError(message);
      console.error('Error fetching boards:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchBoard = useCallback(
    async (boardId) => {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        const data = await api.getBoard(boardId, token);
        setCurrentBoard(data);
        return data;
      } catch (err) {
        const message = err.response?.data?.error || err.message || 'Failed to fetch board';
        setError(message);
        console.error('Error fetching board:', err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const createBoard = useCallback(
    async (name) => {
      if (!token) return;
      try {
        setError(null);
        const data = await api.createBoard(name, token);
        setBoards([data, ...boards]);
        return data;
      } catch (err) {
        const message = err.response?.data?.error || err.message || 'Failed to create board';
        setError(message);
        console.error('Error creating board:', err);
      }
    },
    [token, boards]
  );

  const updateBoard = useCallback(
    async (boardId, name) => {
      if (!token) return;
      try {
        setError(null);
        const data = await api.updateBoard(boardId, name, token);
        if (currentBoard?.id === boardId) {
          setCurrentBoard(data);
        }
        return data;
      } catch (err) {
        const message = err.response?.data?.error || err.message || 'Failed to update board';
        setError(message);
        console.error('Error updating board:', err);
      }
    },
    [token, currentBoard]
  );

  const deleteBoard = useCallback(
    async (boardId) => {
      if (!token) return;
      try {
        setError(null);
        await api.deleteBoard(boardId, token);
        setBoards(boards.filter((b) => b.id !== boardId));
      } catch (err) {
        const message = err.response?.data?.error || err.message || 'Failed to delete board';
        setError(message);
        console.error('Error deleting board:', err);
      }
    },
    [token, boards]
  );

  return {
    boards,
    currentBoard,
    loading,
    error,
    fetchBoards,
    fetchBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    setCurrentBoard
  };
};
