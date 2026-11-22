import { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { palette, type ColorTokens, type ThemeMode } from './tokens';
import { useThemePreference } from './useThemePreference';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ColorTokens;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const preference = useThemePreference((state) => state.preference);

  const mode: ThemeMode =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, colors: palette[mode] }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme precisa estar dentro de <ThemeProvider>');
  return ctx;
}
