import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
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
  const isSolid = variant !== 'ghost' && variant !== 'secondary';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.78}
      style={[
        styles.base,
        { backgroundColor: v.bg },
        v.border ? { borderWidth: 1.5, borderColor: v.border } : undefined,
        isSolid && !disabled && styles.shadow,
        isSolid && !disabled && { shadowColor: v.bg },
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
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  small: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: radius.md,
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
    letterSpacing: 0.2,
  },
  smallText: {
    fontSize: 13,
  },
});
