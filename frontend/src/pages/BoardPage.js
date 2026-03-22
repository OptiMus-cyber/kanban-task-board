import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBoard } from '../hooks/useBoard';
import { useTasks } from '../hooks/useTasks';
import BoardHeader from '../components/BoardHeader';
import BoardView from '../components/BoardView';
import './BoardPage.css';

function BoardPage() {
  const { logout } = useAuth();
  const { boards, currentBoard, fetchBoards, fetchBoard, createBoard, setCurrentBoard, loading: boardsLoading, error: boardError } = useBoard();
  const { tasks, setTasks, error: taskError } = useTasks(currentBoard?.id);
  const [showNewBoardForm, setShowNewBoardForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  useEffect(() => {
    const loadBoard = async () => {
      if (boards.length > 0 && !currentBoard) {
        await fetchBoard(boards[0].id);
      }
    };
    loadBoard();
  }, [boards, currentBoard, fetchBoard]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (newBoardName.trim()) {
      await createBoard(newBoardName);
      setNewBoardName('');
      setShowNewBoardForm(false);
    }
  };

  const handleSelectBoard = (board) => {
    setCurrentBoard(board);
    fetchBoard(board.id).then((boardData) => {
      if (boardData?.columns) {
        // Flatten tasks from all columns for easier access
        const allTasks = [];
        boardData.columns.forEach((column) => {
          // Tasks will be fetched from the API
        });
        setTasks([]);
      }
    });
  };

  if (boardsLoading) {
    return <div className="board-page loading">Loading...</div>;
  }

  return (
    <div className="board-page">
      {(boardError || taskError) && (
        <div className="error-banner">
          {boardError && <p>{boardError}</p>}
          {taskError && <p>{taskError}</p>}
        </div>
      )}
      <BoardHeader onLogout={logout} boards={boards} currentBoard={currentBoard} onSelectBoard={handleSelectBoard} />

      {boards.length === 0 ? (
        <div className="empty-state">
          <h2>No boards yet</h2>
          <p>Create your first board to get started</p>
          <button onClick={() => setShowNewBoardForm(true)} className="btn btn-primary">
            Create Board
          </button>
        </div>
      ) : (
        <>
          {showNewBoardForm && (
            <div className="new-board-form-container">
              <form onSubmit={handleCreateBoard} className="new-board-form">
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="Enter board name"
                  autoFocus
                />
                <div className="form-actions">
                  <button type="submit" className="btn btn-sm btn-primary">
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewBoardForm(false)}
                    className="btn btn-sm btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {!showNewBoardForm && (
            <button onClick={() => setShowNewBoardForm(true)} className="btn btn-outline">
              + New Board
            </button>
          )}

          {currentBoard && <BoardView board={currentBoard} />}
        </>
      )}
    </div>
  );
}

export default BoardPage;
