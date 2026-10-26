import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme Context
 * 
 * Provides:
 * - `theme`: 'light' | 'dark'
 * - `toggleTheme`: () => void
 * - `accentColor`: current accent theme ('indigo' | 'emerald' | 'violet' | 'amber')
 * - `setAccentColor`: (color) => void
 */
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('playground-theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const [accentColor, setAccentColor] = useState('indigo');

  useEffect(() => {
    localStorage.setItem('playground-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    toggleTheme,
    accentColor,
    setAccentColor,
    isDark: theme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to safely consume ThemeContext.
 * Throws an informative error if used outside a ThemeProvider.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>. Check your component tree.');
  }
  return context;
}

export default ThemeContext;
