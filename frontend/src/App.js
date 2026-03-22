import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BoardPage from './pages/BoardPage';
import './App.css';

function App() {
  const { user, token } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');

  if (!token) {
    return currentPage === 'login' ? (
      <LoginPage onSwitchToRegister={() => setCurrentPage('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setCurrentPage('login')} />
    );
  }

  return <BoardPage />;
}

export default App;
