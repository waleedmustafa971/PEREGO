import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import Header from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const INITIAL_CARDS = [
  { id: 'c1', brand: 'Visa', last4: '4242', expiry: '08/26', isDefault: true },
  { id: 'c2', brand: 'Mastercard', last4: '5555', expiry: '11/27', isDefault: false },
];

export default function PaymentMethodsScreen() {
  const [cards, setCards] = useState(INITIAL_CARDS);

  const setDefault = (id: string) => setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));

  const removeCard = (id: string) => {
    Alert.alert('Remove Card', 'Are you sure you want to remove this card?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setCards(prev => prev.filter(c => c.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Payment Methods" />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

        <View style={styles.walletCard}>
          <View style={styles.walletTop}>
            <View>
              <Text style={styles.walletLabel}>Perego Wallet</Text>
              <Text style={styles.walletBalance}>$47.50</Text>
            </View>
            <Text style={{ fontSize: 32 }}>👛</Text>
          </View>
          <TouchableOpacity style={styles.topUpBtn}>
            <Text style={styles.topUpText}>Top Up Wallet</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Saved Cards</Text>

        {cards.map(card => (
          <Card key={card.id} style={styles.cardItem}>
            <View style={styles.cardRow}>
              <View style={styles.cardIconWrap}>
                <Text style={{ fontSize: 22 }}>💳</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardBrand}>{card.brand} •••• {card.last4}</Text>
                <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
              </View>
              {card.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            <View style={styles.cardActions}>
              {!card.isDefault && (
                <TouchableOpacity onPress={() => setDefault(card.id)} style={styles.cardActionBtn}>
                  <Text style={[styles.cardActionText, { color: colors.teal }]}>Set Default</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => removeCard(card.id)} style={styles.cardActionBtn}>
                <Text style={[styles.cardActionText, { color: colors.red }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        <Button title="+ Add New Card" onPress={() => {}} variant="ghost" full />

        <View style={styles.earningsCard}>
          <Text style={styles.earningsTitle}>Courier Earnings</Text>
          <View style={styles.earningsRow}>
            <View>
              <Text style={styles.earningsLabel}>Available to withdraw</Text>
              <Text style={styles.earningsValue}>$84.00</Text>
            </View>
            <TouchableOpacity style={styles.withdrawBtn}>
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.earningsNote}>Withdrawals are processed within 1–3 business days to your bank account.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100 },
  body: { padding: spacing.xl, gap: 12, paddingBottom: 40 },
  walletCard: {
    backgroundColor: colors.night, borderRadius: radius.xl, padding: 20,
  },
  walletTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  walletLabel: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.5)', fontFamily: fonts.bodyMedium },
  walletBalance: { fontFamily: fonts.headingBold, fontSize: 32, color: colors.white },
  topUpBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10,
    paddingVertical: 10, alignItems: 'center',
  },
  topUpText: { color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: fontSize.md - 1 },
  sectionLabel: { fontSize: 11, fontFamily: fonts.bodySemiBold, textTransform: 'uppercase', letterSpacing: 1.5, color: colors.gray400 },
  cardItem: { backgroundColor: colors.white, gap: 0 },
  cardRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 12 },
  cardIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center' },
  cardBrand: { fontFamily: fonts.bodyBold, fontSize: fontSize.md - 1, color: colors.night },
  cardExpiry: { fontSize: fontSize.sm, color: colors.gray400 },
  defaultBadge: { backgroundColor: colors.tealBg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  defaultText: { fontSize: fontSize.xs, color: colors.teal, fontFamily: fonts.bodyBold },
  cardActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.gray100, paddingTop: 10, gap: 16 },
  cardActionBtn: { paddingVertical: 2 },
  cardActionText: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold },
  earningsCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.gray200 },
  earningsTitle: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: colors.night, marginBottom: 14 },
  earningsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  earningsLabel: { fontSize: fontSize.sm, color: colors.gray400 },
  earningsValue: { fontFamily: fonts.headingBold, fontSize: fontSize.xxl, color: colors.teal },
  withdrawBtn: { backgroundColor: colors.teal, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  withdrawText: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: fontSize.sm },
  earningsNote: { fontSize: fontSize.xs + 1, color: colors.gray400, lineHeight: 18 },
});
