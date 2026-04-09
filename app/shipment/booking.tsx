import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { PLATFORM_FEE_PERCENT } from '@/lib/constants';
import { useShipmentStore } from '@/stores/shipmentStore';
import Header from '@/components/ui/Header';
import { Card, Avatar } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function BookingScreen() {
  const traveler = useShipmentStore(s => s.selectedTraveler);
  if (!traveler) return null;

  const price = traveler.pricePerKg * 3;
  const fee = price * PLATFORM_FEE_PERCENT;
  const total = price + fee;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Confirm Booking" />
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }}>
        <Card style={styles.travelerCard}>
          <View style={{ alignItems: 'center' }}>
            <Avatar color={traveler.courierAvatar} name={traveler.courierName} size={56} />
            <Text style={styles.name}>{traveler.courierName}</Text>
            <Text style={styles.route}>{traveler.originCity} → {traveler.destinationCity} · {traveler.travelDate}</Text>
            <Text style={styles.rating}>⭐ {traveler.courierRating} · {traveler.courierReviews} reviews</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Price Breakdown</Text>
        <View style={styles.breakdownList}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Traveler fee</Text>
            <Text style={styles.breakdownValue}>${price.toFixed(2)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Platform fee (12%)</Text>
            <Text style={styles.breakdownValue}>${fee.toFixed(2)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Insurance (optional)</Text>
            <Text style={styles.breakdownValue}>$0.00</Text>
          </View>
          <View style={[styles.breakdownRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.escrowNote}>
          <Text style={{ fontSize: 16 }}>🔐</Text>
          <Text style={styles.escrowText}>
            Payment is held in escrow and only released to the traveler after your receiver confirms delivery.
          </Text>
        </View>

        <Button title="Pay & Book" onPress={() => router.push('/chat/conversation')} variant="orange" full />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.xl },
  travelerCard: { alignItems: 'center', marginBottom: 16 },
  name: { fontFamily: fonts.bodyBold, fontSize: fontSize.lg, marginTop: 10 },
  route: { fontSize: fontSize.sm, color: colors.gray400, marginTop: 2 },
  rating: { fontSize: fontSize.sm, color: colors.gray400 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: fontSize.md + 1, marginBottom: 12 },
  breakdownList: { gap: 8, marginBottom: 16 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  breakdownLabel: { fontSize: fontSize.md - 1, color: colors.gray600 },
  breakdownValue: { fontSize: fontSize.md - 1, fontFamily: fonts.bodySemiBold },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.gray200, paddingTop: 8 },
  totalLabel: { fontSize: fontSize.lg, fontFamily: fonts.bodyBold },
  totalValue: { fontSize: fontSize.lg, fontFamily: fonts.bodyBold, color: colors.teal },
  escrowNote: { flexDirection: 'row', gap: 10, backgroundColor: colors.tealBg, borderRadius: radius.md, padding: 14, marginBottom: 20, alignItems: 'flex-start' },
  escrowText: { flex: 1, fontSize: fontSize.sm, color: colors.gray600, lineHeight: 20 },
});
