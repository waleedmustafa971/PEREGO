import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { mockShipmentHistory, mockShipments } from '@/lib/mockData';
import { STATUS_LABELS } from '@/lib/constants';
import Header from '@/components/ui/Header';
import { Card, Badge } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

const CATEGORY_ICONS: Record<string, string> = {
  gift: '🎁', documents: '📄', clothing: '👕', electronics: '📱', food: '🍪', other: '📦',
};

const STATUS_COLORS: Record<string, string> = {
  delivered: colors.green,
  in_transit: colors.orange,
  pending: colors.gray400,
  matched: colors.teal,
  picked_up: colors.tealLight,
  cancelled: colors.red,
  disputed: colors.red,
  arrived: colors.teal,
};

type Tab = 'active' | 'history';

export default function ShipmentHistoryScreen() {
  const [tab, setTab] = useState<Tab>('active');
  const items = tab === 'active' ? mockShipments : mockShipmentHistory;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="My Shipments" />
      <View style={styles.tabs}>
        {(['active', 'history'] as Tab[]).map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'active' ? 'Active' : 'History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon="📦"
          title={tab === 'active' ? 'No active shipments' : 'No past shipments'}
          subtitle={tab === 'active' ? 'Create your first shipment and find a trusted traveler.' : "You haven't completed any shipments yet."}
          actionLabel={tab === 'active' ? 'Send a Package' : undefined}
          onAction={tab === 'active' ? () => router.push('/shipment/create') : undefined}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {items.map(s => (
            <Card
              key={s.shipmentId}
              style={styles.card}
              onPress={() => router.push('/shipment/tracking')}
            >
              <View style={styles.cardTop}>
                <View style={styles.categoryIconWrap}>
                  <Text style={{ fontSize: 20 }}>{CATEGORY_ICONS[s.category] || '📦'}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.description} numberOfLines={1}>{s.description}</Text>
                  <Text style={styles.route}>
                    → {s.destinationCity}  ·  {s.courierName}
                  </Text>
                </View>
                <Badge text={STATUS_LABELS[s.status]} color={STATUS_COLORS[s.status] || colors.gray400} />
              </View>
              <View style={styles.cardMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Weight</Text>
                  <Text style={styles.metaValue}>{s.weightKg} kg</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Paid</Text>
                  <Text style={styles.metaValue}>${(s.agreedPrice + s.platformFee).toFixed(2)}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Receiver</Text>
                  <Text style={styles.metaValue} numberOfLines={1}>{s.receiverName}</Text>
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
  container: { flex: 1, backgroundColor: colors.gray100 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    paddingHorizontal: spacing.xl,
  },
  tab: {
    flex: 1, paddingVertical: 14, alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.teal },
  tabText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.md - 1, color: colors.gray400 },
  tabTextActive: { fontFamily: fonts.bodyBold, color: colors.teal },
  list: { padding: spacing.xl, gap: 10, paddingBottom: 30 },
  card: { backgroundColor: colors.white },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 12 },
  categoryIconWrap: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.gray100,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardInfo: { flex: 1 },
  description: { fontFamily: fonts.bodyBold, fontSize: fontSize.md, color: colors.night },
  route: { fontSize: fontSize.sm, color: colors.gray400, marginTop: 2 },
  cardMeta: {
    flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.gray100, paddingTop: 12, gap: 0,
  },
  metaItem: { flex: 1 },
  metaLabel: { fontSize: fontSize.xs, color: colors.gray400, marginBottom: 2 },
  metaValue: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold, color: colors.night },
});
