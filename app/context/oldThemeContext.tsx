'use client';

import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import type { Theme } from '../../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  themeStyles: React.CSSProperties;
  loading: boolean;

  // 🔥 NEW
  getTheme: () => Promise<void>;
  updateTheme: (theme: Theme) => Promise<boolean>;
}

const defaultTheme: Theme = {
  primaryColor: '#6366f1',
  secondaryColor: '#ec4899',
  accentColor: '#10b981',
  base100Color: '#ffffff',
  textPrimaryColor: '#1f2937',
  textSecondaryColor: '#6b7280',
  headerText: 'Lacan - Mental Health & Wellness',
  footerText: '© 2026. All rights reserved.',
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [loading, setLoading] = useState(true);

  // =========================
  // 1️⃣ Fetch theme from DB
  // =========================
  const getTheme = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/theme', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch theme');
      }

      const dbTheme: Partial<Theme> = await response.json();

      setTheme({
        ...defaultTheme,
        ...dbTheme,
      });
    } catch (error) {
      console.error('Theme fetch failed, using defaults:', error);
      setTheme(defaultTheme);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load theme on mount
  useEffect(() => {
    getTheme();
  }, [getTheme]);

  // =========================
  // 2️⃣ Update theme in DB
  // =========================
  const updateTheme = useCallback(async (updatedTheme: Theme) => {
    try {
      const response = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTheme),
      });

      if (!response.ok) {
        throw new Error('Failed to update theme');
      }

      const savedTheme: Partial<Theme> = await response.json();

      // 🔥 Sync local state with DB result
      setTheme({
        ...defaultTheme,
        ...savedTheme,
      });

      return true;
    } catch (error) {
      console.error('Update theme failed:', error);
      return false;
    }
  }, []);

  // =========================
  // 3️⃣ CSS Variables
  // =========================
  const themeStyles = useMemo<React.CSSProperties>(
    () =>
      ({
        '--primary-color': theme.primaryColor,
        '--secondary-color': theme.secondaryColor,
        '--accent-color': theme.accentColor,
        '--base-100-color': theme.base100Color,
        '--text-primary-color': theme.textPrimaryColor,
        '--text-secondary-color': theme.textSecondaryColor,
      } as React.CSSProperties),
    [theme]
  );

  // =========================
  // 4️⃣ Apply globally
  // =========================
  useEffect(() => {
    if (loading) return;

    const root = document.documentElement;

    Object.entries(themeStyles).forEach(([key, value]) => {
      root.style.setProperty(key, String(value));
    });
  }, [themeStyles, loading]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themeStyles,
        loading,
        getTheme,
        updateTheme,
      }}
    >
      <div style={themeStyles}>
      {children}
      </div>
    </ThemeContext.Provider>
  );
};
