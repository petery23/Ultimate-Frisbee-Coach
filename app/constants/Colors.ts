/**
 * Color definitions for light and dark mode.
 */

const tintColorLight = '#16a34a'; // Green color from your button
const tintColorDark = '#22c55e'; // Lighter green for dark mode

export const Colors = {
  light: {
    text: '#111827',
    background: '#ffffff',
    tint: tintColorLight,
    secondary: '#666666',
    accent: '#16a34a',
    cardBackground: '#f9fafb',
    border: '#e5e7eb',
    error: '#dc2626',
    success: '#16a34a',
    warning: '#eab308',
  },
  dark: {
    text: '#f3f4f6',
    background: '#111827',
    tint: tintColorDark,
    secondary: '#9ca3af',
    accent: '#22c55e',
    cardBackground: '#1f2937',
    border: '#374151',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#facc15',
  },
};
