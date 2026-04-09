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
    <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 20 }}>
      <TouchableOpacity
        style={styles.heroBanner}
        onPress={() => router.push('/shipment/create')}
        activeOpacity={0.9}
      >
        <Text style={styles.heroTitle}>Send a Package</Text>
        <Text style={styles.heroSub}>Find a traveler heading to your destination</Text>
        <View style={styles.heroBtn}>
          <Text style={styles.heroBtnText}>Get Started →</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Active Shipments</Text>
      {mockShipments.map(s => (
        <Card
          key={s.shipmentId}
          style={styles.shipmentCard}
          onPress={() => router.push('/shipment/tracking')}
        >
          <View style={styles.shipmentHeader}>
            <View>
              <Text style={styles.shipmentName}>{s.description} → {s.destinationCity}</Text>
              <Text style={styles.shipmentSub}>with {s.courierName}</Text>
            </View>
            <Badge
              text={STATUS_LABELS[s.status]}
              color={s.status === 'delivered' ? colors.green : colors.orange}
            />
          </View>
          <View style={styles.shipmentMeta}>
            <View>
              <Text style={styles.metaLabel}>Weight</Text>
              <Text style={styles.metaValue}>{s.weightKg} kg</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Price</Text>
              <Text style={styles.metaValue}>${s.agreedPrice}</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>{s.status === 'delivered' ? 'Delivered' : 'ETA'}</Text>
              <Text style={styles.metaValue}>{s.status === 'delivered' ? 'Apr 10' : 'Apr 14'}</Text>
            </View>
          </View>
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Popular Routes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -spacing.xl }}>
        <View style={styles.routeRow}>
          {POPULAR_ROUTES.map(r => (
            <View key={r.to} style={styles.routeChip}>
              <Text style={styles.routeText}>{r.from} → {r.to}</Text>
              <Text style={styles.routeCount}>{r.count} travelers</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

function CourierHome() {
  const stats = [
    { label: 'Earnings', value: '$84', icon: '💰', bg: colors.teal },
    { label: 'Deliveries', value: '7', icon: '📦', bg: colors.orange },
    { label: 'Rating', value: '4.9', icon: '⭐', bg: '#EAB308' },
    { label: 'Trust', value: '82', icon: '🛡️', bg: colors.green },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.statsGrid}>
        {stats.map(s => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: s.bg + '10', borderColor: s.bg + '20' }]}>
            <Text style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</Text>
            <Text style={[styles.statValue, { color: s.bg }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.courierBanner}
        onPress={() => router.push('/courier/create-trip')}
        activeOpacity={0.9}
      >
        <Text style={styles.heroTitle}>List a New Trip</Text>
        <Text style={styles.heroSub}>Earn from your unused luggage space</Text>
        <View style={styles.heroBtn}>
          <Text style={styles.heroBtnText}>Create Listing →</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Active Deliveries</Text>
      <Card style={styles.shipmentCard}>
        <View style={styles.shipmentHeader}>
          <Text style={styles.shipmentName}>Gift from Waleed S.</Text>
          <Badge text="Picked Up" color={colors.teal} />
        </View>
        <Text style={styles.shipmentSub}>1.5kg · Deliver to Ahmed M. in Nasr City</Text>
        <View style={{ marginTop: 10 }}>
          <Button title="Update Status" onPress={() => router.push('/courier/status')} variant="secondary" small />
        </View>
      </Card>

      <TouchableOpacity
        style={styles.requestsHeader}
        onPress={() => router.push('/courier/requests')}
      >
        <Text style={styles.sectionTitle}>Incoming Requests ({mockIncomingRequests.length})</Text>
        <Text style={styles.viewAll}>View All →</Text>
      </TouchableOpacity>
      {mockIncomingRequests.slice(0, 1).map(r => (
        <Card key={r.id} style={[styles.shipmentCard, { borderColor: colors.orange + '30' }]}>
          <View style={styles.requestRow}>
            <Avatar color={r.senderAvatar} name={r.senderName} size={36} />
            <View style={{ flex: 1 }}>
              <Text style={styles.shipmentName}>{r.senderName}</Text>
              <Text style={styles.shipmentSub}>{r.category} · {r.weightKg}kg · ${r.price}</Text>
            </View>
            <View style={styles.requestActions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.greenBg }]}
                onPress={() => router.push('/courier/requests')}
              >
                <Text>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.redBg }]}>
                <Text>✕</Text>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>{role === 'courier' ? 'Courier Dashboard' : 'Good morning'}</Text>
          <Text style={styles.userName}>{user?.displayName?.split(' ')[0] || 'Waleed'} {role === 'courier' ? '✈️' : '👋'}</Text>
        </View>
        {role === 'courier' ? (
          <Badge text="Verified" color={colors.green} />
        ) : (
          <TouchableOpacity style={styles.bellWrap}>
            <Text style={{ fontSize: 24 }}>🔔</Text>
            <View style={styles.bellDot} />
          </TouchableOpacity>
        )}
      </View>
      {role === 'courier' ? <CourierHome /> : <SenderHome />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: 12 },
  greeting: { fontSize: fontSize.md - 1, color: colors.gray400 },
  userName: { fontFamily: fonts.heading, fontSize: fontSize.xxl, color: colors.night },
  bellWrap: { position: 'relative' },
  bellDot: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.orange },
  scroll: { flex: 1, paddingHorizontal: spacing.xl },
  heroBanner: { backgroundColor: colors.teal, borderRadius: radius.xl, padding: 24, marginBottom: 20 },
  courierBanner: { backgroundColor: colors.orange, borderRadius: radius.xl, padding: 24, marginBottom: 20 },
  heroTitle: { fontFamily: fonts.bodyBold, fontSize: fontSize.lg, color: colors.white, marginBottom: 4 },
  heroSub: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.6)', marginBottom: 16 },
  heroBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16, alignSelf: 'flex-start' },
  heroBtnText: { color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: fontSize.md - 1 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: colors.night, marginBottom: 12 },
  shipmentCard: { marginBottom: 12 },
  shipmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  shipmentName: { fontFamily: fonts.bodyBold, fontSize: fontSize.md },
  shipmentSub: { fontSize: fontSize.sm, color: colors.gray400 },
  shipmentMeta: { flexDirection: 'row', gap: 20 },
  metaLabel: { fontSize: fontSize.xs, color: colors.gray400 },
  metaValue: { fontSize: fontSize.md - 1, fontFamily: fonts.bodySemiBold },
  routeRow: { flexDirection: 'row', gap: 10, paddingHorizontal: spacing.xl, paddingBottom: 4 },
  routeChip: { minWidth: 120, backgroundColor: colors.gray100, borderRadius: radius.lg, padding: 14 },
  routeText: { fontFamily: fonts.bodyBold, fontSize: fontSize.md },
  routeCount: { fontSize: fontSize.xs + 1, color: colors.gray400, marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { width: '48%', borderRadius: radius.lg, padding: 16, borderWidth: 1 },
  statValue: { fontFamily: fonts.headingBold, fontSize: fontSize.xxl },
  statLabel: { fontSize: fontSize.xs + 1, color: colors.gray400, fontFamily: fonts.bodyMedium },
  requestsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  viewAll: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold, color: colors.orange },
  requestRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  requestActions: { flexDirection: 'row', gap: 6 },
  actionBtn: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
