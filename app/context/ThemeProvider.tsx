import { ReactNode } from 'react';
import ThemeClientProvider from './ThemeClientProvider';
import type { Theme } from '@/types';

export default function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme?: Partial<Theme>;
}) {
  return (
    <ThemeClientProvider initialTheme={initialTheme}>
      {children}
    </ThemeClientProvider>
  );
}