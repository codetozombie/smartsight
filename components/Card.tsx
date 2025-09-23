/**
 * SmartSight Card Component
 * Reusable card container with consistent styling
 */

import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  style,
}) => {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        styles[
          `padding${padding.charAt(0).toUpperCase() + padding.slice(1)}` as keyof typeof styles
        ],
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.white,
  },
  default: {
    backgroundColor: Colors.white,
  },
  elevated: {
    backgroundColor: Colors.white,
    ...Shadows.medium,
  },
  outlined: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: Spacing.small,
  },
  paddingMedium: {
    padding: Spacing.medium,
  },
  paddingLarge: {
    padding: Spacing.large,
  },
});

export default Card;