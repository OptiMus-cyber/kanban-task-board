import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeSwitcher.css';

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-switcher">
      <button
        className={`theme-btn ${theme === 'beige' ? 'active' : ''}`}
        onClick={() => toggleTheme('beige')}
        title="Beige Theme (Default)"
      >
        <span className="theme-icon beige-icon">◇</span>
        <span className="theme-label">Beige</span>
      </button>
      <button
        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => toggleTheme('dark')}
        title="Dark Theme"
      >
        <span className="theme-icon dark-icon">◆</span>
        <span className="theme-label">Dark</span>
      </button>
      <button
        className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
        onClick={() => toggleTheme('light')}
        title="Light Theme"
      >
        <span className="theme-icon light-icon">◇</span>
        <span className="theme-label">Light</span>
      </button>
    </div>
  );
}

export default ThemeSwitcher;
