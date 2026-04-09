import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { mockShipments, mockShipmentHistory, mockIncomingRequests } from '@/lib/mockData';
import { STATUS_LABELS } from '@/lib/constants';
import { useAuthStore } from '@/stores/authStore';
import { useTripStore } from '@/stores/tripStore';
import { Card, Avatar, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

const CATEGORY_ICONS: Record<string, string> = {
  gift: '🎁', documents: '📄', clothing: '👕', electronics: '📱', food: '🍪', other: '📦',
};
const STATUS_COLORS: Record<string, string> = {
  delivered: colors.green, in_transit: colors.orange, pending: colors.gray400,
  matched: colors.teal, picked_up: colors.tealLight, cancelled: colors.red,
  disputed: colors.red, arrived: colors.teal,
};

type Tab = 'active' | 'history';

function SenderTrack() {
  const [tab, setTab] = useState<Tab>('active');
  const items = tab === 'active' ? mockShipments : mockShipmentHistory;

  return (
    <>
      <View style={styles.tabs}>
        {(['active', 'history'] as Tab[]).map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'active' ? `Active (${mockShipments.length})` : `History (${mockShipmentHistory.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {items.length === 0 ? (
        <EmptyState
          icon="📦"
          title={tab === 'active' ? 'No active shipments' : 'No past shipments'}
          subtitle={tab === 'active' ? 'Create your first shipment to get started.' : "You haven't completed any shipments yet."}
          actionLabel={tab === 'active' ? 'Send a Package' : undefined}
          onAction={tab === 'active' ? () => router.push('/shipment/create') : undefined}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {items.map(s => (
            <Card key={s.shipmentId} style={styles.card} onPress={() => router.push('/shipment/tracking')}>
              <View style={styles.cardTop}>
                <View style={styles.categoryIconWrap}>
                  <Text style={{ fontSize: 20 }}>{CATEGORY_ICONS[s.category] || '📦'}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.description} numberOfLines={1}>{s.description}</Text>
                  <Text style={styles.route}>→ {s.destinationCity}  ·  {s.courierName}</Text>
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
    </>
  );
}

function CourierRequests() {
  const setSelectedRequest = useTripStore(s => s.setSelectedRequest);

  const handleAccept = (r: typeof mockIncomingRequests[0]) => {
    setSelectedRequest(r);
    router.push('/courier/pickup');
  };

  return (
    <>
      <Text style={styles.countText}>{mockIncomingRequests.length} requests for your DXB → CAI trip (Apr 14)</Text>
      {mockIncomingRequests.length === 0 ? (
        <EmptyState icon="📬" title="No requests yet" subtitle="When senders match your trip, their requests will appear here." />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {mockIncomingRequests.map(r => (
            <Card key={r.id} style={styles.requestCard}>
              <View style={styles.requestTop}>
                <Avatar color={r.senderAvatar} name={r.senderName} size={40} />
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.senderName}>{r.senderName}</Text>
                    <Text style={styles.price}>${r.price}</Text>
                  </View>
                  <Text style={styles.rating}>⭐ {r.senderRating} ({r.senderReviews} reviews)</Text>
                </View>
              </View>
              <View style={styles.detailBox}>
                <View style={styles.detailRow}>
                  <View><Text style={styles.detailLabel}>Category</Text><Text style={styles.detailValue}>{r.category}</Text></View>
                  <View><Text style={styles.detailLabel}>Weight</Text><Text style={styles.detailValue}>{r.weightKg} kg</Text></View>
                  <View><Text style={styles.detailLabel}>Photo</Text><Text style={styles.detailValue}>{r.hasPhoto ? '✓ Attached' : 'None'}</Text></View>
                </View>
                <Text style={styles.desc}>{r.description}</Text>
              </View>
              <View style={styles.actions}>
                <View style={{ flex: 1 }}><Button title="Accept" onPress={() => handleAccept(r)} full small /></View>
                <View style={{ flex: 1 }}><Button title="Decline" onPress={() => {}} variant="secondary" full small /></View>
              </View>
            </Card>
          ))}
        </ScrollView>
      )}
    </>
  );
}

export default function TrackTab() {
  const role = useAuthStore(s => s.activeRole);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{role === 'courier' ? 'Requests' : 'My Shipments'}</Text>
        {role === 'courier' && (
          <TouchableOpacity onPress={() => router.push('/courier/my-trips')} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>My Trips</Text>
          </TouchableOpacity>
        )}
      </View>
      {role === 'courier' ? <CourierRequests /> : <SenderTrack />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingVertical: 14,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  title: { fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.night },
  headerBtn: { backgroundColor: colors.tealBg, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  headerBtnText: { fontSize: fontSize.sm, color: colors.teal, fontFamily: fonts.bodySemiBold },
  tabs: {
    flexDirection: 'row', backgroundColor: colors.white,
    borderBottomWidth: 1, borderBottomColor: colors.gray100,
    paddingHorizontal: spacing.xl,
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.teal },
  tabText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.md - 1, color: colors.gray400 },
  tabTextActive: { fontFamily: fonts.bodyBold, color: colors.teal },
  list: { padding: spacing.xl, gap: 10, paddingBottom: 100 },
  countText: { fontSize: fontSize.sm, color: colors.gray400, paddingHorizontal: spacing.xl, paddingVertical: 10, backgroundColor: colors.white },
  card: { backgroundColor: colors.white },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 12 },
  categoryIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardInfo: { flex: 1 },
  description: { fontFamily: fonts.bodyBold, fontSize: fontSize.md, color: colors.night },
  route: { fontSize: fontSize.sm, color: colors.gray400, marginTop: 2 },
  cardMeta: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.gray100, paddingTop: 12 },
  metaItem: { flex: 1 },
  metaLabel: { fontSize: fontSize.xs, color: colors.gray400, marginBottom: 2 },
  metaValue: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold, color: colors.night },
  requestCard: { backgroundColor: colors.white, borderColor: colors.orange + '30', borderWidth: 1.5 },
  requestTop: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  senderName: { fontFamily: fonts.bodyBold, fontSize: fontSize.md },
  price: { fontFamily: fonts.headingBold, fontSize: fontSize.lg, color: colors.teal },
  rating: { fontSize: 11, color: colors.gray400, marginTop: 2 },
  detailBox: { backgroundColor: colors.gray100, borderRadius: radius.md, padding: 12, marginBottom: 12 },
  detailRow: { flexDirection: 'row', gap: 16, marginBottom: 6 },
  detailLabel: { fontSize: fontSize.xs, color: colors.gray400 },
  detailValue: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold },
  desc: { fontSize: fontSize.sm, color: colors.gray600 },
  actions: { flexDirection: 'row', gap: 8 },
});
