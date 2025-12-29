import React, { createContext, useContext, useEffect, useState } from 'react';

export type AppTheme = 'off' | 'black' | 'dark' | 'beige' | 'light';

interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primaryLight: string;
  isDark: boolean;
}

const themeColorMap: Record<AppTheme, ThemeColors> = {
  off: {
    // Current bluish dark mode (slate colors)
    background: '#0F172A',      // slate900
    surface: '#1E293B',         // slate800
    surfaceSecondary: '#334155', // slate700
    border: '#334155',          // slate700
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',   // slate400
    textTertiary: '#64748B',    // slate500
    primary: '#6366F1',         // indigo500
    primaryLight: '#818CF8',    // indigo400
    isDark: true,
  },
  black: {
    // Pure black OLED-friendly theme
    background: '#000000',
    surface: '#121212',
    surfaceSecondary: '#1E1E1E',
    border: '#282828',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    textTertiary: '#787878',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    isDark: true,
  },
  dark: {
    // Neutral dark gray
    background: '#1C1C1E',
    surface: '#2C2C2E',
    surfaceSecondary: '#3A3A3C',
    border: '#3A3A3C',
    textPrimary: '#FFFFFF',
    textSecondary: '#AEAEB2',
    textTertiary: '#8E8E93',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    isDark: true,
  },
  beige: {
    // Warm paper-like beige theme
    background: '#FAF4E6',
    surface: '#FFFBF0',
    surfaceSecondary: '#F5EEDC',
    border: '#DCD2BE',
    textPrimary: '#2D2823',
    textSecondary: '#645A4B',
    textTertiary: '#8C826E',
    primary: '#4F46B4',
    primaryLight: '#635AC8',
    isDark: false,
  },
  light: {
    // Clean white light mode
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#64748B',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    isDark: false,
  },
};

interface ThemeContextValue {
  theme: AppTheme;
  colors: ThemeColors;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>('off');

  // Read theme from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get('theme') as AppTheme | null;
    if (urlTheme && themeColorMap[urlTheme]) {
      setTheme(urlTheme);
    }
  }, []);

  // Apply CSS variables when theme changes
  useEffect(() => {
    const colors = themeColorMap[theme];
    const root = document.documentElement;

    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-surface-secondary', colors.surfaceSecondary);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-text-primary', colors.textPrimary);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-text-tertiary', colors.textTertiary);
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-light', colors.primaryLight);

    // Update body background immediately
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.textPrimary;
  }, [theme]);

  const colors = themeColorMap[theme];

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper to get current theme colors without React context (for CSS-in-JS)
export function getThemeColors(theme: AppTheme): ThemeColors {
  return themeColorMap[theme];
}
