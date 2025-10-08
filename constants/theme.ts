/**
 * SmartSight App Theme Configuration
 * Colors, typography, spacing, and design system constants
 */

import { Platform } from 'react-native';

export const Colors = {
  // Primary colors
  primary: '#4A90E2',
  primaryLight: '#E3F2FD',
  primaryDark: '#1565C0',

  // Status colors
  success: '#4CAF50',
  successLight: '#E8F5E9',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  warningDark: '#E65100',
  error: '#F44336',
  errorLight: '#FFEBEE',
  errorDark: '#C62828',
  info: '#2196F3',
  infoLight: '#E3F2FD',

  // Text colors
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',

  // Background colors
  background: '#F5F5F5',
  backgroundSecondary: '#EEEEEE',
  white: '#FFFFFF',
  black: '#000000',

  // UI colors
  border: '#E0E0E0',
  disabled: '#BDBDBD',
  placeholder: '#9E9E9E',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export const Spacing = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 28, // ✅ Added
  extraLarge: 32,
  huge: 48,
};

export const Typography = {
  sizes: {
    tiny: 10,
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 20,
    xxlarge: 24,
    xxxlarge: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  // ✅ Added lineHeights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

export const BorderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  round: 999,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
