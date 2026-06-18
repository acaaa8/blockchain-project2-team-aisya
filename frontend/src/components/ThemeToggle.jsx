import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button 
      className="theme-toggle glass-panel" 
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
