import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';
import { POPULAR_ROUTES } from '@/lib/constants';

const SENDER_ACTIONS = [
  { icon: '📦', title: 'Send a Package', sub: 'Find a traveler going to your destination', color: colors.teal, route: '/shipment/create' },
  { icon: '🔍', title: 'Browse Travelers', sub: 'See all available trips and carriers', color: colors.tealLight, route: '/shipment/browse-travelers' },
];

const COURIER_ACTIONS = [
  { icon: '✈️', title: 'List a New Trip', sub: 'Earn from your unused luggage space', color: colors.orange, route: '/courier/create-trip' },
  { icon: '🗺️', title: 'My Trips', sub: 'Manage your active and past trip listings', color: colors.teal, route: '/courier/my-trips' },
];

export default function ShipTab() {
  const role = useAuthStore(s => s.activeRole);
  const actions = role === 'courier' ? COURIER_ACTIONS : SENDER_ACTIONS;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{role === 'courier' ? 'Courier' : 'Ship'}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

        <View style={styles.actionsGrid}>
          {actions.map(a => (
            <TouchableOpacity
              key={a.title}
              style={[styles.actionCard, { borderLeftColor: a.color, borderLeftWidth: 4 }]}
              onPress={() => router.push(a.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: a.color + '15' }]}>
                <Text style={{ fontSize: 26 }}>{a.icon}</Text>
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{a.title}</Text>
                <Text style={styles.actionSub}>{a.sub}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {role === 'sender' && (
          <>
            <Text style={styles.sectionTitle}>Popular Routes</Text>
            <View style={styles.routeGrid}>
              {POPULAR_ROUTES.map(r => (
                <TouchableOpacity
                  key={r.to}
                  style={styles.routeCard}
                  onPress={() => router.push('/shipment/create')}
                  activeOpacity={0.75}
                >
                  <Text style={styles.routeFlag}>✈️</Text>
                  <Text style={styles.routeText}>{r.from} → {r.to}</Text>
                  <Text style={styles.routeCount}>{r.count} travelers</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {role === 'courier' && (
          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>This month's earnings</Text>
            <Text style={styles.earningsValue}>$84.00</Text>
            <View style={styles.earningsRow}>
              {[
                { label: 'Deliveries', value: '7' },
                { label: 'Rating', value: '4.9 ⭐' },
                { label: 'Trust Score', value: '82' },
              ].map(s => (
                <View key={s.label} style={styles.earningsStat}>
                  <Text style={styles.earningsStatValue}>{s.value}</Text>
                  <Text style={styles.earningsStatLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.prohibitedCard}>
          <Text style={styles.prohibitedTitle}>🚫 Prohibited Items</Text>
          <Text style={styles.prohibitedSub}>You may not carry:</Text>
          {['Weapons & ammunition', 'Illegal drugs', 'Flammable materials', 'Live animals', 'Counterfeit goods'].map(item => (
            <Text key={item} style={styles.prohibitedItem}>· {item}</Text>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100 },
  header: {
    paddingHorizontal: spacing.xl, paddingVertical: 14,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  title: { fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.night },
  body: { padding: spacing.xl, gap: 16, paddingBottom: 100 },
  actionsGrid: { gap: 10 },
  actionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: 16, borderWidth: 1, borderColor: colors.gray200,
  },
  actionIconWrap: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionText: { flex: 1 },
  actionTitle: { fontFamily: fonts.bodyBold, fontSize: fontSize.md, color: colors.night },
  actionSub: { fontSize: fontSize.sm, color: colors.gray400, marginTop: 2 },
  chevron: { fontSize: 22, color: colors.gray300 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: colors.night },
  routeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  routeCard: {
    width: '48%', backgroundColor: colors.white,
    borderRadius: radius.lg, padding: 14,
    borderWidth: 1, borderColor: colors.gray200,
  },
  routeFlag: { fontSize: 16, marginBottom: 6 },
  routeText: { fontFamily: fonts.bodyBold, fontSize: fontSize.md, color: colors.night },
  routeCount: { fontSize: fontSize.xs + 1, color: colors.gray400, marginTop: 3 },
  earningsCard: {
    backgroundColor: colors.night, borderRadius: radius.xl, padding: 20,
  },
  earningsLabel: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.5)', fontFamily: fonts.bodyMedium },
  earningsValue: { fontFamily: fonts.headingBold, fontSize: 36, color: colors.white, marginVertical: 4 },
  earningsRow: { flexDirection: 'row', marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 12 },
  earningsStat: { flex: 1, alignItems: 'center' },
  earningsStatValue: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: colors.white },
  earningsStatLabel: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  prohibitedCard: {
    backgroundColor: colors.redBg, borderRadius: radius.lg,
    padding: 14, borderWidth: 1, borderColor: colors.red + '20',
  },
  prohibitedTitle: { fontFamily: fonts.bodyBold, fontSize: fontSize.md, color: colors.night, marginBottom: 6 },
  prohibitedSub: { fontSize: fontSize.sm, color: colors.gray500, marginBottom: 4 },
  prohibitedItem: { fontSize: fontSize.sm, color: colors.gray600, lineHeight: 22 },
});
