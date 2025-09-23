import { Colors, Typography } from '@/constants/theme';
import { StyleSheet, Text, TextProps } from 'react-native';

export interface ThemedTextProps extends TextProps {
  type?: 'default' | 'title' | 'subtitle' | 'link' | 'caption';
  lightColor?: string;
  darkColor?: string;
}

export function ThemedText({
  style,
  type = 'default',
  lightColor,
  darkColor,
  ...rest
}: ThemedTextProps) {
  const color = lightColor ?? Colors.text;

  return (
    <Text
      style={[
        styles.default,
        type === 'title' && styles.title,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'caption' && styles.caption,
        { color },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.regular,
    lineHeight: Typography.lineHeights.medium,
  },
  title: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    lineHeight: Typography.lineHeights.large,
  },
  subtitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.medium,
    lineHeight: Typography.lineHeights.medium,
  },
  link: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.medium,
    color: Colors.primary,
  },
  caption: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.regular,
    color: Colors.textSecondary,
  },
});
