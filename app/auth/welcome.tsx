import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing } from '@/lib/theme';
import Button from '@/components/ui/Button';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.icon}>🦅</Text>
        <Text style={styles.name}>perego</Text>
        <Text style={styles.sub}>Ship personal items through verified travelers. Cheaper, faster, powered by trust.</Text>
      </View>
      <View style={styles.actions}>
        <Button title="Log In" onPress={() => router.push('/auth/login')} full />
        <Button title="Create Account" onPress={() => router.push('/auth/register')} variant="ghost" full />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  hero: {
    flex: 1,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: { fontSize: 72, marginBottom: 16 },
  name: { fontFamily: fonts.headingBold, fontSize: 28, color: colors.white, marginBottom: 8 },
  sub: { fontSize: fontSize.md, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 22, maxWidth: 260 },
  actions: { padding: spacing.xl, paddingBottom: 40, gap: 10 },
});
