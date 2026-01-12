/**
 * Theme Colors for Light and Dark modes
 * Used throughout the app for consistent theming
 */

export const Colors = {
  light: {
    // Main background colors
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceVariant: '#f1f5f9',
    
    // Text colors
    text: '#1e293b',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    
    // Primary colors
    primary: '#6366f1',
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
    
    // Accent colors
    accent: '#10b981',
    accentLight: '#34d399',
    accentDark: '#059669',
    
    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // UI Elements
    border: '#e2e8f0',
    divider: '#cbd5e1',
    shadow: '#000000',
    
    // Card backgrounds
    cardBackground: '#ffffff',
    cardBackgroundHover: '#f8fafc',
    
    // Gradient overlays
    gradientOverlay: 'rgba(0, 0, 0, 0.3)',
    whiteOverlay: 'rgba(255, 255, 255, 0.9)',
    transparentWhite: 'rgba(255, 255, 255, 0.2)',
  },
  dark: {
    // Main background colors
    background: '#0f172a',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    
    // Text colors
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    
    // Primary colors
    primary: '#818cf8',
    primaryLight: '#a5b4fc',
    primaryDark: '#6366f1',
    
    // Accent colors
    accent: '#34d399',
    accentLight: '#6ee7b7',
    accentDark: '#10b981',
    
    // Status colors
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    // UI Elements
    border: '#334155',
    divider: '#475569',
    shadow: '#000000',
    
    // Card backgrounds
    cardBackground: '#1e293b',
    cardBackgroundHover: '#334155',
    
    // Gradient overlays
    gradientOverlay: 'rgba(0, 0, 0, 0.5)',
    whiteOverlay: 'rgba(15, 23, 42, 0.95)',
    transparentWhite: 'rgba(30, 41, 59, 0.4)',
  },
};

export type Theme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;

