import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const menuItems = [
  { label: 'Edit Profile', icon: '👤' },
  { label: 'Payment Methods', icon: '👛' },
  { label: 'My Reviews', icon: '⭐' },
  { label: 'Notification Settings', icon: '🔔' },
  { label: 'Help & FAQ', icon: '❓' },
];

export default function ProfileScreen() {
  const user = useAuthStore(s => s.user);
  const role = useAuthStore(s => s.activeRole);
  const switchRole = useAuthStore(s => s.switchRole);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 40 }}>
        <View style={styles.avatarSection}>
          <Avatar color={colors.teal} name={user?.displayName || 'W A'} size={72} />
          <Text style={styles.name}>{user?.displayName || 'Waleed Alkhateeb'}</Text>
          <Text style={styles.member}>Member since Apr 2026</Text>
          <View style={styles.badges}>
            <Badge text="Verified" color={colors.green} />
            <Badge text={role === 'courier' ? 'Courier' : 'Sender'} color={colors.teal} />
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { value: '82', label: 'Trust Score', color: colors.teal },
            { value: '4.9', label: 'Rating', color: colors.orange },
            { value: '7', label: 'Deliveries', color: colors.night },
          ].map(s => (
            <View key={s.label} style={styles.statBox}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {menuItems.map(item => (
          <TouchableOpacity key={item.label} style={styles.menuItem}>
            <Text style={{ fontSize: 18 }}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={{ marginTop: 20 }}>
          <Button
            title={`Switch to ${role === 'courier' ? 'Sender' : 'Courier'} Mode`}
            onPress={switchRole}
            variant="ghost"
            full
            small
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { fontFamily: fonts.heading, fontSize: fontSize.xl, paddingHorizontal: spacing.xl, paddingVertical: 12 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  name: { fontFamily: fonts.heading, fontSize: fontSize.xl, marginTop: 10 },
  member: { fontSize: fontSize.sm, color: colors.gray400, marginTop: 2 },
  badges: { flexDirection: 'row', gap: 8, marginTop: 10 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: colors.gray100, borderRadius: radius.lg, padding: 14 },
  statValue: { fontFamily: fonts.headingBold, fontSize: fontSize.xl + 2 },
  statLabel: { fontSize: fontSize.xs, color: colors.gray400 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  menuLabel: { flex: 1, fontSize: fontSize.md, fontFamily: fonts.bodyMedium },
  chevron: { fontSize: 18, color: colors.gray300 },
});
