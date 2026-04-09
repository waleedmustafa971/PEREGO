import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, fontSize } from '@/lib/theme';
import Button from './Button';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionLabel && onAction && (
        <View style={styles.btnWrap}>
          <Button title={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: { fontSize: 36 },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSize.xl,
    color: colors.night,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSize.md - 1,
    color: colors.gray400,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  btnWrap: { width: '100%' },
});
