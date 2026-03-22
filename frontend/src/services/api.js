import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL
});

const getErrorMessage = (error) => {
  if (error.response?.data?.error) return error.response.data.error;
  if (error.response?.data?.errors) {
    // express-validator format
    return error.response.data.errors.map((e) => e.msg).join(', ');
  }
  if (error.message) return error.message;
  return 'An unknown error occurred';
};

const throwApiError = (error) => {
  const message = getErrorMessage(error);
  const err = new Error(message);
  err.status = error.response?.status;
  throw err;
};

// Auth endpoints
export const register = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};

// Board endpoints
export const getBoards = async (token) => {
  try {
    const response = await apiClient.get('/boards', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};

export const createBoard = async (name, token) => {
  try {
    const response = await apiClient.post(
      '/boards',
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};

export const getBoard = async (boardId, token) => {
  try {
    const response = await apiClient.get(`/boards/${boardId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};

export const updateBoard = async (boardId, name, token) => {
  try {
    const response = await apiClient.put(
      `/boards/${boardId}`,
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};

export const deleteBoard = async (boardId, token) => {
  try {
    const response = await apiClient.delete(`/boards/${boardId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};

// Column endpoints
export const createColumn = async (boardId, name, token) => {
  try {
    const response = await apiClient.post(
      `/boards/${boardId}/columns`,
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};

export const updateColumn = async (columnId, name, token) => {
  try {
    const response = await apiClient.put(
      `/boards/columns/${columnId}`,
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};

export const deleteColumn = async (columnId, token) => {
  try {
    const response = await apiClient.delete(`/boards/columns/${columnId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};

// Task endpoints
export const createTask = async (columnId, title, description, token) => {
  try {
    const response = await apiClient.post(
      `/tasks/columns/${columnId}/tasks`,
      { title, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};

export const updateTask = async (taskId, title, description, token) => {
  try {
    const response = await apiClient.put(
      `/tasks/${taskId}`,
      { title, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};

export const deleteTask = async (taskId, token) => {
  try {
    const response = await apiClient.delete(`/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};

export const moveTask = async (taskId, columnId, position, token) => {
  try {
    const response = await apiClient.patch(
      `/tasks/${taskId}/move`,
      { columnId, position },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
};
