import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { COURIER_MILESTONES } from '@/lib/mockData';
import { useTripStore } from '@/stores/tripStore';
import Header from '@/components/ui/Header';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CourierStatusScreen() {
  const status = useTripStore(s => s.courierStatus);
  const advance = useTripStore(s => s.advanceStatus);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Update Status" />
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTitle}>Gift from Youssef A.</Text>
            <Badge text={COURIER_MILESTONES[status].label} color={status < 2 ? colors.orange : colors.green} />
          </View>
          <Text style={styles.summarySub}>Electronics · 2kg · Deliver to receiver in Nasr City</Text>
        </Card>

        <Text style={styles.heading}>Delivery Progress</Text>

        <View style={styles.timeline}>
          {COURIER_MILESTONES.map((m, i) => (
            <View key={i} style={styles.step}>
              {i < COURIER_MILESTONES.length - 1 && (
                <View style={[styles.line, { backgroundColor: i < status ? colors.green : colors.gray200 }]} />
              )}
              <TouchableOpacity
                onPress={() => { if (i === status + 1) advance(); }}
                style={[
                  styles.dot,
                  i <= status && styles.dotDone,
                  i === status + 1 && styles.dotNext,
                ]}
              >
                {i <= status ? (
                  <Text style={styles.dotCheck}>✓</Text>
                ) : (
                  <Text style={{ fontSize: 14 }}>{m.icon}</Text>
                )}
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={[
                  styles.stepLabel,
                  i <= status && { color: colors.night },
                  i === status + 1 && { color: colors.orange },
                ]}>{m.label}</Text>
                <Text style={styles.stepSub}>
                  {i <= status ? 'Completed' : i === status + 1 ? 'Tap circle to mark done' : m.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {status < COURIER_MILESTONES.length - 1 ? (
          <Button
            title={`Mark as ${COURIER_MILESTONES[Math.min(status + 1, 3)].label}`}
            onPress={advance}
            variant="orange"
            full
          />
        ) : (
          <Button title="Confirm Delivery with Receiver" onPress={() => router.push('/courier/delivery')} full />
        )}

        <View style={{ marginTop: 12 }}>
          <Button title="💬 Chat with Sender" onPress={() => router.push('/chat/conversation')} variant="ghost" full small />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.xl },
  summaryCard: { marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryTitle: { fontFamily: fonts.bodyBold },
  summarySub: { fontSize: fontSize.sm, color: colors.gray400 },
  heading: { fontFamily: fonts.heading, fontSize: fontSize.lg, marginBottom: 16 },
  timeline: { gap: 0, marginBottom: 24 },
  step: { flexDirection: 'row', gap: 14, position: 'relative', paddingBottom: 20 },
  line: { position: 'absolute', left: 15, top: 34, bottom: 0, width: 2 },
  dot: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.gray200,
    alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  dotDone: { backgroundColor: colors.green },
  dotNext: { backgroundColor: colors.orange, shadowColor: colors.orange, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  dotCheck: { color: colors.white, fontFamily: fonts.bodyBold },
  stepLabel: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.md, color: colors.gray400 },
  stepSub: { fontSize: fontSize.xs + 1, color: colors.gray400 },
});
