import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { mockMyTrips } from '@/lib/mockData';
import { Trip } from '@/lib/types';
import Header from '@/components/ui/Header';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

const STATUS_COLOR: Record<string, string> = {
  active: colors.green,
  fully_booked: colors.orange,
  completed: colors.gray400,
  cancelled: colors.red,
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  fully_booked: 'Fully Booked',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

type Tab = 'active' | 'past';

export default function MyTripsScreen() {
  const [tab, setTab] = useState<Tab>('active');
  const [trips, setTrips] = useState<Trip[]>(mockMyTrips);

  const active = trips.filter(t => t.status === 'active' || t.status === 'fully_booked');
  const past = trips.filter(t => t.status === 'completed' || t.status === 'cancelled');
  const items = tab === 'active' ? active : past;

  const handleCancel = (tripId: string) => {
    Alert.alert(
      'Cancel Trip',
      'Are you sure you want to cancel this trip listing? Any pending requests will be declined.',
      [
        { text: 'Keep Trip', style: 'cancel' },
        {
          text: 'Cancel Trip',
          style: 'destructive',
          onPress: () => setTrips(prev => prev.map(t => t.tripId === tripId ? { ...t, status: 'cancelled' as const } : t)),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="My Trips" />
      <View style={styles.tabs}>
        {(['active', 'past'] as Tab[]).map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'active' ? `Active (${active.length})` : `Past (${past.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon="✈️"
          title={tab === 'active' ? 'No active trips' : 'No past trips'}
          subtitle={tab === 'active' ? 'List a trip to start earning from your spare luggage capacity.' : "You haven't completed any trips yet."}
          actionLabel={tab === 'active' ? 'List a Trip' : undefined}
          onAction={tab === 'active' ? () => router.push('/courier/create-trip') : undefined}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {items.map(trip => {
            const booked = trip.totalCapacityKg - trip.remainingCapacityKg;
            const pct = Math.round((booked / trip.totalCapacityKg) * 100);
            return (
              <Card key={trip.tripId} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.routeWrap}>
                    <Text style={styles.routeText}>{trip.originCity} → {trip.destinationCity}</Text>
                    <Text style={styles.flightText}>✈️ {trip.flight}  ·  {trip.travelDate}</Text>
                  </View>
                  <Badge text={STATUS_LABEL[trip.status]} color={STATUS_COLOR[trip.status]} />
                </View>

                <View style={styles.capacityWrap}>
                  <View style={styles.capacityHeader}>
                    <Text style={styles.capacityLabel}>Capacity used</Text>
                    <Text style={styles.capacityValue}>{booked}/{trip.totalCapacityKg} kg</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: pct >= 100 ? colors.orange : colors.teal }]} />
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Price/kg</Text>
                    <Text style={styles.metaValue}>${trip.pricePerKg}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Pickup zone</Text>
                    <Text style={styles.metaValue} numberOfLines={1}>{trip.pickupZone}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Est. earnings</Text>
                    <Text style={[styles.metaValue, { color: colors.teal }]}>${(booked * trip.pricePerKg * 0.88).toFixed(0)}</Text>
                  </View>
                </View>

                {trip.status === 'active' && (
                  <View style={styles.actions}>
                    <View style={{ flex: 1 }}>
                      <Button title="View Requests" onPress={() => router.push('/courier/requests')} small full />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button title="Cancel" onPress={() => handleCancel(trip.tripId)} variant="danger" small full />
                    </View>
                  </View>
                )}
              </Card>
            );
          })}

          {tab === 'active' && (
            <Button title="+ List a New Trip" onPress={() => router.push('/courier/create-trip')} variant="ghost" full />
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    paddingHorizontal: spacing.xl,
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.teal },
  tabText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.md - 1, color: colors.gray400 },
  tabTextActive: { fontFamily: fonts.bodyBold, color: colors.teal },
  list: { padding: spacing.xl, gap: 12, paddingBottom: 30 },
  card: { backgroundColor: colors.white },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  routeWrap: { flex: 1, marginRight: 10 },
  routeText: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: colors.night },
  flightText: { fontSize: fontSize.sm, color: colors.gray400, marginTop: 3 },
  capacityWrap: { marginBottom: 14 },
  capacityHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  capacityLabel: { fontSize: fontSize.sm, color: colors.gray400 },
  capacityValue: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold, color: colors.night },
  progressBar: { height: 6, backgroundColor: colors.gray100, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  metaRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.gray100, paddingTop: 12, marginBottom: 12 },
  metaItem: { flex: 1 },
  metaLabel: { fontSize: fontSize.xs, color: colors.gray400, marginBottom: 2 },
  metaValue: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold, color: colors.night },
  actions: { flexDirection: 'row', gap: 8 },
});
