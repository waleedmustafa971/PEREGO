import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { mockTrackingSteps } from '@/lib/mockData';
import Header from '@/components/ui/Header';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function TrackingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Track Shipment" />
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 30 }}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Birthday Gift</Text>
            <Badge text="In Transit" color={colors.orange} />
          </View>
          <Text style={styles.summaryRoute}>Dubai → Cairo · with Sarah Khaled</Text>
        </Card>

        <View style={styles.timeline}>
          {mockTrackingSteps.map((s, i) => (
            <View key={i} style={styles.step}>
              {i < mockTrackingSteps.length - 1 && (
                <View style={[styles.line, { backgroundColor: s.done || s.current ? colors.teal : colors.gray200 }]} />
              )}
              <View style={[
                styles.dot,
                s.done && styles.dotDone,
                s.current && styles.dotCurrent,
              ]}>
                <Text style={styles.dotText}>{s.done ? '✓' : s.current ? '✈' : '○'}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepLabel, (s.done || s.current) && styles.stepLabelActive]}>{s.label}</Text>
                <Text style={styles.stepTime}>{s.time}{s.location ? ` · ${s.location}` : ''}</Text>
              </View>
            </View>
          ))}
        </View>

        <Button title="💬 Chat with Sarah" onPress={() => router.push('/chat/conversation')} variant="ghost" full />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.xl },
  summaryCard: { marginBottom: 16 },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryTitle: { fontFamily: fonts.bodyBold },
  summaryRoute: { fontSize: fontSize.sm, color: colors.gray400 },
  timeline: { marginBottom: 20 },
  step: { flexDirection: 'row', gap: 14, position: 'relative', paddingBottom: 24 },
  line: { position: 'absolute', left: 13, top: 28, bottom: 0, width: 2 },
  dot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.gray200,
    alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  dotDone: { backgroundColor: colors.green },
  dotCurrent: { backgroundColor: colors.orange, shadowColor: colors.orange, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  dotText: { color: colors.white, fontSize: 12, fontFamily: fonts.bodyBold },
  stepContent: { flex: 1 },
  stepLabel: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.md, color: colors.gray400 },
  stepLabelActive: { color: colors.night },
  stepTime: { fontSize: fontSize.sm, color: colors.gray400, marginTop: 2 },
});
