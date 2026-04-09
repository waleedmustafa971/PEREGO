import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, fontSize, spacing } from '@/lib/theme';
import Header from '@/components/ui/Header';

const SETTINGS = [
  {
    section: 'Shipments',
    items: [
      { key: 'shipment_matched', label: 'Traveler matched', sub: 'When a traveler accepts your request', default: true },
      { key: 'shipment_pickedup', label: 'Package picked up', sub: 'When your package is collected', default: true },
      { key: 'shipment_transit', label: 'In transit updates', sub: 'When the traveler departs and arrives', default: true },
      { key: 'shipment_delivered', label: 'Package delivered', sub: 'When the receiver confirms delivery', default: true },
    ],
  },
  {
    section: 'Courier',
    items: [
      { key: 'courier_request', label: 'New requests', sub: 'When someone wants to ship via your trip', default: true },
      { key: 'courier_payment', label: 'Payment released', sub: 'When escrow is released to your wallet', default: true },
    ],
  },
  {
    section: 'Messages',
    items: [
      { key: 'chat_message', label: 'New messages', sub: 'When you receive a chat message', default: true },
    ],
  },
  {
    section: 'Account',
    items: [
      { key: 'review_received', label: 'New reviews', sub: 'When someone leaves you a review', default: true },
      { key: 'promo', label: 'Promotions & offers', sub: 'Deals and feature updates from Perego', default: false },
    ],
  },
];

export default function NotificationSettingsScreen() {
  const initial: Record<string, boolean> = {};
  SETTINGS.forEach(s => s.items.forEach(item => { initial[item.key] = item.default; }));
  const [settings, setSettings] = useState(initial);

  const toggle = (key: string) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notification Settings" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {SETTINGS.map((group, gi) => (
          <View key={group.section} style={[styles.group, gi > 0 && { marginTop: 8 }]}>
            <Text style={styles.groupLabel}>{group.section}</Text>
            {group.items.map((item, i) => (
              <View key={item.key} style={[styles.row, i < group.items.length - 1 && styles.rowBorder]}>
                <View style={styles.rowContent}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Text style={styles.rowSub}>{item.sub}</Text>
                </View>
                <Switch
                  value={settings[item.key]}
                  onValueChange={() => toggle(item.key)}
                  trackColor={{ false: colors.gray200, true: colors.teal + '80' }}
                  thumbColor={settings[item.key] ? colors.teal : colors.gray300}
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray100 },
  group: { backgroundColor: colors.white },
  groupLabel: {
    fontSize: 11, fontFamily: fonts.bodySemiBold,
    textTransform: 'uppercase', letterSpacing: 1.5, color: colors.gray400,
    paddingHorizontal: spacing.xl, paddingTop: 16, paddingBottom: 8,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingVertical: 14,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  rowContent: { flex: 1, marginRight: 12 },
  rowLabel: { fontFamily: fonts.bodyMedium, fontSize: fontSize.md - 1, color: colors.night, marginBottom: 2 },
  rowSub: { fontSize: fontSize.xs + 1, color: colors.gray400, lineHeight: 17 },
});
