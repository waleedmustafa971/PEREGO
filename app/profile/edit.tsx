import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/ui/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Card';

export default function EditProfileScreen() {
  const user = useAuthStore(s => s.user);
  const [name, setName] = useState(user?.displayName || 'Waleed Alkhateeb');
  const [email, setEmail] = useState(user?.email || 'waleed@email.com');
  const [phone, setPhone] = useState(user?.phone || '+971 50 123 4567');
  const [bio, setBio] = useState('Frequent traveler between UAE and Egypt. Trusted courier since 2024.');

  const handleSave = () => {
    Alert.alert('Saved', 'Your profile has been updated.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Edit Profile" />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Avatar color={colors.teal} name={name} size={80} />
            <TouchableOpacity style={styles.cameraBtn}>
              <Text style={{ fontSize: 14 }}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </View>

        <Input label="Full Name" value={name} onChangeText={setName} icon="👤" />
        <Input label="Email" value={email} onChangeText={setEmail} icon="✉️" keyboardType="email-address" />
        <Input label="Phone" value={phone} onChangeText={setPhone} icon="📱" keyboardType="phone-pad" />
        <Input label="Bio" value={bio} onChangeText={setBio} icon="📝" multiline />

        <View style={styles.verifiedNote}>
          <Text style={{ fontSize: 16 }}>🛡️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.verifiedTitle}>Identity Verified</Text>
            <Text style={styles.verifiedSub}>Your ID documents have been approved. Contact support to update them.</Text>
          </View>
        </View>

        <Button title="Save Changes" onPress={handleSave} full />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatarWrap: { position: 'relative' },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.gray200,
    alignItems: 'center', justifyContent: 'center',
  },
  changePhotoText: { marginTop: 10, fontSize: fontSize.sm, color: colors.teal, fontFamily: fonts.bodySemiBold },
  verifiedNote: {
    flexDirection: 'row', gap: 12, backgroundColor: colors.greenBg,
    borderRadius: radius.lg, padding: 14, marginBottom: 20, alignItems: 'flex-start',
  },
  verifiedTitle: { fontFamily: fonts.bodyBold, fontSize: fontSize.md - 1, color: colors.night, marginBottom: 2 },
  verifiedSub: { fontSize: fontSize.sm, color: colors.gray500, lineHeight: 18 },
});
