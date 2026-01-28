'use client';

import React, {
  createContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import type { Theme } from '@/types';

interface ThemeContextType {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  updateTheme: (theme: Theme) => Promise<boolean>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

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

export default function ThemeClientProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: Partial<Theme>;
}) {
  const [theme, setTheme] = useState<Theme>({
    ...defaultTheme,
    ...initialTheme,
  });

  const updateTheme = async (updatedTheme: Theme) => {
    try {
      const res = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTheme),
      });

      if (!res.ok) throw new Error();

      const savedTheme = await res.json();
      setTheme({ ...defaultTheme, ...savedTheme });
      return true;
    } catch {
      return false;
    }
  };

  const themeStyles = useMemo(
    () => ({
      '--primary-color': theme.primaryColor,
      '--secondary-color': theme.secondaryColor,
      '--accent-color': theme.accentColor,
      '--base-100-color': theme.base100Color,
      '--text-primary-color': theme.textPrimaryColor,
      '--text-secondary-color': theme.textSecondaryColor,
    }),
    [theme]
  );

  // 🔥 THIS IS THE CRITICAL PART
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeStyles).forEach(([key, value]) => {
      root.style.setProperty(key, String(value));
    });
  }, [themeStyles]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
