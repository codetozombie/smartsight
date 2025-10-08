/**
 * SmartSight Button Component
 * Reusable button with consistent styling and multiple variants
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  Animated,
} from 'react-native';

// Define inline colors if theme file doesn't exist yet
const Colors = {
  primary: '#0891b2',
  white: '#ffffff',
  background: '#f9fafb',
  backgroundSecondary: '#f3f4f6',
  error: '#dc2626',
  text: '#111827',
  textTertiary: '#6b7280',
  disabledText: '#9ca3af',
  black: '#000000',
};

const Spacing = {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 20,
};

const Typography = {
  sizes: { small: 14, medium: 16, large: 18 },
  weights: { semibold: '600' as const },
};

const BorderRadius = { large: 12 };

const Shadows = {
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
};

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  backgroundColor?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
  backgroundColor,
  fullWidth = false,
  leftIcon,
  rightIcon,
}) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const isDisabled = disabled || loading;

  const buttonStyle: ViewStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <Animated.View style={buttonStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[
          styles.base,
          styles[size],
          styles[variant],
          backgroundColor && variant !== 'outline' && variant !== 'ghost' 
            ? { backgroundColor } 
            : {},
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          style,
        ]}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white}
            style={styles.loader}
          />
        )}
        
        {!loading && leftIcon && <>{leftIcon}</>}
        
        <Text
          style={[
            styles.baseText,
            styles[`${size}Text` as keyof typeof styles],
            styles[`${variant}Text` as keyof typeof styles],
            isDisabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
        
        {!loading && rightIcon && <>{rightIcon}</>}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.large,
    paddingHorizontal: Spacing.large,
    minHeight: 44,
    gap: Spacing.small,
  },
  
  fullWidth: {
    width: '100%',
  },
  
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
  
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.medium,
  },
  secondary: {
    backgroundColor: Colors.backgroundSecondary,
    ...Shadows.small,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.error,
    ...Shadows.medium,
  },
  
  disabled: {
    opacity: 0.5,
  },
  
  baseText: {
    fontWeight: Typography.weights.semibold,
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
  },
  dangerText: {
    color: Colors.white,
  },
  disabledText: {
    color: Colors.disabledText,
  },
  
  loader: {
    marginRight: Spacing.small,
  },
});

export default Button;