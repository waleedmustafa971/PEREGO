import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/ui/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginScreen() {
  const [phone, setPhone] = useState('+971');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(0);
  const login = useAuthStore(s => s.login);

  const handleLogin = () => {
    login();
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Log In" />
      <View style={styles.body}>
        {step === 0 ? (
          <>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.sub}>Enter your phone number to continue</Text>
            <Input label="Phone Number" value={phone} onChangeText={setPhone} icon="📱" keyboardType="phone-pad" />
            <View style={{ marginTop: 8 }}>
              <Button title="Send OTP" onPress={() => setStep(1)} full />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.heading}>Verify OTP</Text>
            <Text style={styles.sub}>We sent a code to {phone}</Text>
            <View style={styles.otpRow}>
              {[0, 1, 2, 3].map(i => (
                <View key={i} style={[styles.otpBox, otp.length > i && styles.otpBoxActive]}>
                  <Text style={styles.otpDigit}>{otp[i] || ''}</Text>
                </View>
              ))}
            </View>
            <TextInput
              value={otp}
              onChangeText={t => setOtp(t.replace(/\D/g, '').slice(0, 4))}
              keyboardType="number-pad"
              autoFocus
              style={styles.hiddenInput}
            />
            <Button title="Verify & Continue" onPress={handleLogin} full disabled={otp.length < 4} />
            <Text style={styles.resend}>
              Didn't receive? <Text style={styles.resendLink}>Resend</Text>
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, padding: spacing.xl },
  heading: { fontFamily: fonts.heading, fontSize: fontSize.xxl, color: colors.night, marginBottom: 4 },
  sub: { fontSize: fontSize.md - 1, color: colors.gray400, marginBottom: 28 },
  otpRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 28 },
  otpBox: {
    width: 52, height: 56, borderRadius: radius.lg, backgroundColor: colors.gray100,
    borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center',
  },
  otpBoxActive: { borderColor: colors.teal },
  otpDigit: { fontSize: 22, fontFamily: fonts.heading, color: colors.night },
  hiddenInput: { position: 'absolute', opacity: 0 },
  resend: { textAlign: 'center', marginTop: 16, fontSize: fontSize.md - 1, color: colors.gray400 },
  resendLink: { color: colors.teal, fontFamily: fonts.bodySemiBold },
});
