import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { CATEGORIES } from '@/lib/constants';
import Header from '@/components/ui/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CreateShipment() {
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('gift');

  return (
    <SafeAreaView style={styles.container}>
      <Header title="New Shipment" />
      <View style={styles.progress}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.bar, i <= step && styles.barActive]} />
        ))}
      </View>
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }}>
        {step === 0 && (
          <>
            <Text style={styles.heading}>Where to?</Text>
            <Input label="From" value="Dubai, UAE" icon="📍" editable={false} />
            <Input label="To" placeholder="Destination city" icon="📍" value="Cairo, Egypt" />
            <Input label="Preferred Date Range" icon="🕐" value="Apr 14 - Apr 18" />
            <Button title="Next" onPress={() => setStep(1)} full />
          </>
        )}
        {step === 1 && (
          <>
            <Text style={styles.heading}>Package Details</Text>
            <Text style={styles.catLabel}>Category</Text>
            <View style={styles.catGrid}>
              {CATEGORIES.map(c => (
                <TouchableOpacity
                  key={c.key}
                  onPress={() => setSelectedCategory(c.key)}
                  style={[styles.catChip, selectedCategory === c.key && styles.catChipActive]}
                >
                  <Text style={styles.catChipText}>{c.emoji} {c.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input label="Description" value="Birthday gift - perfume set" icon="📝" />
            <View style={styles.row}>
              <View style={{ flex: 1 }}><Input label="Weight (kg)" value="1.5" icon="⚖️" keyboardType="numeric" /></View>
              <View style={{ flex: 1 }}><Input label="Value ($)" value="40" icon="💰" keyboardType="numeric" /></View>
            </View>
            <TouchableOpacity style={styles.photoBox}>
              <Text style={{ fontSize: 24 }}>📷</Text>
              <Text style={styles.photoText}>Upload package photo</Text>
            </TouchableOpacity>
            <Button title="Next" onPress={() => setStep(2)} full />
          </>
        )}
        {step === 2 && (
          <>
            <Text style={styles.heading}>Receiver Info</Text>
            <Input label="Full Name" value="Ahmed Mohamed" icon="👤" />
            <Input label="Phone" value="+20 112 345 6789" icon="📱" keyboardType="phone-pad" />
            <Input label="Address" value="Nasr City, Cairo" icon="📍" />
            <View style={styles.infoBox}>
              <Text style={{ fontSize: 16 }}>🛡️</Text>
              <Text style={styles.infoText}>
                The receiver will get a tracking link via SMS to follow the delivery status.
              </Text>
            </View>
            <Button title="Find Travelers →" onPress={() => router.push('/shipment/browse-travelers')} variant="orange" full />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  progress: { flexDirection: 'row', gap: 4, paddingHorizontal: spacing.xl, paddingBottom: 12 },
  bar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.gray200 },
  barActive: { backgroundColor: colors.orange },
  body: { flex: 1, paddingHorizontal: spacing.xl },
  heading: { fontFamily: fonts.heading, fontSize: fontSize.xl, marginBottom: 16, color: colors.night },
  catLabel: { fontSize: 11, fontFamily: fonts.bodySemiBold, textTransform: 'uppercase', letterSpacing: 1.5, color: colors.gray400, marginBottom: 8 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  catChip: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, borderColor: colors.gray200, backgroundColor: colors.white },
  catChipActive: { borderColor: colors.teal, backgroundColor: colors.teal + '08' },
  catChipText: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold },
  row: { flexDirection: 'row', gap: 10 },
  photoBox: { borderWidth: 2, borderColor: colors.gray300, borderStyle: 'dashed', borderRadius: radius.lg, padding: 20, alignItems: 'center', marginBottom: 16, gap: 4 },
  photoText: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold, color: colors.gray500 },
  infoBox: { flexDirection: 'row', gap: 10, backgroundColor: colors.orangeBg, borderRadius: radius.md, padding: 14, marginBottom: 20, alignItems: 'flex-start' },
  infoText: { flex: 1, fontSize: fontSize.sm, color: colors.gray600, lineHeight: 20 },
});
