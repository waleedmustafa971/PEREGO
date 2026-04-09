import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';
import { mockShipments, mockIncomingRequests } from '@/lib/mockData';
import { POPULAR_ROUTES, STATUS_LABELS } from '@/lib/constants';
import { Card, Avatar, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

function SenderHome() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.heroBanner} onPress={() => router.push('/shipment/create')} activeOpacity={0.88}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>New</Text>
        </View>
        <Text style={styles.heroTitle}>Send a Package</Text>
        <Text style={styles.heroSub}>Find a trusted traveler heading to your destination</Text>
        <View style={styles.heroBtn}>
          <Text style={styles.heroBtnText}>Get Started  →</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Shipments</Text>
        <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
      </View>

      {mockShipments.map(s => (
        <Card key={s.shipmentId} style={styles.shipCard} onPress={() => router.push('/shipment/tracking')}>
          <View style={styles.shipTop}>
            <View style={styles.shipInfo}>
              <Text style={styles.shipName}>{s.description}</Text>
              <Text style={styles.shipSub}>→ {s.destinationCity}  ·  via {s.courierName}</Text>
            </View>
            <Badge
              text={STATUS_LABELS[s.status]}
              color={s.status === 'delivered' ? colors.green : colors.orange}
            />
          </View>
          <View style={styles.shipMeta}>
            {[
              { label: 'Weight', value: `${s.weightKg} kg` },
              { label: 'Price', value: `$${s.agreedPrice}` },
              { label: s.status === 'delivered' ? 'Delivered' : 'ETA', value: s.status === 'delivered' ? 'Apr 10' : 'Apr 14' },
            ].map(m => (
              <View key={m.label}>
                <Text style={styles.metaLabel}>{m.label}</Text>
                <Text style={styles.metaValue}>{m.value}</Text>
              </View>
            ))}
          </View>
        </Card>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Routes</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -spacing.xl }}>
        <View style={styles.routeRow}>
          {POPULAR_ROUTES.map(r => (
            <TouchableOpacity key={r.to} style={styles.routeChip} activeOpacity={0.75}>
              <Text style={styles.routeFlag}>✈️</Text>
              <Text style={styles.routeText}>{r.from} → {r.to}</Text>
              <Text style={styles.routeCount}>{r.count} travelers</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

function CourierHome() {
  const stats = [
    { label: 'Earnings', value: '$84', icon: '💰', color: colors.teal, bg: colors.tealBg },
    { label: 'Deliveries', value: '7', icon: '📦', color: colors.orange, bg: colors.orangeBg },
    { label: 'Rating', value: '4.9', icon: '⭐', color: '#B45309', bg: '#FEF3C7' },
    { label: 'Trust', value: '82', icon: '🛡️', color: colors.green, bg: colors.greenBg },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      <View style={styles.statsGrid}>
        {stats.map(s => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: s.bg }]}>
            <Text style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</Text>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.courierBanner} onPress={() => router.push('/courier/create-trip')} activeOpacity={0.88}>
        <View style={[styles.heroBadge, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
          <Text style={styles.heroBadgeText}>Earn</Text>
        </View>
        <Text style={styles.heroTitle}>List a New Trip</Text>
        <Text style={styles.heroSub}>Earn from your unused luggage space</Text>
        <View style={styles.heroBtn}>
          <Text style={styles.heroBtnText}>Create Listing  →</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Delivery</Text>
      </View>
      <Card style={styles.shipCard}>
        <View style={styles.shipTop}>
          <View style={styles.shipInfo}>
            <Text style={styles.shipName}>Gift from Waleed S.</Text>
            <Text style={styles.shipSub}>1.5 kg  ·  Nasr City, Cairo</Text>
          </View>
          <Badge text="Picked Up" color={colors.teal} />
        </View>
        <View style={{ marginTop: 12 }}>
          <Button title="Update Status" onPress={() => router.push('/courier/status')} variant="secondary" small />
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Incoming Requests ({mockIncomingRequests.length})</Text>
        <TouchableOpacity onPress={() => router.push('/courier/requests')}>
          <Text style={[styles.seeAll, { color: colors.orange }]}>View All →</Text>
        </TouchableOpacity>
      </View>
      {mockIncomingRequests.slice(0, 1).map(r => (
        <Card key={r.id} style={[styles.shipCard, { borderColor: colors.orange + '35' }]}>
          <View style={styles.requestRow}>
            <Avatar color={r.senderAvatar} name={r.senderName} size={40} />
            <View style={{ flex: 1 }}>
              <Text style={styles.shipName}>{r.senderName}</Text>
              <Text style={styles.shipSub}>{r.category}  ·  {r.weightKg} kg  ·  ${r.price}</Text>
            </View>
            <View style={styles.requestActions}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.greenBg }]} onPress={() => router.push('/courier/requests')}>
                <Text style={{ fontSize: 14 }}>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.redBg }]}>
                <Text style={{ fontSize: 14 }}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

export default function HomeScreen() {
  const role = useAuthStore(s => s.activeRole);
  const user = useAuthStore(s => s.user);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>{role === 'courier' ? 'Courier Dashboard' : 'Good morning'} 👋</Text>
          <Text style={styles.userName}>{user?.displayName?.split(' ')[0] || 'Waleed'}</Text>
        </View>
        <View style={styles.topRight}>
          {role === 'courier' ? (
            <Badge text="Verified" color={colors.green} />
          ) : (
            <TouchableOpacity style={styles.bellBtn}>
              <Text style={{ fontSize: 20 }}>🔔</Text>
              <View style={styles.bellDot} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {role === 'courier' ? <CourierHome /> : <SenderHome />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  greeting: { fontSize: fontSize.sm, color: colors.gray400, fontFamily: fonts.bodyMedium },
  userName: { fontFamily: fonts.heading, fontSize: fontSize.xxl, color: colors.night, marginTop: 2 },
  topRight: { alignItems: 'flex-end' },
  bellBtn: { position: 'relative' },
  bellDot: {
    position: 'absolute', top: -1, right: -1,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: colors.orange,
    borderWidth: 1.5, borderColor: colors.white,
  },
  scroll: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: colors.night },
  seeAll: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold, color: colors.teal },

  heroBanner: {
    backgroundColor: colors.teal,
    borderRadius: radius.xl,
    padding: 22,
    marginBottom: 20,
  },
  courierBanner: {
    backgroundColor: colors.orange,
    borderRadius: radius.xl,
    padding: 22,
    marginBottom: 20,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  heroBadgeText: { fontSize: 11, color: colors.white, fontFamily: fonts.bodyBold, letterSpacing: 1 },
  heroTitle: { fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.white, marginBottom: 4 },
  heroSub: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.65)', marginBottom: 16, lineHeight: 20 },
  heroBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  heroBtnText: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: fontSize.sm },

  shipCard: { marginBottom: 10, backgroundColor: colors.white },
  shipTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  shipInfo: { flex: 1, marginRight: 10 },
  shipName: { fontFamily: fonts.bodyBold, fontSize: fontSize.md, color: colors.night },
  shipSub: { fontSize: fontSize.sm, color: colors.gray400, marginTop: 3 },
  shipMeta: { flexDirection: 'row', gap: 24, borderTopWidth: 1, borderTopColor: colors.gray100, paddingTop: 12 },
  metaLabel: { fontSize: fontSize.xs, color: colors.gray400, marginBottom: 3 },
  metaValue: { fontSize: fontSize.md - 1, fontFamily: fonts.bodySemiBold, color: colors.night },

  routeRow: { flexDirection: 'row', gap: 10, paddingHorizontal: spacing.xl, paddingBottom: 4 },
  routeChip: {
    minWidth: 130,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  routeFlag: { fontSize: 14, marginBottom: 6 },
  routeText: { fontFamily: fonts.bodyBold, fontSize: fontSize.md, color: colors.night },
  routeCount: { fontSize: fontSize.xs + 1, color: colors.gray400, marginTop: 3 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { width: '48%', borderRadius: radius.lg, padding: 16 },
  statValue: { fontFamily: fonts.headingBold, fontSize: fontSize.xxl },
  statLabel: { fontSize: fontSize.xs + 1, color: colors.gray500, fontFamily: fonts.bodyMedium, marginTop: 2 },

  requestRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  requestActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
