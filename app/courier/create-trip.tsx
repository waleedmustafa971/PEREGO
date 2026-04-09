import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import Header from '@/components/ui/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const categories = [
  { key: 'gift', label: '🎁 Gifts', on: true },
  { key: 'documents', label: '📄 Documents', on: true },
  { key: 'clothing', label: '👕 Clothes', on: true },
  { key: 'electronics', label: '📱 Electronics', on: true },
  { key: 'food', label: '🍪 Food', on: false },
];

export default function CreateTrip() {
  const [accepted, setAccepted] = useState(categories.map(c => c.on));

  return (
    <SafeAreaView style={styles.container}>
      <Header title="List a Trip" />
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }}>
        <Input label="From" value="Dubai, UAE" icon="📍" />
        <Input label="To" value="Cairo, Egypt" icon="📍" />
        <Input label="Travel Date" value="Apr 14, 2026" icon="🕐" />
        <Input label="Available Weight (kg)" value="5" icon="⚖️" keyboardType="numeric" />
        <Input label="Price per kg ($)" value="6" icon="💰" keyboardType="numeric" />

        <Text style={styles.catLabel}>Accepted Items</Text>
        <View style={styles.catRow}>
          {categories.map((c, i) => (
            <TouchableOpacity
              key={c.key}
              onPress={() => { const a = [...accepted]; a[i] = !a[i]; setAccepted(a); }}
              style={[styles.catChip, accepted[i] ? styles.catOn : styles.catOff]}
            >
              <Text style={[styles.catText, accepted[i] ? styles.catTextOn : styles.catTextOff]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.uploadBox}>
          <Text style={{ fontSize: 24 }}>✈️</Text>
          <Text style={styles.uploadText}>Upload flight booking proof</Text>
        </TouchableOpacity>

        <Input label="Pickup Zone" value="Dubai Marina" icon="📍" />
        <Input label="Delivery Zone" value="Nasr City, Heliopolis" icon="📍" />

        <Button title="Publish Trip" onPress={() => router.back()} variant="orange" full />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.xl },
  catLabel: { fontSize: 11, fontFamily: fonts.bodySemiBold, textTransform: 'uppercase', letterSpacing: 1.5, color: colors.gray400, marginBottom: 8 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  catChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  catOn: { backgroundColor: colors.tealBg },
  catOff: { backgroundColor: colors.gray100 },
  catText: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold },
  catTextOn: { color: colors.teal },
  catTextOff: { color: colors.gray400 },
  uploadBox: { borderWidth: 2, borderColor: colors.gray300, borderStyle: 'dashed', borderRadius: radius.lg, padding: 20, alignItems: 'center', marginBottom: 16, gap: 4 },
  uploadText: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold, color: colors.gray500 },
});
