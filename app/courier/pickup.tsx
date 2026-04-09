import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { useTripStore } from '@/stores/tripStore';
import Header from '@/components/ui/Header';
import { Card, Avatar } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const checklistItems = [
  { key: 'inspect', label: 'Inspect Package Contents', sub: 'Open and verify contents match description' },
  { key: 'photo', label: 'Photograph Contents', sub: 'Take a timestamped photo as evidence' },
  { key: 'sender', label: 'Sender Confirmed Handoff', sub: 'Sender taps "Handed Over" on their end' },
  { key: 'courier', label: 'I Confirm Receipt', sub: "You've received the package and it's safe" },
];

export default function PickupScreen() {
  const request = useTripStore(s => s.selectedRequest);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const allDone = checklistItems.every(c => checked[c.key]);

  const toggle = (key: string) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Package Pickup" />
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }}>
        <Card style={styles.requestCard}>
          <View style={styles.requestRow}>
            <Avatar color={request?.senderAvatar || colors.nightLight} name={request?.senderName || 'Youssef Ali'} size={40} />
            <View>
              <Text style={styles.name}>{request?.senderName || 'Youssef Ali'}</Text>
              <Text style={styles.sub}>{request?.category || 'Electronics'} · {request?.weightKg || 2}kg · ${request?.price || 18}</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.heading}>Pickup Checklist</Text>
        <Text style={styles.headingSub}>Complete all steps to confirm pickup</Text>

        <View style={styles.checklist}>
          {checklistItems.map(item => (
            <TouchableOpacity
              key={item.key}
              onPress={() => toggle(item.key)}
              activeOpacity={0.8}
              style={[styles.checkItem, checked[item.key] && styles.checkItemDone]}
            >
              <View style={[styles.checkBox, checked[item.key] && styles.checkBoxDone]}>
                {checked[item.key] && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.checkLabel}>{item.label}</Text>
                <Text style={styles.checkSub}>{item.sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {!allDone && (
          <View style={styles.warningBox}>
            <Text style={{ fontSize: 16 }}>🛡️</Text>
            <Text style={styles.warningText}>
              You can refuse any package that looks suspicious or doesn't match the description — no penalty.
            </Text>
          </View>
        )}

        <Button title="Confirm Pickup" onPress={() => router.push('/courier/status')} full disabled={!allDone} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.xl },
  requestCard: { marginBottom: 16 },
  requestRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  name: { fontFamily: fonts.bodyBold, fontSize: fontSize.md },
  sub: { fontSize: fontSize.sm, color: colors.gray400 },
  heading: { fontFamily: fonts.heading, fontSize: fontSize.lg, marginBottom: 4 },
  headingSub: { fontSize: fontSize.sm, color: colors.gray400, marginBottom: 16 },
  checklist: { gap: 10, marginBottom: 20 },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.gray200, backgroundColor: colors.white },
  checkItemDone: { borderColor: colors.green, backgroundColor: colors.green + '08' },
  checkBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.gray200, alignItems: 'center', justifyContent: 'center' },
  checkBoxDone: { backgroundColor: colors.green },
  checkMark: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 14 },
  checkLabel: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.md - 1 },
  checkSub: { fontSize: fontSize.xs + 1, color: colors.gray400 },
  warningBox: { flexDirection: 'row', gap: 10, backgroundColor: colors.orangeBg, borderRadius: radius.md, padding: 12, marginBottom: 16, alignItems: 'flex-start' },
  warningText: { flex: 1, fontSize: fontSize.sm, color: colors.gray600, lineHeight: 20 },
});
