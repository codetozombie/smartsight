/**
 * SmartSight Icon Component
 * Simple icon component using text symbols for basic icons
 */

import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

// Icon mapping - using Unicode symbols for simplicity
const ICON_MAP: Record<string, string> = {
  // Navigation
  'arrow-left': '←',
  'arrow-right': '→',
  'arrow-up': '↑',
  'arrow-down': '↓',
  'chevron-left': '‹',
  'chevron-right': '›',
  'chevron-up': '˄',
  'chevron-down': '˅',
  
  // Actions
  'camera': '📷',
  'photo': '🖼️',
  'save': '💾',
  'delete': '🗑️',
  'edit': '✏️',
  'share': '📤',
  'download': '⬇️',
  'upload': '⬆️',
  
  // Status
  'check': '✓',
  'check-circle': '✅',
  'close': '✕',
  'warning': '⚠️',
  'error': '❌',
  'info': 'ℹ️',
  'success': '✅',
  
  // Menu/Navigation
  'menu': '☰',
  'settings': '⚙️',
  'home': '🏠',
  'history': '📋',
  'profile': '👤',
  'help': '❓',
  
  // Eye health related
  'eye': '👁️',
  'health': '🏥',
  'scan': '🔍',
  'analyze': '🔬',
  'report': '📊',
  
  // Common
  'plus': '+',
  'minus': '−',
  'star': '⭐',
  'heart': '❤️',
  'bookmark': '🔖',
  'bell': '🔔',
  'mail': '📧',
  'phone': '📞',
  'lock': '🔒',
  'unlock': '🔓',
};

const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000', style }) => {
  const iconSymbol = ICON_MAP[name] || '?';

  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      {iconSymbol}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default Icon;