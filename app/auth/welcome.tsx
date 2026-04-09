import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, fontSize, spacing } from '@/lib/theme';
import Button from '@/components/ui/Button';

const FEATURES = [
  { icon: '🛡️', text: 'Verified travelers only' },
  { icon: '🔐', text: 'Escrow-protected payments' },
  { icon: '📍', text: 'Real-time package tracking' },
];

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.teal} />
      <View style={styles.hero}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoIcon}>🦅</Text>
        </View>
        <Text style={styles.name}>perego</Text>
        <Text style={styles.tagline}>DELIVER WITH TRUST</Text>
        <Text style={styles.sub}>
          Ship personal items through verified travelers.{'\n'}Cheaper, faster, powered by community.
        </Text>
        <View style={styles.features}>
          {FEATURES.map(f => (
            <View key={f.text} style={styles.featureRow}>
              <View style={styles.featureIconWrap}>
                <Text style={{ fontSize: 14 }}>{f.icon}</Text>
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button title="Log In" onPress={() => router.push('/auth/login')} full />
        <Button
          title="Create Account"
          onPress={() => router.push('/auth/register')}
          variant="ghost"
          full
          style={styles.ghostBtn}
        />
        <Text style={styles.terms}>
          By continuing you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' & '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.teal },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoIcon: { fontSize: 40 },
  name: {
    fontFamily: fonts.headingBold,
    fontSize: 42,
    color: colors.white,
    letterSpacing: -1.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 4,
    fontFamily: fonts.bodySemiBold,
    marginBottom: 20,
  },
  sub: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
  },
  features: { gap: 12, alignSelf: 'stretch' },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  featureIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: fontSize.md - 1,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: fonts.bodyMedium,
  },
  actions: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.xl,
    paddingBottom: 28,
    gap: 10,
  },
  ghostBtn: {
    borderColor: colors.gray200,
  },
  terms: {
    textAlign: 'center',
    fontSize: fontSize.xs + 1,
    color: colors.gray400,
    marginTop: 4,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.teal,
    fontFamily: fonts.bodySemiBold,
  },
});
