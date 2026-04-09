import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { PLATFORM_FEE_PERCENT } from '@/lib/constants';
import { useShipmentStore } from '@/stores/shipmentStore';
import Header from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const SAVED_CARDS = [
  { id: 'c1', brand: 'Visa', last4: '4242', expiry: '08/26', icon: '💳' },
  { id: 'c2', brand: 'Mastercard', last4: '5555', expiry: '11/27', icon: '💳' },
];

type PayMethod = 'card' | 'wallet' | 'new';

export default function PaymentScreen() {
  const traveler = useShipmentStore(s => s.selectedTraveler);
  const [method, setMethod] = useState<PayMethod>('card');
  const [selectedCard, setSelectedCard] = useState('c1');
  const [processing, setProcessing] = useState(false);
  const [cvv, setCvv] = useState('');

  if (!traveler) return null;

  const price = traveler.pricePerKg * 3;
  const fee = price * PLATFORM_FEE_PERCENT;
  const total = price + fee;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      router.push('/chat/conversation');
    }, 1800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Payment" />
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Due</Text>
          <Text style={styles.amountValue}>${total.toFixed(2)}</Text>
          <View style={styles.amountBreakdown}>
            <Text style={styles.amountSub}>Traveler fee ${price.toFixed(2)}  ·  Platform fee ${fee.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Payment Method</Text>
        <View style={styles.methodRow}>
          {([
            { key: 'card', icon: '💳', label: 'Saved Card' },
            { key: 'wallet', icon: '👛', label: 'Wallet' },
            { key: 'new', icon: '➕', label: 'New Card' },
          ] as { key: PayMethod; icon: string; label: string }[]).map(m => (
            <TouchableOpacity
              key={m.key}
              onPress={() => setMethod(m.key)}
              style={[styles.methodChip, method === m.key && styles.methodChipActive]}
            >
              <Text style={{ fontSize: 18 }}>{m.icon}</Text>
              <Text style={[styles.methodLabel, method === m.key && styles.methodLabelActive]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {method === 'card' && (
          <View style={styles.cardList}>
            {SAVED_CARDS.map(card => (
              <TouchableOpacity
                key={card.id}
                onPress={() => setSelectedCard(card.id)}
                style={[styles.savedCard, selectedCard === card.id && styles.savedCardActive]}
              >
                <View style={styles.savedCardLeft}>
                  <Text style={{ fontSize: 22 }}>💳</Text>
                  <View>
                    <Text style={styles.cardBrand}>{card.brand} •••• {card.last4}</Text>
                    <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
                  </View>
                </View>
                <View style={[styles.radio, selectedCard === card.id && styles.radioActive]}>
                  {selectedCard === card.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.cvvRow}>
              <Text style={styles.cvvLabel}>CVV for selected card</Text>
              <TextInput
                value={cvv}
                onChangeText={t => setCvv(t.replace(/\D/g, '').slice(0, 3))}
                placeholder="•••"
                keyboardType="number-pad"
                secureTextEntry
                style={styles.cvvInput}
                placeholderTextColor={colors.gray300}
              />
            </View>
          </View>
        )}

        {method === 'wallet' && (
          <Card style={styles.walletCard}>
            <View style={styles.walletRow}>
              <View style={styles.walletIconWrap}>
                <Text style={{ fontSize: 24 }}>👛</Text>
              </View>
              <View>
                <Text style={styles.walletBalance}>$47.50</Text>
                <Text style={styles.walletSub}>Available balance</Text>
              </View>
            </View>
            {total > 47.50 && (
              <View style={styles.walletWarning}>
                <Text style={styles.walletWarningText}>
                  Insufficient balance. Top up ${(total - 47.50).toFixed(2)} more or use a card.
                </Text>
              </View>
            )}
          </Card>
        )}

        {method === 'new' && (
          <Card style={styles.newCardForm}>
            <TextInput style={styles.cardInput} placeholder="Card number" keyboardType="number-pad" placeholderTextColor={colors.gray300} />
            <View style={styles.cardRow}>
              <TextInput style={[styles.cardInput, { flex: 1 }]} placeholder="MM / YY" keyboardType="number-pad" placeholderTextColor={colors.gray300} />
              <TextInput style={[styles.cardInput, { flex: 1 }]} placeholder="CVV" keyboardType="number-pad" secureTextEntry placeholderTextColor={colors.gray300} />
            </View>
            <TextInput style={styles.cardInput} placeholder="Name on card" placeholderTextColor={colors.gray300} />
          </Card>
        )}

        <View style={styles.escrowNote}>
          <Text style={{ fontSize: 16 }}>🔐</Text>
          <Text style={styles.escrowText}>
            Funds are held in escrow and only released to the traveler after your receiver confirms delivery with the delivery PIN.
          </Text>
        </View>

        <Button
          title={processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          onPress={handlePay}
          variant="orange"
          full
          disabled={processing || (method === 'wallet' && total > 47.50)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.xl },
  amountCard: {
    backgroundColor: colors.night,
    borderRadius: radius.xl,
    padding: 24,
    alignItems: 'center',
    marginVertical: 16,
  },
  amountLabel: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.5)', fontFamily: fonts.bodyMedium, letterSpacing: 1 },
  amountValue: { fontFamily: fonts.headingBold, fontSize: 42, color: colors.white, marginVertical: 4 },
  amountBreakdown: {},
  amountSub: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.4)' },
  sectionLabel: { fontSize: 11, fontFamily: fonts.bodySemiBold, textTransform: 'uppercase', letterSpacing: 1.5, color: colors.gray400, marginBottom: 10 },
  methodRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  methodChip: {
    flex: 1, alignItems: 'center', gap: 4, paddingVertical: 12,
    borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.gray200, backgroundColor: colors.white,
  },
  methodChipActive: { borderColor: colors.teal, backgroundColor: colors.teal + '08' },
  methodLabel: { fontSize: fontSize.xs + 1, fontFamily: fonts.bodyMedium, color: colors.gray500 },
  methodLabelActive: { color: colors.teal, fontFamily: fonts.bodySemiBold },
  cardList: { gap: 10, marginBottom: 16 },
  savedCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.gray200,
  },
  savedCardActive: { borderColor: colors.teal, backgroundColor: colors.teal + '05' },
  savedCardLeft: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  cardBrand: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.md - 1, color: colors.night },
  cardExpiry: { fontSize: fontSize.sm, color: colors.gray400 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.gray300, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.teal },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.teal },
  cvvRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  cvvLabel: { fontSize: fontSize.sm, color: colors.gray500, fontFamily: fonts.bodyMedium },
  cvvInput: {
    width: 80, borderWidth: 1.5, borderColor: colors.gray200, borderRadius: radius.md,
    paddingHorizontal: 12, paddingVertical: 8, textAlign: 'center',
    fontSize: fontSize.md, fontFamily: fonts.bodyBold, color: colors.night,
  },
  walletCard: { marginBottom: 16 },
  walletRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  walletIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.orangeBg, alignItems: 'center', justifyContent: 'center' },
  walletBalance: { fontFamily: fonts.headingBold, fontSize: fontSize.xxl, color: colors.night },
  walletSub: { fontSize: fontSize.sm, color: colors.gray400 },
  walletWarning: { backgroundColor: colors.redBg, borderRadius: radius.md, padding: 10, marginTop: 12 },
  walletWarningText: { fontSize: fontSize.sm, color: colors.red, lineHeight: 18 },
  newCardForm: { gap: 10, marginBottom: 16 },
  cardInput: {
    borderWidth: 1.5, borderColor: colors.gray200, borderRadius: radius.md,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: fontSize.md, fontFamily: fonts.body, color: colors.night,
  },
  cardRow: { flexDirection: 'row', gap: 10 },
  escrowNote: {
    flexDirection: 'row', gap: 10, backgroundColor: colors.tealBg,
    borderRadius: radius.md, padding: 14, marginBottom: 16, alignItems: 'flex-start',
  },
  escrowText: { flex: 1, fontSize: fontSize.sm, color: colors.gray600, lineHeight: 20 },
});
