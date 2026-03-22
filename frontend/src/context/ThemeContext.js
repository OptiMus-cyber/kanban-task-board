import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('beige');

  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('kanban-theme');
    if (storedTheme && ['beige', 'dark', 'light'].includes(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);

  // Update localStorage and DOM when theme changes
  useEffect(() => {
    localStorage.setItem('kanban-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    if (['beige', 'dark', 'light'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
