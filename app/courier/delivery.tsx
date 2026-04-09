import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { PLATFORM_FEE_PERCENT } from '@/lib/constants';
import Header from '@/components/ui/Header';
import { Card, Avatar } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const CORRECT_PIN = '847293';

export default function DeliveryScreen() {
  const [mode, setMode] = useState<'choose' | 'qr' | 'pin'>('choose');
  const [pin, setPin] = useState('');
  const [verified, setVerified] = useState(false);

  const price = 18;
  const fee = price * PLATFORM_FEE_PERCENT;
  const net = price - fee;

  const handleVerify = () => {
    if (pin === CORRECT_PIN) setVerified(true);
  };

  const handleComplete = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Verify Delivery" />
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }}>
        <Card style={styles.receiverCard}>
          <Text style={styles.cardLabel}>Receiver</Text>
          <View style={styles.receiverRow}>
            <Avatar color={colors.tealLight} name="Ahmed Mohamed" size={40} />
            <View>
              <Text style={styles.receiverName}>Ahmed Mohamed</Text>
              <Text style={styles.receiverDetail}>📍 Nasr City, Cairo</Text>
            </View>
          </View>
        </Card>

        {!verified && mode === 'choose' && (
          <>
            <View style={styles.chooseHeader}>
              <Text style={{ fontSize: 40 }}>🔐</Text>
              <Text style={styles.chooseTitle}>Verify Handoff</Text>
              <Text style={styles.chooseSub}>
                Ask the receiver for their delivery code. They received it via SMS when the shipment was booked.
              </Text>
            </View>
            <View style={styles.options}>
              <TouchableOpacity style={styles.optionCard} onPress={() => setMode('qr')}>
                <View style={[styles.optionIcon, { backgroundColor: colors.tealBg }]}>
                  <Text style={{ fontSize: 24 }}>📱</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>Scan QR Code</Text>
                  <Text style={styles.optionSub}>Scan the code from receiver's phone</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionCard} onPress={() => setMode('pin')}>
                <View style={[styles.optionIcon, { backgroundColor: colors.orangeBg }]}>
                  <Text style={{ fontSize: 24 }}>🔢</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>Enter PIN Code</Text>
                  <Text style={styles.optionSub}>Type the 6-digit code from receiver</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {!verified && mode === 'qr' && (
          <>
            <Text style={styles.modeTitle}>Scan Receiver's QR</Text>
            <Text style={styles.modeSub}>Point your camera at the code on receiver's screen</Text>
            <View style={styles.cameraBox}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
              <Text style={styles.scanLabel}>Scanning...</Text>
            </View>
            <View style={styles.modeActions}>
              <View style={{ flex: 1 }}><Button title="Use PIN Instead" onPress={() => setMode('pin')} variant="ghost" full small /></View>
              <View style={{ flex: 1 }}><Button title="Simulate Scan ✓" onPress={() => setVerified(true)} full small /></View>
            </View>
          </>
        )}

        {!verified && mode === 'pin' && (
          <>
            <Text style={[styles.modeTitle, { textAlign: 'center' }]}>Enter Delivery PIN</Text>
            <Text style={[styles.modeSub, { textAlign: 'center' }]}>Ask the receiver for their 6-digit code</Text>
            <View style={styles.pinRow}>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <View key={i} style={[styles.pinBox, pin.length > i && styles.pinBoxActive]}>
                  <Text style={styles.pinDigit}>{pin[i] || ''}</Text>
                </View>
              ))}
            </View>
            <TextInput
              value={pin}
              onChangeText={t => setPin(t.replace(/\D/g, '').slice(0, 6))}
              keyboardType="number-pad"
              autoFocus
              style={styles.hiddenInput}
            />
            {pin.length === 6 && pin !== CORRECT_PIN && (
              <Text style={styles.error}>Invalid code. Please check with the receiver.</Text>
            )}
            <Text style={styles.demoHint}>Demo PIN: <Text style={styles.demoPin}>847293</Text></Text>
            <View style={styles.modeActions}>
              <View style={{ flex: 1 }}><Button title="Scan QR Instead" onPress={() => setMode('qr')} variant="ghost" full small /></View>
              <View style={{ flex: 1 }}><Button title="Verify Code" onPress={handleVerify} full small disabled={pin.length < 6} /></View>
            </View>
          </>
        )}

        {verified && (
          <>
            <View style={styles.successWrap}>
              <View style={styles.successCircle}>
                <Text style={{ fontSize: 32, color: colors.white }}>✓</Text>
              </View>
              <Text style={styles.successTitle}>Code Verified!</Text>
              <Text style={styles.successSub}>Delivery confirmed by receiver's code</Text>
            </View>

            <Card style={[styles.payoutCard, { backgroundColor: colors.tealBg }]}>
              <Text style={styles.cardLabel}>Payout Summary</Text>
              <View style={styles.payoutRows}>
                <View style={styles.payoutRow}>
                  <Text style={styles.payoutLabel}>Delivery fee</Text>
                  <Text style={styles.payoutValue}>${price.toFixed(2)}</Text>
                </View>
                <View style={styles.payoutRow}>
                  <Text style={styles.payoutLabel}>Platform fee (12%)</Text>
                  <Text style={[styles.payoutValue, { color: colors.red }]}>-${fee.toFixed(2)}</Text>
                </View>
                <View style={[styles.payoutRow, styles.payoutTotal]}>
                  <Text style={styles.totalLabel}>Your earnings</Text>
                  <Text style={styles.totalValue}>${net.toFixed(2)}</Text>
                </View>
              </View>
            </Card>

            <View style={styles.escrowNote}>
              <Text style={{ fontSize: 16 }}>🔐</Text>
              <Text style={styles.escrowText}>${net.toFixed(2)} will be transferred to your wallet within 24 hours.</Text>
            </View>

            <Button title="Complete & Rate Sender" onPress={handleComplete} full />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.xl },
  receiverCard: { marginBottom: 16 },
  cardLabel: { fontSize: 11, fontFamily: fonts.bodySemiBold, textTransform: 'uppercase', letterSpacing: 1.5, color: colors.gray400, marginBottom: 10 },
  receiverRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  receiverName: { fontFamily: fonts.bodyBold, fontSize: fontSize.md },
  receiverDetail: { fontSize: fontSize.sm, color: colors.gray400 },
  chooseHeader: { alignItems: 'center', marginBottom: 20 },
  chooseTitle: { fontFamily: fonts.heading, fontSize: fontSize.xl, marginTop: 8, marginBottom: 4 },
  chooseSub: { fontSize: fontSize.md - 1, color: colors.gray400, textAlign: 'center', lineHeight: 20 },
  options: { gap: 10 },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.gray200 },
  optionIcon: { width: 48, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  optionTitle: { fontFamily: fonts.bodyBold, fontSize: fontSize.md },
  optionSub: { fontSize: fontSize.sm, color: colors.gray400 },
  chevron: { fontSize: 18, color: colors.gray300 },
  modeTitle: { fontFamily: fonts.heading, fontSize: fontSize.lg, marginBottom: 4 },
  modeSub: { fontSize: fontSize.sm, color: colors.gray400, marginBottom: 16 },
  cameraBox: {
    width: '100%', aspectRatio: 1, maxWidth: 260, alignSelf: 'center',
    backgroundColor: colors.night, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  scanFrame: { width: 160, height: 160, borderWidth: 3, borderColor: colors.teal, borderRadius: radius.lg, position: 'relative' },
  corner: { position: 'absolute', width: 24, height: 24 },
  cornerTL: { top: -3, left: -3, borderTopWidth: 4, borderLeftWidth: 4, borderColor: colors.green, borderTopLeftRadius: 4 },
  cornerTR: { top: -3, right: -3, borderTopWidth: 4, borderRightWidth: 4, borderColor: colors.green, borderTopRightRadius: 4 },
  cornerBL: { bottom: -3, left: -3, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: colors.green, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: -3, right: -3, borderBottomWidth: 4, borderRightWidth: 4, borderColor: colors.green, borderBottomRightRadius: 4 },
  scanLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 12 },
  modeActions: { flexDirection: 'row', gap: 8 },
  pinRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 8 },
  pinBox: { width: 44, height: 52, borderRadius: radius.md, backgroundColor: colors.gray100, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  pinBoxActive: { borderColor: colors.teal },
  pinDigit: { fontSize: 20, fontFamily: fonts.heading, color: colors.night },
  hiddenInput: { position: 'absolute', opacity: 0 },
  error: { textAlign: 'center', fontSize: fontSize.sm, color: colors.red, fontFamily: fonts.bodySemiBold, marginBottom: 8 },
  demoHint: { textAlign: 'center', fontSize: 11, color: colors.gray400, marginBottom: 16 },
  demoPin: { fontFamily: fonts.bodyBold, color: colors.teal, letterSpacing: 2 },
  successWrap: { alignItems: 'center', marginBottom: 20 },
  successCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  successTitle: { fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.green, marginBottom: 4 },
  successSub: { fontSize: fontSize.md - 1, color: colors.gray400 },
  payoutCard: { marginBottom: 16 },
  payoutRows: { gap: 6 },
  payoutRow: { flexDirection: 'row', justifyContent: 'space-between' },
  payoutLabel: { fontSize: fontSize.md - 1, color: colors.gray600 },
  payoutValue: { fontSize: fontSize.md - 1, fontFamily: fonts.bodySemiBold },
  payoutTotal: { borderTopWidth: 1, borderTopColor: colors.gray200, paddingTop: 8 },
  totalLabel: { fontSize: fontSize.lg, fontFamily: fonts.bodyBold },
  totalValue: { fontSize: fontSize.lg, fontFamily: fonts.bodyBold, color: colors.green },
  escrowNote: { flexDirection: 'row', gap: 10, backgroundColor: colors.tealBg, borderRadius: radius.md, padding: 12, marginBottom: 16, alignItems: 'flex-start' },
  escrowText: { flex: 1, fontSize: fontSize.sm, color: colors.gray600, lineHeight: 20 },
});
