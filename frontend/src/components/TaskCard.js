import React, { useState } from 'react';
import './TaskCard.css';

function TaskCard({ task, onDragStart, onDelete, onUpdate }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');

  const handleSave = () => {
    onUpdate(task.id, editTitle, editDesc);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="task-card editing">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Task title"
          autoFocus
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="Task description"
        />
        <div className="edit-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="task-card"
      draggable
      onDragStart={onDragStart}
    >
      <div className="task-header">
        <h4 onClick={() => setEditing(true)}>{task.title}</h4>
        <button
          className="btn-delete"
          onClick={() => setShowDeleteConfirm(true)}
          title="Delete task"
        >
          ×
        </button>
      </div>

      {task.description && <p onClick={() => setEditing(true)}>{task.description}</p>}

      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Delete this task?</p>
          <div className="confirm-actions">
            <button
              className="btn-confirm btn-danger"
              onClick={() => {
                onDelete();
                setShowDeleteConfirm(false);
              }}
            >
              Delete
            </button>
            <button
              className="btn-confirm btn-secondary"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
