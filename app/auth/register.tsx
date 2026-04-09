import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/ui/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterScreen() {
  const [step, setStep] = useState(0);
  const login = useAuthStore(s => s.login);

  const handleDone = () => {
    login();
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Create Account" />
      <View style={styles.progress}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.progressBar, i <= step && styles.progressActive]} />
        ))}
      </View>
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }}>
        {step === 0 && (
          <>
            <Text style={styles.heading}>Basic Info</Text>
            <Text style={styles.sub}>Tell us about yourself</Text>
            <Input label="Full Name" placeholder="Enter your name" icon="👤" />
            <Input label="Email" placeholder="you@email.com" icon="✉️" keyboardType="email-address" />
            <Input label="Phone" placeholder="+971 XX XXX XXXX" icon="📱" keyboardType="phone-pad" />
            <View style={styles.uploadRow}>
              <TouchableOpacity style={styles.uploadBox}>
                <Text style={styles.uploadIcon}>🪪</Text>
                <Text style={styles.uploadLabel}>Upload National ID</Text>
                <Text style={styles.uploadHint}>Front & Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadBox}>
                <Text style={styles.uploadIcon}>📘</Text>
                <Text style={styles.uploadLabel}>Upload Passport</Text>
                <Text style={styles.uploadHint}>Photo page</Text>
              </TouchableOpacity>
            </View>
            <Button title="Continue" onPress={() => setStep(1)} full />
          </>
        )}
        {step === 1 && (
          <>
            <Text style={styles.heading}>Selfie Verification</Text>
            <Text style={styles.sub}>Take a selfie so we can match it against your ID</Text>
            <TouchableOpacity style={styles.selfieBox}>
              <Text style={{ fontSize: 48, marginBottom: 10 }}>🤳</Text>
              <Text style={styles.uploadLabel}>Tap to take a selfie</Text>
              <Text style={[styles.uploadHint, { marginTop: 6, lineHeight: 18 }]}>
                Look straight at the camera in a well-lit area. No sunglasses or hats.
              </Text>
            </TouchableOpacity>
            <Button title="Continue" onPress={() => setStep(2)} full />
          </>
        )}
        {step === 2 && (
          <View style={styles.successWrap}>
            <View style={styles.successCircle}>
              <Text style={{ fontSize: 36 }}>🛡️</Text>
            </View>
            <Text style={styles.successTitle}>Verification Submitted</Text>
            <Text style={styles.successSub}>
              We'll review your documents within 24 hours. You'll receive a notification once verified.
            </Text>
            <Button title="Go to Home" onPress={handleDone} full />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  progress: { flexDirection: 'row', gap: 4, paddingHorizontal: spacing.xl, paddingBottom: 12 },
  progressBar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.gray200 },
  progressActive: { backgroundColor: colors.teal },
  body: { flex: 1, paddingHorizontal: spacing.xl },
  heading: { fontFamily: fonts.heading, fontSize: fontSize.xl + 2, color: colors.night, marginBottom: 4 },
  sub: { fontSize: fontSize.md - 1, color: colors.gray400, marginBottom: 20 },
  uploadRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  uploadBox: {
    flex: 1, borderWidth: 2, borderColor: colors.gray300, borderStyle: 'dashed',
    borderRadius: radius.lg, paddingVertical: 16, paddingHorizontal: 10, alignItems: 'center',
  },
  uploadIcon: { fontSize: 28, marginBottom: 6 },
  uploadLabel: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold, color: colors.gray500 },
  uploadHint: { fontSize: fontSize.xs, color: colors.gray400, marginTop: 3 },
  selfieBox: {
    borderWidth: 2, borderColor: colors.gray300, borderStyle: 'dashed',
    borderRadius: radius.lg, padding: 40, alignItems: 'center', marginBottom: 20,
  },
  successWrap: { alignItems: 'center', paddingTop: 40 },
  successCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.greenBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  successTitle: { fontFamily: fonts.heading, fontSize: fontSize.xxl, color: colors.night, marginBottom: 8 },
  successSub: { fontSize: fontSize.md, color: colors.gray400, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
});
