import { createContext, useContext, useEffect, useState } from 'react';
import { changeTheme, type Theme } from '../lib/theme';

type ThemeMode = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultThemes?: {
    theme?: keyof typeof Theme;
    themeMode?: ThemeMode;
  };
  storageKey?: string;
};

type ThemeProviderState = {
  themes: {
    theme?: keyof typeof Theme;
    themeMode?: ThemeMode;
  };
  setThemes: (themes: ThemeProviderState['themes']) => void;
};

const initialState: ThemeProviderState = {
  themes: {
    theme: 'Default',
    themeMode: 'system'
  },
  setThemes: () => null
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultThemes = {
    theme: 'Default',
    themeMode: 'system'
  },
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [themes, setThemes] = useState<ThemeProviderState['themes']>(() => {
    try {
      return localStorage.getItem(storageKey)
        ? JSON.parse(localStorage.getItem(storageKey) as string)
        : defaultThemes;
    } catch (error) {
      console.error('Error parsing theme from localStorage:', error);
      return defaultThemes;
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (themes.themeMode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(themes.themeMode as ThemeMode);
  }, [themes.themeMode]);

  useEffect(() => {
    changeTheme(themes.theme as keyof typeof Theme);
  }, [themes.theme]);

  const value = {
    themes,
    setThemes: (themes: ThemeProviderState['themes']) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(themes));
        setThemes(themes);
      } catch (error) {
        console.error('Error setting theme to localStorage:', error);
      }
    }
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
