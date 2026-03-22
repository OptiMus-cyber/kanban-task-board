import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Column from './Column';
import * as api from '../services/api';
import './BoardView.css';

function BoardView({ board }) {
  const { token } = useAuth();
  const [columns, setColumns] = useState(board?.columns || []);
  const [showNewColumnForm, setShowNewColumnForm] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setColumns(board?.columns || []);
  }, [board?.columns]);

  const handleAddColumn = async (e) => {
    e.preventDefault();
    if (newColumnName.trim() && token) {
      try {
        setError(null);
        const newColumn = await api.createColumn(board.id, newColumnName, token);
        setColumns([...columns, newColumn]);
        setNewColumnName('');
        setShowNewColumnForm(false);
      } catch (error) {
        const message = error.response?.data?.error || error.message || 'Failed to create column';
        setError(message);
        console.error('Error creating column:', error);
      }
    }
  };

  const handleTasksChange = (columnId, newTasks) => {
    setColumns(columns.map(c => c.id === columnId ? { ...c, tasks: newTasks } : c));
  };

  const handleTaskMove = async () => {
    try {
      const updatedBoard = await api.getBoard(board.id, token);
      setColumns(updatedBoard.columns);
    } catch (error) {
      console.error('Error refetching board:', error);
    }
  };

  return (
    <div className="board-view">
      {error && <div className="error-banner">{error}</div>}
      <div className="columns-container">
        {columns && columns.length > 0 ? (
          columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              board={board}
              onColumnsChange={setColumns}
              onTasksChange={handleTasksChange}
              onTaskMove={handleTaskMove}
            />
          ))
        ) : (
          <div className="no-columns">
            <p>No columns yet</p>
          </div>
        )}

        {showNewColumnForm ? (
          <div className="new-column-form">
            <form onSubmit={handleAddColumn}>
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="Column name"
                autoFocus
              />
              <div className="form-actions">
                <button type="submit" className="btn-sm btn-primary">
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewColumnForm(false)}
                  className="btn-sm btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setShowNewColumnForm(true)}
            className="add-column-btn"
          >
            + Add Column
          </button>
        )}
      </div>
    </div>
  );
}

export default BoardView;
