import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/lib/theme';

export default function TrackTab() {
  const role = useAuthStore(s => s.activeRole);

  useEffect(() => {
    if (role === 'courier') {
      router.push('/courier/requests');
    } else {
      router.push('/shipment/history');
    }
  }, [role]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
      <ActivityIndicator color={colors.teal} />
    </View>
  );
}
