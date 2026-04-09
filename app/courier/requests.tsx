import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing } from '@/lib/theme';
import { mockIncomingRequests } from '@/lib/mockData';
import { useTripStore } from '@/stores/tripStore';
import Header from '@/components/ui/Header';
import { Card, Avatar } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function RequestsScreen() {
  const setSelectedRequest = useTripStore(s => s.setSelectedRequest);

  const handleAccept = (r: typeof mockIncomingRequests[0]) => {
    setSelectedRequest(r);
    router.push('/courier/pickup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Incoming Requests" />
      <Text style={styles.count}>2 requests for your DXB → CAI trip (Apr 14)</Text>
      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 30 }}>
        {mockIncomingRequests.map(r => (
          <Card key={r.id} style={styles.card}>
            <View style={styles.topRow}>
              <Avatar color={r.senderAvatar} name={r.senderName} size={40} />
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{r.senderName}</Text>
                  <Text style={styles.price}>${r.price}</Text>
                </View>
                <Text style={styles.rating}>⭐ {r.senderRating} ({r.senderReviews} reviews)</Text>
              </View>
            </View>

            <View style={styles.detailBox}>
              <View style={styles.detailRow}>
                <View><Text style={styles.detailLabel}>Category</Text><Text style={styles.detailValue}>{r.category}</Text></View>
                <View><Text style={styles.detailLabel}>Weight</Text><Text style={styles.detailValue}>{r.weightKg} kg</Text></View>
                <View><Text style={styles.detailLabel}>Photo</Text><Text style={styles.detailValue}>{r.hasPhoto ? '✓ Attached' : 'None'}</Text></View>
              </View>
              <Text style={styles.desc}>{r.description}</Text>
            </View>

            <View style={styles.actions}>
              <View style={{ flex: 1 }}><Button title="Accept" onPress={() => handleAccept(r)} full small /></View>
              <View style={{ flex: 1 }}><Button title="Decline" onPress={() => {}} variant="secondary" full small /></View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  count: { fontSize: fontSize.sm, color: colors.gray400, paddingHorizontal: spacing.xl, paddingBottom: 8 },
  list: { flex: 1, paddingHorizontal: spacing.xl },
  card: { marginBottom: 12, borderColor: colors.orange + '25', borderWidth: 1.5 },
  topRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontFamily: fonts.bodyBold, fontSize: fontSize.md },
  price: { fontFamily: fonts.headingBold, fontSize: fontSize.lg, color: colors.teal },
  rating: { fontSize: 11, color: colors.gray400, marginTop: 2 },
  detailBox: { backgroundColor: colors.gray100, borderRadius: 12, padding: 12, marginBottom: 12 },
  detailRow: { flexDirection: 'row', gap: 16, marginBottom: 6 },
  detailLabel: { fontSize: fontSize.xs, color: colors.gray400 },
  detailValue: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold },
  desc: { fontSize: fontSize.sm, color: colors.gray600 },
  actions: { flexDirection: 'row', gap: 8 },
});
