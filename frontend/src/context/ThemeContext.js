import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('day');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'day';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'day' ? 'night' : 'day';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const themeColors = {
    day: {
      bg: '#ffffff',
      bgSecondary: '#f7f8f9',
      text: '#0d0d0d',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      card: '#ffffff',
      accent: '#0d0d0d',
      accentLight: '#1f2937',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      shadow: 'rgba(0, 0, 0, 0.02)',
      shadowLg: 'rgba(0, 0, 0, 0.05)',
      glass: 'rgba(255, 255, 255, 0.95)',
      glassLight: 'rgba(255, 255, 255, 0.7)',
    },
    night: {
      bg: '#0d0d0d',
      bgSecondary: '#1a1a1a',
      text: '#ececf1',
      textSecondary: '#d1d5db',
      border: '#2d2d2d',
      card: '#1a1a1a',
      accent: '#ececf1',
      accentLight: '#d1d5db',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      shadow: 'rgba(0, 0, 0, 0.2)',
      shadowLg: 'rgba(0, 0, 0, 0.4)',
      glass: 'rgba(26, 26, 26, 0.95)',
      glassLight: 'rgba(26, 26, 26, 0.7)',
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
