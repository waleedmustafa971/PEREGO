import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { mockTravelers } from '@/lib/mockData';
import { useShipmentStore } from '@/stores/shipmentStore';
import Header from '@/components/ui/Header';
import { Card, Avatar, Badge } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

const filters = ['Best Match', 'Price ↑', 'Rating ↓', 'Soonest'];

export default function BrowseTravelers() {
  const setSelectedTraveler = useShipmentStore(s => s.setSelectedTraveler);

  const handleSelect = (t: typeof mockTravelers[0]) => {
    setSelectedTraveler(t);
    router.push('/shipment/booking');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Available Travelers" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <View style={styles.filterRow}>
          {filters.map((f, i) => (
            <TouchableOpacity key={f} style={[styles.filterChip, i === 0 && styles.filterActive]}>
              <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Text style={styles.count}>{mockTravelers.length} travelers to Cairo, Apr 14-18</Text>
      {mockTravelers.length === 0 ? (
        <EmptyState icon="✈️" title="No travelers found" subtitle="No verified travelers are heading to this destination in your date range. Try adjusting your dates." />
      ) : (
      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 30 }}>
        {mockTravelers.map(t => (
          <Card key={t.tripId} style={styles.card} onPress={() => handleSelect(t)}>
            <View style={styles.row}>
              <Avatar color={t.courierAvatar} name={t.courierName} />
              <View style={{ flex: 1 }}>
                <View style={styles.topRow}>
                  <Text style={styles.name}>{t.courierName}</Text>
                  <Text style={styles.price}>${t.pricePerKg * 3}</Text>
                </View>
                <Text style={styles.route}>
                  {t.originCity} → {t.destinationCity} · {t.travelDate} · {t.flight}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.meta}>⭐ {t.courierRating} ({t.courierReviews})</Text>
                  <Text style={styles.meta}>⚖️ {t.remainingCapacityKg}kg free</Text>
                  <Badge text="Verified" color={colors.green} />
                </View>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  filterScroll: { maxHeight: 44, marginBottom: 4 },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing.xl },
  filterChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: colors.gray100 },
  filterActive: { backgroundColor: colors.teal },
  filterText: { fontSize: 11, fontFamily: fonts.bodySemiBold, color: colors.gray500 },
  filterTextActive: { color: colors.white },
  count: { fontSize: fontSize.sm, color: colors.gray400, paddingHorizontal: spacing.xl, paddingVertical: 8 },
  list: { flex: 1, paddingHorizontal: spacing.xl },
  card: { marginBottom: 10, borderWidth: 1.5, borderColor: colors.gray200 },
  row: { flexDirection: 'row', gap: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontFamily: fonts.bodyBold, fontSize: fontSize.md + 1 },
  price: { fontFamily: fonts.headingBold, fontSize: fontSize.xl, color: colors.teal },
  route: { fontSize: fontSize.sm, color: colors.gray400, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 8, alignItems: 'center' },
  meta: { fontSize: fontSize.xs + 1, color: colors.gray500 },
});
