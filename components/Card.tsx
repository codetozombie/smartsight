/**
 * SmartSight Card Component
 * Enhanced with better visual hierarchy and accessibility
 */

import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'large',
  style,
}) => {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}` as keyof typeof styles],
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.xlarge,
    backgroundColor: Colors.white,
  },
  default: {
    backgroundColor: Colors.white,
    ...Shadows.small,
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
  flat: {
    backgroundColor: Colors.backgroundSecondary,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: Spacing.medium,
  },
  paddingMedium: {
    padding: Spacing.large,
  },
  paddingLarge: {
    padding: Spacing.xlarge,
  },
});

export default Card;