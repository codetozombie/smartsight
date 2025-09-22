import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import colors from '../utils/colors';

export interface ButtonProps {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  color?: string; // override background color
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, color, style, textStyle }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: color ?? colors.primary },
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;