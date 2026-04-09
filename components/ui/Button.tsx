import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, fonts } from '@/lib/theme';

type Variant = 'primary' | 'secondary' | 'orange' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  full?: boolean;
  small?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.teal, text: colors.white },
  secondary: { bg: colors.gray100, text: colors.night },
  orange: { bg: colors.orange, text: colors.white },
  ghost: { bg: 'transparent', text: colors.teal, border: colors.teal },
  danger: { bg: colors.red, text: colors.white },
};

export default function Button({ title, onPress, variant = 'primary', full, small, disabled, style }: ButtonProps) {
  const v = variantStyles[variant];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        { backgroundColor: v.bg },
        v.border ? { borderWidth: 1.5, borderColor: v.border } : undefined,
        small && styles.small,
        full && styles.full,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, { color: v.text }, small && styles.smallText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  full: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  smallText: {
    fontSize: 13,
  },
});
