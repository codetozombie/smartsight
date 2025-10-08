/**
 * SmartSight Button Component
 * Reusable button with consistent styling and multiple variants
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  backgroundColor?: string; // Add this prop
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  backgroundColor, // Add this
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = styles.base;
    const sizeStyle = styles[size];
    const variantStyle = styles[variant];
    const disabledStyle = disabled ? styles.disabled : {};

    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
      ...disabledStyle,
      ...(backgroundColor && { backgroundColor }), // Override background color
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle = styles.baseText;
    const sizeTextStyle = styles[`${size}Text` as keyof typeof styles];
    const variantTextStyle = styles[`${variant}Text` as keyof typeof styles];

    return {
      ...baseTextStyle,
      ...sizeTextStyle,
      ...variantTextStyle,
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.white : Colors.primary}
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Sizes
  small: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: Spacing.xlarge,
    paddingVertical: Spacing.large,
    minHeight: 52,
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.backgroundSecondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8, // Reduce padding for ghost buttons
  },
  
  // Text styles
  baseText: {
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
  smallText: {
    fontSize: Typography.sizes.small,
  },
  mediumText: {
    fontSize: Typography.sizes.medium,
  },
  largeText: {
    fontSize: Typography.sizes.large,
  },
  
  // Variant text styles
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.text,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
    fontSize: 14, // Smaller font for ghost buttons
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
});

export default Button;