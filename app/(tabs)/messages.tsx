import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { colors } from '@/lib/theme';

export default function MessagesTab() {
  useEffect(() => {
    router.push('/chat/index');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
      <ActivityIndicator color={colors.teal} />
    </View>
  );
}
