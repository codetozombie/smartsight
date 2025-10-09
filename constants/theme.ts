/**
 * SmartSight App Theme Configuration
 * Enhanced with HCI principles: contrast, hierarchy, accessibility
 */

import { Platform } from 'react-native';

export const Colors = {
  // Primary colors - WCAG AA compliant
  primary: '#0891b2', // Darker for better contrast
  primaryLight: '#06b6d4',
  primaryDark: '#0e7490',
  primaryPale: '#ecfeff',
  
  // Status colors with better contrast
  success: '#059669',
  successLight: '#d1fae5',
  warning: '#d97706',
  warningLight: '#fef3c7',
  warningDark: '#92400e',
  error: '#dc2626',
  errorLight: '#fee2e2',
  info: '#2563eb',
  infoLight: '#dbeafe',
  
  // Text colors with WCAG AAA compliance
  text: '#111827',
  textSecondary: '#4b5563',
  textTertiary: '#6b7280',
  textLight: '#9ca3af',
  textInverse: '#ffffff',
  
  // Background colors with subtle gradients
  background: '#f9fafb',
  backgroundSecondary: '#f3f4f6',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  white: '#ffffff',
  black: '#000000',
  
  // Border colors with subtle variations
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  borderDark: '#d1d5db',
  
  // Interactive states
  hover: '#f3f4f6',
  pressed: '#e5e7eb',
  disabled: '#d1d5db',
  disabledText: '#9ca3af',
  
  // Focus and accessibility
  focus: '#3b82f6',
  focusRing: 'rgba(59, 130, 246, 0.3)',
};

export const Typography = {
  // Font families
  fonts: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    semiBold: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
  },
  
  // Font sizes following 8pt grid
  sizes: {
    xxxsmall: 10,
    xxsmall: 11,
    xsmall: 12,
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 24,
    xxxlarge: 28,
    huge: 32,
    massive: 40,
  },
  
  // Font weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line heights for readability
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  // 8pt grid system
  xxxsmall: 2,
  xxsmall: 4,
  xsmall: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  extraLarge: 28,
  xxlarge: 32,
  xxxlarge: 40,
  huge: 48,
  massive: 64,
};

export const BorderRadius = {
  none: 0,
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  xxlarge: 20,
  full: 9999,
};

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  xlarge: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
};

export const Animation = {
  // Duration in milliseconds
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
  },
  
  // Easing functions
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

export const Layout = {
  // Screen padding
  screenPadding: Spacing.medium,
  cardPadding: Spacing.large,
  
  // Touch targets (minimum 44x44 for accessibility)
  minTouchTarget: 44,
  
  // Content width
  maxContentWidth: 600,
};
