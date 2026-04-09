import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts, fontSize } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';

export default function SplashScreen() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(isAuthenticated ? '/(tabs)/home' : '/auth/welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🦅</Text>
      <Text style={styles.name}>perego</Text>
      <Text style={styles.tagline}>Deliver with trust</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  name: {
    fontFamily: fonts.headingBold,
    fontSize: fontSize.display,
    color: colors.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 8,
  },
});
