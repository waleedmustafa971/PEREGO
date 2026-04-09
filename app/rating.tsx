import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { Avatar } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const QUICK_TAGS = ['On time', 'Handled with care', 'Great communicator', 'Trustworthy', 'Would ship again'];

export default function RatingScreen() {
  const params = useLocalSearchParams<{ name?: string; role?: string }>();
  const name = params.name || 'Sarah Khaled';
  const role = params.role || 'courier';

  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successWrap}>
          <View style={styles.successCircle}>
            <Text style={{ fontSize: 36 }}>⭐</Text>
          </View>
          <Text style={styles.successTitle}>Thanks for the review!</Text>
          <Text style={styles.successSub}>
            Your feedback helps build trust in the Perego community.
          </Text>
          <Button title="Back to Home" onPress={() => router.replace('/(tabs)/home')} full />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <Avatar color={colors.orange} name={name} size={72} />
          <Text style={styles.heading}>Rate {name}</Text>
          <Text style={styles.sub}>
            {role === 'courier' ? 'How was your delivery experience?' : 'How was sending with this person?'}
          </Text>
        </View>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setStars(s)}
              onPressIn={() => setHovered(s)}
              onPressOut={() => setHovered(0)}
              activeOpacity={0.8}
            >
              <Text style={[styles.star, (s <= (hovered || stars)) && styles.starActive]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>

        {stars > 0 && (
          <Text style={styles.starLabel}>
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][stars]}
          </Text>
        )}

        {stars > 0 && (
          <>
            <Text style={styles.tagsLabel}>What went well?</Text>
            <View style={styles.tagsWrap}>
              {QUICK_TAGS.map(tag => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[styles.tag, selectedTags.includes(tag) && styles.tagActive]}
                >
                  <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextActive]}>
                    {selectedTags.includes(tag) ? '✓ ' : ''}{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.reviewLabel}>Leave a comment (optional)</Text>
            <TextInput
              value={review}
              onChangeText={setReview}
              placeholder="Share details about your experience..."
              placeholderTextColor={colors.gray300}
              multiline
              style={styles.reviewInput}
            />

            <Button title="Submit Review" onPress={handleSubmit} full style={styles.submitBtn} />
            <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { paddingHorizontal: spacing.xl, paddingTop: 40, paddingBottom: 40 },
  topSection: { alignItems: 'center', marginBottom: 28 },
  heading: { fontFamily: fonts.heading, fontSize: fontSize.xxl, color: colors.night, marginTop: 14, marginBottom: 6 },
  sub: { fontSize: fontSize.md - 1, color: colors.gray400, textAlign: 'center', lineHeight: 22 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 10 },
  star: { fontSize: 44, color: colors.gray200 },
  starActive: { color: '#F59E0B' },
  starLabel: { textAlign: 'center', fontFamily: fonts.bodyBold, fontSize: fontSize.lg, color: '#F59E0B', marginBottom: 24 },
  tagsLabel: { fontSize: 11, fontFamily: fonts.bodySemiBold, textTransform: 'uppercase', letterSpacing: 1.5, color: colors.gray400, marginBottom: 10 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    borderWidth: 1.5, borderColor: colors.gray200, backgroundColor: colors.white,
  },
  tagActive: { borderColor: colors.teal, backgroundColor: colors.teal + '10' },
  tagText: { fontSize: fontSize.sm, fontFamily: fonts.bodyMedium, color: colors.gray500 },
  tagTextActive: { color: colors.teal, fontFamily: fonts.bodySemiBold },
  reviewLabel: { fontSize: 11, fontFamily: fonts.bodySemiBold, textTransform: 'uppercase', letterSpacing: 1.5, color: colors.gray400, marginBottom: 8 },
  reviewInput: {
    borderWidth: 1.5, borderColor: colors.gray200, borderRadius: radius.lg,
    padding: 14, minHeight: 90, fontSize: fontSize.md - 1,
    fontFamily: fonts.body, color: colors.night,
    textAlignVertical: 'top', marginBottom: 20,
  },
  submitBtn: { marginBottom: 10 },
  skipBtn: { alignItems: 'center', paddingVertical: 10 },
  skipText: { fontSize: fontSize.md - 1, color: colors.gray400 },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  successCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  successTitle: { fontFamily: fonts.heading, fontSize: fontSize.xxl, color: colors.night, marginBottom: 8, textAlign: 'center' },
  successSub: { fontSize: fontSize.md - 1, color: colors.gray400, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
});
