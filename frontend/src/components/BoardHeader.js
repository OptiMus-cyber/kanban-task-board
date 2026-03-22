import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import './BoardHeader.css';

function BoardHeader({ onLogout, boards, currentBoard, onSelectBoard }) {
  return (
    <header className="board-header">
      <div className="header-left">
        <h1>Kanban Board</h1>
        {currentBoard && <span className="current-board-name">{currentBoard.name}</span>}
      </div>

      <div className="header-right">
        <ThemeSwitcher />
        {boards.length > 1 && (
          <select
            value={currentBoard?.id || ''}
            onChange={(e) => {
              const board = boards.find((b) => b.id === parseInt(e.target.value));
              if (board) onSelectBoard(board);
            }}
            className="board-selector"
          >
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </select>
        )}
        <button onClick={onLogout} className="btn btn-logout">
          Logout
        </button>
      </div>
    </header>
  );
}

export default BoardHeader;
