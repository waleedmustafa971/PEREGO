import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const menuItems = [
  { label: 'Edit Profile', icon: '👤', color: colors.teal, route: '/profile/edit' },
  { label: 'Payment Methods', icon: '👛', color: colors.orange, route: '/profile/payment-methods' },
  { label: 'My Reviews', icon: '⭐', color: '#EAB308', route: null },
  { label: 'Notification Settings', icon: '🔔', color: colors.tealLight, route: '/profile/notification-settings' },
  { label: 'Help & FAQ', icon: '❓', color: colors.gray400, route: null },
];

export default function ProfileScreen() {
  const user = useAuthStore(s => s.user);
  const role = useAuthStore(s => s.activeRole);
  const switchRole = useAuthStore(s => s.switchRole);
  const logout = useAuthStore(s => s.logout);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => { logout(); router.replace('/auth/welcome'); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.header}>Profile</Text>
        {role === 'courier' && (
          <TouchableOpacity onPress={() => router.push('/courier/my-trips')} style={styles.tripsBtn}>
            <Text style={styles.tripsBtnText}>My Trips</Text>
          </TouchableOpacity>
        )}
        {role === 'sender' && (
          <TouchableOpacity onPress={() => router.push('/shipment/history')} style={styles.tripsBtn}>
            <Text style={styles.tripsBtnText}>History</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        <View style={styles.heroCard}>
          <Avatar color={colors.teal} name={user?.displayName || 'W A'} size={76} />
          <Text style={styles.name}>{user?.displayName || 'Waleed Alkhateeb'}</Text>
          <Text style={styles.member}>Member since Apr 2026</Text>
          <View style={styles.badges}>
            <Badge text="Verified" color={colors.green} />
            <Badge text={role === 'courier' ? 'Courier' : 'Sender'} color={colors.teal} />
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { value: '82', label: 'Trust Score', color: colors.teal, bg: colors.tealBg },
            { value: '4.9', label: 'Rating', color: colors.orange, bg: colors.orangeBg },
            { value: '7', label: 'Deliveries', color: colors.night, bg: colors.gray100 },
          ].map(s => (
            <View key={s.label} style={[styles.statBox, { backgroundColor: s.bg }]}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i === menuItems.length - 1 && { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
              onPress={() => item.route ? router.push(item.route as any) : null}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: item.color + '15' }]}>
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.switchWrap}>
          <Button
            title={`Switch to ${role === 'courier' ? 'Sender' : 'Courier'} Mode`}
            onPress={switchRole}
            variant="secondary"
            full
          />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
  header: { fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.night },
  tripsBtn: { backgroundColor: colors.tealBg, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  tripsBtnText: { fontSize: fontSize.sm, color: colors.teal, fontFamily: fonts.bodySemiBold },
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 28,
    paddingHorizontal: spacing.xl,
    marginBottom: 12,
  },
  name: { fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.night, marginTop: 12 },
  member: { fontSize: fontSize.sm, color: colors.gray400, marginTop: 3 },
  badges: { flexDirection: 'row', gap: 8, marginTop: 12 },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: spacing.xl, marginBottom: 12 },
  statBox: { flex: 1, alignItems: 'center', borderRadius: radius.lg, paddingVertical: 14 },
  statValue: { fontFamily: fonts.headingBold, fontSize: fontSize.xxl },
  statLabel: { fontSize: fontSize.xs, color: colors.gray400, fontFamily: fonts.bodyMedium, marginTop: 2 },
  section: { backgroundColor: colors.white, marginBottom: 12 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 15, paddingHorizontal: spacing.xl,
    borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  menuIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: fontSize.md, fontFamily: fonts.bodyMedium, color: colors.night },
  chevron: { fontSize: 20, color: colors.gray300 },
  switchWrap: { paddingHorizontal: spacing.xl, marginBottom: 12 },
  logoutBtn: { alignItems: 'center', paddingVertical: 16 },
  logoutText: { fontSize: fontSize.md - 1, color: colors.red, fontFamily: fonts.bodySemiBold },
});
